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
export const countPropertyTypesByCity = (mutations: Mutation[]) => {
    return _.chain(mutations)
        .groupBy((mutation) => `${mutation.code_commune} ${mutation.nom_commune}`)
        .map((value, city) => {
            const count = _.countBy(value, 'type_local');
            return {city: city, count: count};
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

export const extractTrainingData = (mutation: Mutation[],
                                    typeLocal: string,
                                    minSurface: number = 0,
                                    maxSurface: number = Number.MAX_VALUE,
                                    minValeurFonciere: number = 0,
                                    maxValeurFonciere: number = Number.MAX_VALUE,
) => {
    const filterMutations = (mutation: Mutation) => {
        return mutation.type_local === typeLocal &&
            mutation.surface_reelle_bati > minSurface &&
            mutation.surface_reelle_bati < maxSurface &&
            mutation.valeur_fonciere > minValeurFonciere &&
            mutation.valeur_fonciere < maxValeurFonciere;
    };
    return _.chain(mutation).uniqBy('id_mutation').filter((mutation: Mutation) => filterMutations(mutation) && isVente(mutation)).sortBy('valeur_fonciere').value()

}


function toRadians(degrees: number) {
    return degrees * Math.PI / 180;
}


const fetchAddresses = async (search: string) => {
    const splitted = _.chain(search).split(' ').value()
    let preparedInput: { strings: string[], numbers: number[] } = {strings: [], numbers: []}
    _.chain(splitted).forEach((value) => {
        const convertedNumber = _.isNumber(Number(value))
        if (_.isNumber(convertedNumber)) {
            preparedInput.numbers.push(convertedNumber)
        } else {
            preparedInput.strings.push(_.toUpper(value))
        }
    }).value()

    const url = 'https://data.regionreunion.com/api/explore/v2.1/catalog/datasets/ban-lareunion/records?where=search(*,\'RUE MARCEL PAGNOL SAINNTE MARIE\') and numero in (3)&limit=20'

}

/**
 * This function separates numbers from strings to easily use search API from ODS
 * @param search
 */
export const SeparateNumbersFromStrings = (search: string): { strings: string[], numbers: number[] } => {
    let preparedInput: { strings: string[], numbers: number[] } = _.chain(search).toUpper().split(/[\s-]+/).reduce((acc, current) => {
        if(current === "") {
            return acc
        }
        const numb: number = Number(current)
        let nextAcc = _.clone(acc)
        if (!isNaN(numb)) {
            nextAcc.numbers.push(numb);

        } else {
            nextAcc.strings.push(current);
        }
        return nextAcc
    }, {strings: [] as string[], numbers: [] as number[]}).value()
    return preparedInput
}

/**
 * This function builds a parametrized url for ODS request
 * @param search
 */
export const buildOppdnDataSoftUrl = (search : string) : string =>{
    const separatedStringsFromNumbers = SeparateNumbersFromStrings(search)
    let whereParameters = ''
    const {strings, numbers} = separatedStringsFromNumbers
    const isNotEmptyStrings = !_.isEmpty(strings)
    const isNotEmptyNumbers = !_.isEmpty(numbers)
    if (isNotEmptyStrings && isNotEmptyNumbers) {
        whereParameters = `?where=search(*,'${strings.join(' ')}') and numero in (${numbers.join(',')})&limit=100`
    } else if (isNotEmptyStrings){
        whereParameters = `?where=search(*,'${strings.join(' ')}')&limit=100`
    } else if(isNotEmptyNumbers){
        whereParameters = `?where=numero in (${numbers.join(',')})&limit=100`
    }else{
        whereParameters = '?limit=20'
    }
    return `https://data.regionreunion.com/api/explore/v2.1/catalog/datasets/ban-lareunion/records${whereParameters}`
}
