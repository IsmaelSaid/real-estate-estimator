import { Mutation } from "@prisma/client";
import _ from "lodash";
import { distancesFromTarget } from "@/app/models/distances";

/**
 * RadiusRegressor is a class that represents a model for predicting values based on a given radius.
 */
export class RadiusRegressor {
    private _X_train: Mutation[] = [] as Mutation[];
    private _Y_train: number[] = [] as number[];
    private _distance : number

    /**
     * Getter for the distance property.
     * @returns {number} The distance property.
     */
    get distance(): number {
        return this._distance;
    }

    /**
     * Setter for the distance property.
     * @param {number} value - The new value for the distance property.
     */
    set distance(value: number) {
        this._distance = value;
    }

    /**
     * Constructor for the RadiusRegressor class.
     * @param {number} distance - The distance to be used for predictions.
     */
    constructor(distance: number) {
        this._distance = distance;
    }

    /**
     * Getter for the X_train property.
     * @returns {Mutation[]} The X_train property.
     */
    get X_train(): Mutation[] {
        return this._X_train;
    }

    /**
     * Getter for the Y_train property.
     * @returns {number[]} The Y_train property.
     */
    get Y_train(): number[] {
        return this._Y_train;
    }

    /**
     * Setter for the X_train property.
     * @param {Mutation[]} value - The new value for the X_train property.
     */
    set X_train(value: Mutation[]) {
        this._X_train = value
    }

    /**
     * Setter for the Y_train property.
     * @param {number[]} value - The new value for the Y_train property.
     */
    set Y_train(value: number[]) {
        this._Y_train = value;
    }

    /**
     * Predicts a value based on the targetMutation parameter.
     * @param {Object} targetMutation - The target mutation to predict.
     * @returns {number} The predicted value.
     */
    public predict(targetMutation: Omit<Mutation, 'valeur_fonciere'>): number {
        const distances = distancesFromTarget(targetMutation, this.X_train);
        const sortedDistance =  _.chain(distances).sortBy((mutation: (Mutation & {distance : number}))=>mutation.distance).value()

        // find the index of the first element that is not within the distance range
        const index = _.findIndex(sortedDistance, (mutation : (Mutation & {distance : number}))=>!(mutation.distance < this.distance))

        return _.chain(sortedDistance).take(index).meanBy((mutation : Mutation & {distance : number})=>mutation.valeur_fonciere).value()
    }

    /**
     * Fits the model with the given X_train and Y_train parameters.
     * @param {Mutation[]} X_train - The X_train data to fit the model.
     * @param {number[]} Y_train - The Y_train data to fit the model.
     */
    public fit(X_train: Mutation[], Y_train: number[]): void {
        this.X_train = X_train;
        this.Y_train = Y_train;
    }
}