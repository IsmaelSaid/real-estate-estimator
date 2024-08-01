import { Mutation } from "@prisma/client";
import _ from "lodash";
import { distancesFromTarget } from "@/app/models/distances";
/**
 * This module provides a K-Nearest Neighbors (KNN) Regressor class.
 */
export class KNearestNeighborsRegressor {
  /**
   * @private
   * @type {number}
   * @description The number of nearest neighbors to consider for the prediction.
   */
  private _k!: number;

  /**
   * @private
   * @type {Mutation[]}
   * @description The training data features (mutations).
   */
  private _X_train: Mutation[] = [] as Mutation[];

  /**
   * @private
   * @type {number[]}
   * @description The training data target values.
   */
  private _Y_train: number[] = [] as number[];

  /**
   * @constructor
   * @param {number} k - The number of nearest neighbors to use for prediction.
   */
  constructor(k: number) {
    this.k = k;
  }

  /**
   * @type {Mutation[]}
   * @description Gets the training data features.
   */
  get X_train(): Mutation[] {
    return this._X_train;
  }

  /**
   * @type {number[]}
   * @description Gets the training data target values.
   */
  get Y_train(): number[] {
    return this._Y_train;
  }

  /**
   * @type {Mutation[]}
   * @description Sets the training data features.
   * @param {Mutation[]} value - The training data features to set.
   */
  set X_train(value: Mutation[]) {
    this._X_train = value;
  }

  /**
   * @type {number[]}
   * @description Sets the training data target values.
   * @param {number[]} value - The training data target values to set.
   */
  set Y_train(value: number[]) {
    this._Y_train = value;
  }

  /**
   * @type {number}
   * @description Gets the number of nearest neighbors.
   */
  get k(): number {
    return this._k;
  }

  /**
   * @type {number}
   * @description Sets the number of nearest neighbors.
   * @param {number} value - The number of nearest neighbors to set.
   */
  set k(value: number) {
    this._k = value;
  }

  /**
   * @method predict
   * @description Predicts the target value for a given mutation based on the k-nearest neighbors.
   * @param {Omit<Mutation, 'valeur_fonciere'>} targetMutation - The mutation to predict the target value for, excluding 'valeur_fonciere'.
   * @returns {number} The predicted target value.
   */
  public predict(targetMutation: Omit<Mutation, "valeur_fonciere">): number {
    const distances = distancesFromTarget(targetMutation, this.X_train);
    const knn = _.chain(distances).sortBy("distance").take(this.k).value();
    return _.meanBy(knn, "valeur_fonciere");
  }

  /**
   * @method fit
   * @description Fits the regressor with the training data.
   * @param {Mutation[]} X_train - The training data features.
   * @param {number[]} Y_train - The training data target values.
   */
  public fit(X_train: Mutation[], Y_train: number[]): void {
    this.X_train = X_train;

    this.Y_train = Y_train;
  }
}
