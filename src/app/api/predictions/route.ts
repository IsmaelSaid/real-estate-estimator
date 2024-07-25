import prisma from "../../../../prisma/prisma";
import {NextResponse} from "next/server";
import {Mutation} from "@prisma/client";
import {KNearestNeighborsRegressor} from "@/app/models/KNearestNeighborsRegressor";
import {extractTrainingData} from "@/app/utils/utils";
import {CityRegressor} from "@/app/models/CityRegressor";
import {RadiusRegressor} from "@/app/models/RadiusRegressor";
import {KMeansRegressor} from "@/app/models/KMeansRegressor";
import {KMeans} from "@/app/models/KMeans";
import _ from "lodash";
import {mode} from "simple-statistics";

/*
export const POST = async (request: Request) => {
    try {
        const userInput: Omit<Mutation, 'valeur_fonciere'> = await request.json()
        const knn: KNearestNeighborsRegressor = new KNearestNeighborsRegressor(100)
        const cityRegressor: CityRegressor = new CityRegressor()
        const radiusRegressor :  RadiusRegressor = new RadiusRegressor(1)
        const kmeansRegressor : KMeansRegressor = new  KMeansRegressor(new KMeans(10))
        const dataset: Mutation[] = await prisma.mutation.findMany()
        const X_train: Mutation[] = extractTrainingData(dataset,'Appartement',9,200,10000,500000)

        knn.fit(X_train,[])
        cityRegressor.fit(X_train,[])
        radiusRegressor.fit(X_train, [])
        kmeansRegressor.fit(X_train)
        return NextResponse.json(
            {prediction: {
                KNN: knn.predict(userInput),
                CityRegressor: cityRegressor.predict(userInput),
                RadiusRegressor: radiusRegressor.predict(userInput),
                KMeansRegressor: kmeansRegressor.predict(userInput)
            }

            }, {status: 200});

    } catch (e: any) {
        return NextResponse.json({msg: 'error: ' + e.message, stack: e.stack}, {status: 400});
    }
}*/

export const POST = async (request: Request) => {
    try {
        const userInput: {
            target: Omit<Mutation, 'valeur_fonciere'>, model: {
                modelName: string,
                parameters: Object
            }
        } = await request.json()

        const dataset: Mutation[] = await prisma.mutation.findMany()
        const X_train: Mutation[] = extractTrainingData(dataset,userInput.target.type_local,9,200,10000,900000)

        interface Model {
            fit: (X_train: any[], Y_train: any[]) => void;
            predict: (targetMutation: Omit<Mutation, 'valeur_fonciere'>) => number;

        }
        const model = inferModel(userInput.model) as Model
        model.fit(X_train,[])

        return NextResponse.json({model: userInput.model,prediction : model.predict(userInput.target)})



    } catch (e: any) {
        return NextResponse.json({msg: 'error: ' + e.message, stack: e.stack}, {status: 400});
    }
}

const inferModel = (model: { modelName: string, parameters: Object})=>{
    switch (model.modelName) {
        case 'CityRegressor':
            return new CityRegressor()
            break;
        case 'RadiusRegressor':
            return new RadiusRegressor(_.get(model.parameters,'radius',1))
            break;
        case "KNNRegressor":
            return new KNearestNeighborsRegressor(_.get(model.parameters,'numberOfNeighbors',1))

        case "KMeansRegressor":
            return new KNearestNeighborsRegressor(_.get(model.parameters,'numberOfClusters',1))
    }

    return model
}