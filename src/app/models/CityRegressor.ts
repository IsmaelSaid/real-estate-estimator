import { Mutation } from "@prisma/client";
import _ from "lodash";

/**
 * CityRegressor is a class that represents a model for predicting values based on city codes.
 */
export class CityRegressor {
  private _X_train: Mutation[] = [] as Mutation[];
  private _Y_train: number[] = [] as number[];
  private _model: { code_commune: number; prediction: number }[] = [];

  /**
   * Getter for the model property.
   */
  get model(): { code_commune: number; prediction: number }[] {
    return this._model;
  }

  /**
   * Setter for the model property.
   */
  set model(value: { code_commune: number; prediction: number }[]) {
    this._model = value;
  }

  constructor() {}

  /**
   * Getter for the X_train property.
   *
   * @returns {Mutation[]} The X_train property.
   */
  get X_train(): Mutation[] {
    return this._X_train;
  }

  /**
   * Setter for the X_train property.
   * @param {Mutation[]} value - The new value for the X_train property.
   */
  set X_train(value: Mutation[]) {
    this._X_train = value;
  }

  /**
   * Getter for the Y_train property.
   * @returns {number[]} The Y_train property.
   */
  get Y_train(): number[] {
    return this._Y_train;
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
   * @throws {Error} If the model is not trained or no prediction found for the given code_commune.
   */
  public predict(targetMutation: Omit<Mutation, "valeur_fonciere">): number {
    if (this.model.length == 0) {
      throw new Error(`This model is not trained`);
    }
    const { code_commune } = targetMutation;
    const result = _.find(this.model, { code_commune: code_commune });
    if (!result) {
      throw new Error(`No prediction found for code_commune: ${code_commune}`);
    }
    return _.get(result, "prediction", -1);
  }

  /**
   * Fits the model with the given X_train and Y_train parameters.
   * @param {Mutation[]} X_train - The X_train data to fit the model.
   * @param {number[]} Y_train - The Y_train data to fit the model.
   */
  public fit(X_train: Mutation[], Y_train: number[]): void {
    this.X_train = X_train;
    this.Y_train = Y_train;

    this.model = _.chain(this._X_train)
      .groupBy((mutation: Mutation) => mutation.code_commune)
      .map((mutations: Mutation[], code_commune: string) => {
        return {
          code_commune: parseInt(code_commune),
          prediction: _.meanBy(mutations, "valeur_fonciere"),
        };
      })
      .value();
  }
}
