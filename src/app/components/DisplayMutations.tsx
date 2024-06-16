'use client'
import {Mutation} from "@prisma/client";
import Box from '@mui/material/Box';
import {DataGrid, GridColDef, GridToolbar} from '@mui/x-data-grid';

/**
 * DisplayMutations
 *
 * @param {Mutation[]} data - An array of Mutation objects to be displayed.
 */
export function DisplayMutations({data}: { data: Mutation[] }) {
    return <div className={'h-4/5'}>
        <div>
            <h2 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">
                Raw data</h2>

        </div>

        <DisplayMutationTable data={data}/>
    </div>

}
/**
 * DisplayMutationTable
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Mutation[]} props.data - An array of Mutation objects to be displayed in the table.
 */
function DisplayMutationTable({data}: { data: Mutation[] }) {
    console.info(data)
    const columns: GridColDef<(typeof data)[number]>[] = [
        {
            field: 'date_mutation',
            headerName: 'Date mutation',
            width: 90,
            valueGetter: (value: Date) => {
                return new Date(value).toLocaleDateString('fr-FR');

            },
        },
        {
            field: 'nature_mutation',
            headerName: 'Nature mutation',
            flex: 1,
            editable: false,
        },
        {
            field: 'valeur_fonciere',
            headerName: 'Valeur foncière',
            flex: 1,
            editable: false,
            valueGetter: (value: number) => {
                return value.toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'});

            },
        },
        {
            field: 'code_postal',
            headerName: 'Code postal',
            flex: 1,
            sortable: false,
        },
        {
            field: 'code_commune',
            headerName: 'Code commune',
            flex: 1,
            sortable: false,
        },
        {
            field: 'nom_commune',
            headerName: 'Nom commune',
            flex: 1,
            sortable: false,
        },
        {
            field: 'code_departement',
            headerName: 'Département',
            flex: 1,
            sortable: false,
        },
    ];


    return (
        <Box className={'h-full shadow'}>
            <DataGrid
                autoHeight={false}
                getRowId={(row) => row.id_mutation}
                rows={data}
                columns={columns}

                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                slots={{toolbar: GridToolbar}}

            />
        </Box>)

}