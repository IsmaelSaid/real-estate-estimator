import { Mutation } from "@prisma/client";
import _ from "lodash";
import {KMeans} from "@/app/models/KMeans";


export class KMeansRegressor {
    private _X_train!: Mutation[];

    get kmeans(): KMeans {
        return this._kmeans;
    }

    set kmeans(value: KMeans) {
        this._kmeans = value;
    }

    private _kmeans!: KMeans;

    constructor(kmeans: KMeans) {
        this.kmeans = kmeans

    }

    get X_train(): Mutation[] {
        return this._X_train;
    }

    set X_train(value: Mutation[]) {
        this._X_train = value;
    }

    public fit(X_train: Mutation[]): void {
        this.kmeans.fit(X_train)
    }

    public predict(targetMutation: Omit<Mutation, 'valeur_fonciere'>): number{
        const cluster: number = this.kmeans.predict(targetMutation)
        console.info(this.kmeans.centroids)
        return _.chain(this.kmeans.classification).filter((mutation : Mutation & {cluster: number})=>mutation.cluster === cluster).meanBy('valeur_fonciere').value()
    }




}
