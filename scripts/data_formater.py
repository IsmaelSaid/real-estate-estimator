import argparse
import pandas as pd

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Convert dates to ISO format.')
    parser.add_argument('filename', type=str, help='The name of the CSV file.')
    parser.add_argument('outputfilename', type=str, help='The name of the CSV output file.')
    args = parser.parse_args()
    df = pd.read_csv(args.filename)
    selected_columns = df[['id_mutation',
                           'date_mutation',
                           'nature_mutation',
                           'valeur_fonciere',
                           'adresse_numero',
                           'adresse_nom_voie',
                           'adresse_code_voie',
                           'code_postal',
                           'code_commune',
                           'nom_commune',
                           'code_departement',
                           'nombre_lots',
                           'type_local',
                           'surface_reelle_bati',
                           'nombre_pieces_principales',
                           'longitude',
                           'latitude']]
    selected_columns = selected_columns.dropna()

    selected_columns.adresse_numero = selected_columns.adresse_numero.astype('int32')
    selected_columns.code_postal = selected_columns.code_postal.astype('int32')
    selected_columns.nombre_pieces_principales = selected_columns.nombre_pieces_principales.astype('int32')
    selected_columns.adresse_code_voie = selected_columns.adresse_code_voie.astype('string')

    selected_columns.columns = ['id_mutation.string()',
                                'date_mutation.date(2006-01-02)',
                                'nature_mutation.string()',
                                'valeur_fonciere.double()',
                                'adresse_numero.int32()',
                                'adresse_nom_voie.string()',
                                'adresse_code_voie.string()',
                                'code_postal.int32()',
                                'code_commune.int32()',
                                'nom_commune.string()',
                                'code_departement.int32()',
                                'nombre_lots.int64()',
                                'type_local.string()',
                                'surface_reelle_bati.double()',
                                'nombre_pieces_principales.int32()',
                                'longitude.double()',
                                'latitude.double()']

    selected_columns.to_csv(args.outputfilename, index=False)
