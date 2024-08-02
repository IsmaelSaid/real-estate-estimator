import { NextResponse } from "next/server";
import { Mutation, PrismaClient } from "@prisma/client";
import { KNearestNeighborsRegressor } from "@/app/models/KNearestNeighborsRegressor.ts";
import { extractTrainingData } from "@/app/utils/utils.ts";
import { CityRegressor } from "@/app/models/CityRegressor.ts";
import { RadiusRegressor } from "@/app/models/RadiusRegressor.ts";
import _ from "lodash";
import prisma from "@/app/prisma/prisma";




const inferModel = (model: { modelName: string, parameters: Object }) => {
    switch (model.modelName) {
        case 'CityRegressor':
            return new CityRegressor()
        case 'RadiusRegressor':
            return new RadiusRegressor(_.get(model.parameters, 'radius', 1))
        case "KNNRegressor":
            return new KNearestNeighborsRegressor(_.get(model.parameters, 'numberOfNeighbors', 1))

        case "KMeansRegressor":
            return new KNearestNeighborsRegressor(_.get(model.parameters, 'numberOfClusters', 1))
        default:
            return new CityRegressor()
    }
}

export const POST = async (request: Request) => {
    try {
        const userInput: {
            target: Omit<Mutation, 'valeur_fonciere'>, model: {
                modelName: string,
                parameters: Object
            }
        } = await request.json()
        const dataset: Mutation[] = await prisma.mutation.findMany()
        const xTrain: Mutation[] = extractTrainingData(dataset, userInput.target.type_local, 9, 200, 10000, 900000)
        interface Model {
            // eslint-disable-next-line no-unused-vars
            fit: (X_train: any[], Y_train: any[]) => void;
            // eslint-disable-next-line no-unused-vars
            predict: (targetMutation: Omit<Mutation, 'valeur_fonciere'>) => number;
        }
        const model = inferModel(userInput.model) as Model
        model.fit(xTrain, [])
        return NextResponse.json({ model: userInput.model, prediction: model.predict(userInput.target) })

    } catch (e: any) {
        return NextResponse.json({ msg: `error: ${e.message}`, stack: e.stack }, { status: 400 });
    }
}

