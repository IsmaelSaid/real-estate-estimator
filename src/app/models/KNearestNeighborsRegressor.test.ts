import {KNearestNeighborsRegressor} from "@/app/models/KNearestNeighborsRegressor";
import {trainingData} from "@/app/models/TestsData";

describe('KNN', () => {
    const {target, X_train, Y_train} = trainingData

    const knnRegressor = new KNearestNeighborsRegressor(3)
    knnRegressor.fit(X_train, Y_train)


    it('should calculate the correct prediction for the given target', () => {
        const result = knnRegressor.predict(target)
        expect(result).toBe(10)
    });
});
