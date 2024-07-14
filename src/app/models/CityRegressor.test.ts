import {CityRegressor} from "@/app/models/CityRegressor";
import {Mutation} from "@prisma/client";
import {trainingData} from "@/app/models/TestsData";
import _ from "lodash";

/**
 * This test suite is for the CityRegressor class.
 */
describe('City regressor ',()=>{
    // Extracting the target, X_train, and Y_train from the training data
    const {target, X_train, Y_train} = trainingData

    // Creating target data for code_commune 97418 and 97411
    const target97418 = _.find(X_train,(mutation: Mutation)=>mutation.code_commune === 97418) as Omit<Mutation, 'valeur_fonciere'>
    const target97411 = _.chain(target97418).clone().set('code_commune',97411).value()

    // Creating a new instance of CityRegressor
    const cityRegressor = new CityRegressor()

    // Fitting the model with X_train and an empty array
    cityRegressor.fit(X_train, [])

    /**
     * Test case for checking the correct prediction for 97418.
     * The expected result is 180.
     */
    test('Should calculate te correct prediction for 97418',()=>{
        const result = cityRegressor.predict(target97418)
        expect(result).toBe(180)
    })

    /**
     * Test case for checking the correct prediction for 97411.
     * The expected result is 150.
     */
    test('Should calculate te correct prediction for 97411',()=>{
        const result = cityRegressor.predict(target97411)
        expect(result).toBe(150)
    })

    /**
     * Test case for checking the length of the model.
     * The expected result is 2.
     */
    test('The length of the model should be equal to the number of city in the dataset',()=>{
        const result = cityRegressor.model.length
        expect(result).toBe(2)
    })

})