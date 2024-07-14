import {RadiusRegressor} from "@/app/models/RadiusRegressor";
import {trainingData} from "@/app/models/TestsData";

describe('Radius regressor',()=>{
    // Distance from target to id2 : .320
    // Distance from target to id3 : .224
    // Distance from target to id4 : .529
    // Distance from target to id5 : .449
    // Distance from target to id6 : .579
    const {target, X_train, Y_train} = trainingData

    test('Should calculate the correct prediction with a radius of 0.5',()=>{
        const radiusRegressor = new RadiusRegressor(0.5)
        radiusRegressor.fit(X_train, Y_train)
        const result = radiusRegressor.predict(target)

        // The model should predicts base on the price of id2, id3, id5 (100+200+200) / 3 Euro

        expect(result).toBe(((100+200+200)/3))
    })

    test('Should calculate the correct prediction with a radius of 0.35',()=>{
        const radiusRegressor = new RadiusRegressor(0.35)
        radiusRegressor.fit(X_train, Y_train)
        const result = radiusRegressor.predict(target)

        // The model should predicts base on the price of id2, id3 (100+200) / 2

        expect(result).toBe(((100+200)/2))
    })
})