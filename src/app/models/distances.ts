import {toRadians} from "chart.js/helpers";
import {Mutation} from "@prisma/client";
import _ from "lodash";
import distance from "@turf/distance";
import {point} from "@turf/helpers";

/**
 * Calculates the Euclidean distance between two coordinates.
 * @param {number[]} coord1 - The first coordinate [longitude, latitude].
 * @param {number[]} coord2 - The second coordinate [longitude, latitude].
 * @returns {number} The Euclidean distance between the two coordinates.
 */
export function euclideanDistance(coord1: number[], coord2: number[]) {
    const [lat1, lon1] = coord1.map(toRadians);
    const [lat2, lon2] = coord2.map(toRadians);

    const x1 = Math.cos(lon1) * Math.cos(lat1);
    const y1 = Math.sin(lon1) * Math.cos(lat1);
    const z1 = Math.sin(lat1);

    const x2 = Math.cos(lon2) * Math.cos(lat2);
    const y2 = Math.sin(lon2) * Math.cos(lat2);
    const z2 = Math.sin(lat2);

    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);

    return distance * 6371;
}

/**
 * Calculates the Haversine distance between two coordinates.
 * @param {number[]} coord1 - The first coordinate [longitude, latitude].
 * @param {number[]} coord2 - The second coordinate [longitude, latitude].
 * @returns {number} The Haversine distance between the two coordinates.
 */
export function harvesineDistance(coord1: number[], coord2: number[]) : number {
/*    console.info('coord1',coord1)
    console.info('coord2',coord2)*/
    const from = point(coord1);
    const to = point(coord2);

    return distance(from,to)

}

/**
 * Calculates the distance between two mutations using a provided distance function.
 * @param {Omit<Mutation, 'valeur_fonciere'>} mut1 - The first mutation.
 * @param {Mutation} mut2 - The second mutation.
 * @param {(point1: number[], point2: number[]) => number} distanceFunction - The function to calculate the distance.
 * @returns {number} The distance between the two mutations.
 */
export function mutationDistance(mut1: Omit<Mutation, 'valeur_fonciere'>, mut2: Mutation, distanceFunction: (point1: number[], point2: number[]) => number) {
    const {longitude: longitudeMut1, latitude: latitudeMut1} = mut1
    const {longitude: longitudeMut2, latitude: latitudeMut2} = mut2

    return distanceFunction(
        [longitudeMut1, latitudeMut1],
        [longitudeMut2, latitudeMut2])
}


/**
 * Calculates the distances from a target mutation to a list of mutations.
 * @param {Omit<Mutation, 'valeur_fonciere'>} targetMutation - The target mutation.
 * @param {Mutation[]} X_train - The list of mutations.
 * @returns {(Mutation & {distance : number})[]} The list of mutations with their distances from the target.
 */
export const distancesFromTarget = (targetMutation: Omit<Mutation, 'valeur_fonciere'>, X_train: Mutation[]): (Mutation & {distance : number})[] => {
    return _.map(X_train,(mutation: Mutation)=>{
        const distance = mutationDistance(targetMutation, mutation,euclideanDistance)
        return {...mutation, distance: distance }
    })
}