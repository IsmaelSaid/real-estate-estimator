import {Mutation} from "@prisma/client";
import _ from "lodash";
import { harvesineDistance} from "@/app/models/distances";

export class KMeans {
    get classification(): (Mutation & { cluster: number })[] {
        return this._classification;
    }

    set classification(value: (Mutation & { cluster: number })[]) {
        this._classification = value;
    }

    private _k!: number;
    private _X_train!: Mutation[];
    private _centroids: { longitude: number; latitude: number }[];
    private _classification!: (Mutation & { cluster: number })[]

    constructor(k: number, centroids: { longitude: number; latitude: number }[] = []) {
        this.classification = []
        this._k = k;
        if (!_.isEmpty(centroids) && _.size(centroids) != this._k) {
            throw new Error('Centroids length should be ' + this.k)
        }
        this._centroids = centroids
        return this
    }

    get X_train(): Mutation[] {
        return this._X_train;
    }

    set X_train(value: Mutation[]) {
        this._X_train = value;
    }

    get centroids(): { longitude: number; latitude: number }[] | undefined {
        return this._centroids;
    }

    set centroids(value: { longitude: number; latitude: number }[]) {
        this._centroids = value;
    }

    get k(): number {
        return this._k;
    }

    set k(value: number) {
        this._k = value;
    }

    public fit(X_train: Mutation[]): KMeans {
        this.X_train = X_train;

        if (_.isEmpty(this._centroids)) {
            // Initialize centroids randomly from the data points
            this._centroids = _.sampleSize(X_train, this.k).map((mutation: Mutation) => {
                console.info(mutation)
                return {
                    longitude: mutation.longitude,
                    latitude: mutation.latitude,

                }
            });
        }


        let mutationClusters: (Mutation & { cluster: number })[] = [];
        let hasConverged = false;
        let iterations = 0;

        while (iterations < 100) {
            // Assign clusters
            try {
                mutationClusters = _.map(this.X_train, (mutation: Mutation) => {
                    const from = [mutation.longitude, mutation.latitude];
                    const distances = _.map(this.centroids, (to: {
                        longitude: number,
                        latitude: number
                    }) => harvesineDistance(from, [to.longitude, to.latitude]));
                    const min = _.min(distances);
                    const index = _.indexOf(distances, min);
                    return {...mutation, cluster: index};
                });

            } catch (e) {
                console.error(e)

            }

            // Update centroids
            const newCentroids: {
                longitude: number;
                latitude: number
            }[] = _.map(this._centroids, (centroid, index) => {
                try {
                    const elementsWithinCluster = _.filter(mutationClusters, (mutation) => mutation.cluster === index);
                    if (_.isEmpty(elementsWithinCluster)) {
                        throw new Error('No elements in the cluster')
                    }
                    const newLongitude = _.meanBy(elementsWithinCluster, 'longitude');
                    const newLatitude = _.meanBy(elementsWithinCluster, 'latitude');
                    return {longitude: newLongitude, latitude: newLatitude};
                } catch (e) {
                    console.error(e)
                } finally {
                    return centroid
                }
            });

            // Check for convergence
            hasConverged = _.isEqual(this._centroids, newCentroids);

            this._centroids = newCentroids;
            this.classification = mutationClusters
            iterations++;
        }
        return this
    }

    public predict(targetMutation: Omit<Mutation, 'valeur_fonciere'>): number {
        try {
            const {longitude, latitude} = targetMutation
            const from = [longitude, latitude]
            const distances: number[] = _.chain(this._centroids).map((coord: {
                longitude: number,
                latitude: number
            }) => {
                const to = [coord.longitude, coord.latitude]
                return harvesineDistance(from, to)
            }).value()
            const min = _.min(distances)
            return _.indexOf(distances, min)
        } catch (e) {
            console.error(e)
        }
        return -1
    }
}
