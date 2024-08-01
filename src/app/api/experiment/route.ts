/* eslint-disable */

import { NextResponse } from "next/server";
import { Mutation } from "@prisma/client";
import _ from "lodash";
import { KNearestNeighborsRegressor } from "../../models/KNearestNeighborsRegressor.ts";
import { extractTrainingData, modelToString } from "../../utils/utils.ts";
import { CityRegressor } from "../../models/CityRegressor.ts";
import { RadiusRegressor } from "../../models/RadiusRegressor.ts";
import prisma from "../../../../prisma/prisma.ts";

const inferModel = (model: { modelName: string; parameters: Object }) => {
  switch (model.modelName) {
    case "CityRegressor":
      return new CityRegressor();
    case "RadiusRegressor":
      return new RadiusRegressor(_.get(model.parameters, "radius", 1));
    case "KNNRegressor":
      return new KNearestNeighborsRegressor(
        _.get(model.parameters, "numberOfNeighbors", 1),
      );

    case "KMeansRegressor":
      return new KNearestNeighborsRegressor(
        _.get(model.parameters, "numberOfClusters", 1),
      );
    default:
      return new CityRegressor();
  }
};

export const POST = async (request: Request) => {
  try {
    // retrieves models and experimental settings
    const userInput: {
      models: { modelName: string; parameters: Object }[];
      settings: {
        numberOfPredictions: number;
        typeoflocal: string;
      };
    } = await request.json();

    interface Model {
      // eslint-disable-next-line no-unused-vars
      fit: (X_train: any[], Y_train: any[]) => void;
      // eslint-disable-next-line no-unused-vars
      predict: (targetMutation: Omit<Mutation, "valeur_fonciere">) => number;
    }

    const dataset: Mutation[] = await prisma.mutation.findMany();
    const typeoflocal = userInput.settings.typeoflocal === "House" ? "Maison" : "Appartement";
    const xTrain: Mutation[] = extractTrainingData(
      dataset,
      typeoflocal,
      9,
      100,
      50000,
      500000,
    );

    // remove random mutation

    console.info("diff");
    const targets = _.sampleSize(
      xTrain,
      userInput.settings.numberOfPredictions,
    );
    const updatedXTrain = _.chain(xTrain).difference(targets).value();
    console.info("enddif");

    const constInferModels: Model[] = _.chain(userInput.models)
      .map((model) => inferModel(model))
      .value();

    constInferModels.forEach((model) => model.fit(updatedXTrain, []));

    const results: {
      modelName: string;
      predictions: number[];
      trueValues: number[];
    }[] = _.chain(constInferModels)
      .map((model, modelIndex) => {
        // all predictions
        const predictions = _.chain(targets)
          .map((target) => model.predict(target))
          .value();
        const trueValues = _.map(targets, (target) => target.valeur_fonciere);

        const asboluteError = _.chain(predictions)
          .map((preditecValue, index) =>
            Math.abs(preditecValue - targets[index].valeur_fonciere),
          )
          .value();

        const MAE = _.mean(asboluteError);

        return {
          modelName: `${userInput.models[modelIndex].modelName}:${modelToString(userInput.models[modelIndex])}`,
          predictions: predictions,
          trueValues: trueValues,
        };
      })
      .value();

    const response = _.extend({ results: results }, { targets: targets });

    return NextResponse.json(response, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { msg: `error: ${e.message}`, stack: e.stack },
      { status: 400 },
    );
  }
};
