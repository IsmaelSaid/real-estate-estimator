import { trainingDataKmeans} from "@/app/models/TestsData";
import {KMeans} from "@/app/models/KMeans";
import {KMeansRegressor} from "@/app/models/KMeansRegressor";
import _ from "lodash";

describe('',()=>{
    const {target, X_train, Y_train} = trainingDataKmeans
    test('',()=>{
        const centroids : {longitude: number, latitude: number}[] = [
            {
                longitude : -20.880981,
                latitude : 55.454564
            },
            {
                longitude : -20.889213,
                latitude : 55.454176
            },
            {
                longitude : -20.885249,
                latitude : 55.463793
            }
        ]
        const kmeans: KMeans = new KMeans(3)
        kmeans.fit(X_train)
    })

    test('',()=>{
        const kmeansRegressor : KMeansRegressor = new KMeansRegressor(new KMeans(2))
        kmeansRegressor.fit(X_train)


    })

    test('Target should be in the cluster 0',()=>{
        const kmeans: KMeans = new KMeans(2)
        kmeans.fit(X_train)
        const result = kmeans.predict(target)
        expect(result).toBe(0)
    })

    test('Should predict in adequation with cluster classification', ()=>{
        const kmeansRegressor: KMeansRegressor = new KMeansRegressor(new KMeans((100)))
        kmeansRegressor.fit(X_train)
        const trueValue:number = _.chain(X_train).filter({'code_commune':97411}).meanBy('valeur_fonciere').value()
        expect(kmeansRegressor.predict(target)).toBe(trueValue)
    })



})