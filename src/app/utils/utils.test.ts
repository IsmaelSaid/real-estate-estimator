import { Mutation } from "@prisma/client";
import {
    buildOppdnDataSoftUrl,
    calculateSquareMeterValue,
    calculateSquareMeterValueByYear,
    countPropertyTypesByCity,
    countPropertyTypesByYear, SeparateNumbersFromStrings
} from "@/app/utils/utils";


const pseudoMutations: Mutation[] = [
    {
        date_mutation: new Date('2020-01-01'), valeur_fonciere: 100, surface_reelle_bati: 10,
        new_id_mutation: "",
        id_mutation: "",
        nature_mutation: "",
        adresse_numero: 0,
        adresse_nom_voie: "",
        adresse_code_voie: "",
        code_postal: 974,
        code_commune: 97418,
        nom_commune: "Sainte Marie",
        code_departement: 974,
        nombre_lots: 0,
        type_local: "Maison",
        nombre_pieces_principales: 0,
        longitude: 0,
        latitude: 0
    },
    {
        date_mutation: new Date('2020-01-01'), valeur_fonciere: 200, surface_reelle_bati: 20,
        new_id_mutation: "",
        id_mutation: "",
        nature_mutation: "",
        adresse_numero: 0,
        adresse_nom_voie: "",
        adresse_code_voie: "",
        code_postal: 974,
        code_commune: 97418,
        nom_commune: "Sainte Marie",
        code_departement: 974,
        nombre_lots: 0,
        type_local: "Appartement",
        nombre_pieces_principales: 0,
        longitude: 0,
        latitude: 0
    },
    {
        date_mutation: new Date('2021-01-01'), valeur_fonciere: 200, surface_reelle_bati: 20,
        new_id_mutation: "",
        id_mutation: "",
        nature_mutation: "",
        adresse_numero: 0,
        adresse_nom_voie: "",
        adresse_code_voie: "",
        code_postal: 974,
        code_commune: 97418,
        nom_commune: "Sainte Marie",
        code_departement: 974,
        nombre_lots: 0,
        type_local: "Appartement",
        nombre_pieces_principales: 0,
        longitude: 0,
        latitude: 0
    }, {
        date_mutation: new Date('2021-01-01'), valeur_fonciere: 200, surface_reelle_bati: 20,
        new_id_mutation: "",
        id_mutation: "",
        nature_mutation: "",
        adresse_numero: 0,
        adresse_nom_voie: "",
        adresse_code_voie: "",
        code_postal: 974,
        code_commune: 97418,
        nom_commune: "Sainte Marie",
        code_departement: 974,
        nombre_lots: 0,
        type_local: "Maison",
        nombre_pieces_principales: 0,
        longitude: 0,
        latitude: 0
    },
];


describe('calculateSquareMeterValue', () => {
    it('should calculate square meter value correctly for given mutation', () => {
        const result = calculateSquareMeterValue(pseudoMutations[0]);
        expect(result).toBe(10);
    });
})
describe('calculateSquareMeterValueByYear', () => {

    it('should calculate square meter value correctly', () => {
        const result = calculateSquareMeterValueByYear(pseudoMutations);
        expect(result).toStrictEqual([{ year: 2020, pricesPerSquarMeter: [20, 10] }]);
    });
});

describe('countPropertyTypesByCity', () => {
    it('should count property types correctly', () => {
        const result = countPropertyTypesByCity(pseudoMutations);
        expect(result).toStrictEqual([{ city: '97418 Sainte Marie', count: { Maison: 1, Appartement: 1 } }]);
    });
});

describe('countPropertyTypesByYear', () => {
    it('should count property types correctly for given year', () => {
        const result = countPropertyTypesByYear(pseudoMutations);
        expect(result).toStrictEqual([
            {
                "Appartement": 1,
                "Maison": 1,
                "year": 2020
            }
        ]);
    });
});

describe('PrepareUserInput function should works if', () => {

    test('Valid strings and numbers', () => {
        const testUserInput = "14 rue georges marchais 97441 Sainte Suzanne"
        const expectedPreparedUserInput = {
            numbers: [14, 97441],
            strings: ['RUE', 'GEORGES', 'MARCHAIS', 'SAINTE', 'SUZANNE']
        }

        expect(SeparateNumbersFromStrings(testUserInput)).toStrictEqual(expectedPreparedUserInput)
    })
    test('No valid strings', () => {
        const testUserInput = "14 97441"
        const expectedPreparedUserInput = {
            numbers: [14, 97441],
            strings: []
        }

        expect(SeparateNumbersFromStrings(testUserInput)).toStrictEqual(expectedPreparedUserInput)
    })

    test('No numbers', () => {
        const testUserInput = "rue georges marchais sainte-suzanne"
        const expectedPreparedUserInput = {
            numbers: [],
            strings: ['RUE', 'GEORGES', 'MARCHAIS', 'SAINTE', 'SUZANNE']
        }

        expect(SeparateNumbersFromStrings(testUserInput)).toStrictEqual(expectedPreparedUserInput)
    })

    test('Empty string', () => {
        const testUserInput = ""
        const expectedPreparedUserInput = {
            numbers: [],
            strings: []
        }

        expect(SeparateNumbersFromStrings(testUserInput)).toStrictEqual(expectedPreparedUserInput)
    })

})

describe('buildOpenDataSoftUrl should works', () => {
    test('Search on complete url', () => {
        const testUserInput = "14 rue georges marchais 97441 Sainte-Suzanne"
        const url = 'https://data.regionreunion.com/api/explore/v2.1/catalog/datasets/ban-lareunion/records?where=search(*,\'RUE GEORGES MARCHAIS SAINTE SUZANNE\') and numero in (14,97441)&limit=20'
        expect(buildOppdnDataSoftUrl(testUserInput)).toBe(url)
    })

    test('Search on strings only', () => {
        const testUserInput = "rue georges marchais Sainte-Suzanne"
        const url = 'https://data.regionreunion.com/api/explore/v2.1/catalog/datasets/ban-lareunion/records?where=search(*,\'RUE GEORGES MARCHAIS SAINTE SUZANNE\')&limit=20'
        expect(buildOppdnDataSoftUrl(testUserInput)).toBe(url)
    })

    test('Search on numbers only', () => {
        const testUserInput = "14 97441"
        const url = 'https://data.regionreunion.com/api/explore/v2.1/catalog/datasets/ban-lareunion/records?where=numero in (14,97441)&limit=20'
        expect(buildOppdnDataSoftUrl(testUserInput)).toBe(url)
    })

    test('Search on empty user input', () => {
        const testUserInput = ""
        const url = 'https://data.regionreunion.com/api/explore/v2.1/catalog/datasets/ban-lareunion/records?limit=20'
        expect(buildOppdnDataSoftUrl(testUserInput)).toBe(url)
    })

})
