import _ from 'lodash'
import {Mutation} from "@prisma/client";

/**
 * This function calculates the square meter value
 *
 * @param {Mutation} mutation - The mutation object.
 * @returns {number} The square meter value for the mutation.
 */
export const calculateSquareMeterValue = (mutation: Mutation) => {
    return mutation.valeur_fonciere / mutation.surface_reelle_bati;
};

/**
 * This function calculates the square meter value by year.
 *
 * @param {Mutation[]} mutations - The mutations array.
 * @returns {Object[]} An array of objects, each containing the year and the prices per square meter for that year.
 */
export const calculateSquareMeterValueByYear = (mutations: Mutation[]) => {
    return _.chain(mutations)
        .groupBy(item => new Date(item.date_mutation).getFullYear())
        .map((value, year) => {
            const pricesPerSquareMeter = value.map((mutation: Mutation) => calculateSquareMeterValue(mutation))
            return {year: Number(year), pricesPerSquarMeter: pricesPerSquareMeter};
        })
        .value();
};


/**
 * This function groups the mutations by city and counts the types of local.
 *
 * @param {Mutation[]} mutations - The mutations array.
 * @returns {Object[]} An array of objects, each containing the city and the count of types of local for that city.
 */
export const countPropertyTypesByCity = (mutations : Mutation[]) => {
    return _.chain(mutations)
        .groupBy((mutation) => `${mutation.code_commune} ${mutation.nom_commune}`)
        .map((value, city) => {
            const count = _.countBy(value, 'type_local');
            return { city: city, count: count };
        })
        .orderBy(
            (mutation) => (mutation.count.Maison || 0) + (mutation.count.Appartement || 0),
            'desc'
        )
        .value();
};

/**
 * This function groups the mutations by year and counts the types of local.
 *
 * @param {Mutation[]} mutations - The mutations array.
 * @returns {Object[]} An array of objects, each containing the year and the count of types of local for that year.
 */
export const countPropertyTypesByYear = (mutations: Mutation[]) => {
    return _.chain(mutations)
        .groupBy(item => new Date(item.date_mutation).getFullYear())
        .map((value, year) => {
            const count = _.countBy(value, (mutation: Mutation) => mutation.type_local)
            return {year: Number(year), ...count};
        })
        .value();
};
export const isHouse = (mutation: Mutation) => mutation.type_local === 'Maison';
export const isAppartement = (mutation: Mutation) => mutation.type_local === 'Appartement';
export const isVente = (mutation: Mutation) => mutation.nature_mutation === 'Vente';
