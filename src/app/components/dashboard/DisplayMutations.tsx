"use client";
import { Mutation } from "@prisma/client";
import Box from "@mui/material/Box";
import {
  DataGrid,
  getGridDateOperators,
  getGridNumericOperators,
  getGridStringOperators,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";

/**
 * DisplayMutations
 *
 * @param {Mutation[]} data - An array of Mutation objects to be displayed.
 */
export function DisplayMutations({ data }: { data: Mutation[] }) {
  return (
    <div className={"h-4/5"}>
      <div>
        <h3 className="text-3xl font-bold dark:text-white pb-10 pt-3">Raw data</h3>
      </div>

      <DisplayMutationTable data={data} />
    </div>
  );
}

/**
 * DisplayMutationTable
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Mutation[]} props.data - An array of Mutation objects to be displayed in the table.
 * https://mui.com/x/react-data-grid/
 */
function DisplayMutationTable({ data }: { data: Mutation[] }) {
  console.info(data);
  let equivalenceOperators;
  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: "date_mutation",
      headerName: "Date mutation",
      width: 120,

      valueFormatter: (value: Date) => {
        return new Date(value).toLocaleDateString("fr-FR");
      },
      filterOperators: getGridDateOperators(),
    },
    {
      field: "type_local",
      headerName: "Type de local",
      width: 90,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === "contains",
      ),
    },
    {
      field: "nature_mutation",
      headerName: "Nature mutation",
      flex: 1,
      editable: false,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === "contains",
      ),
    },
    {
      field: "valeur_fonciere",
      headerName: "Valeur foncière",
      flex: 1,
      editable: false,
      valueFormatter: (value: number) => {
        return value.toLocaleString("fr-FR", {
          style: "currency",
          currency: "EUR",
        });
      },
      filterOperators: getGridNumericOperators().filter(
        (operator) =>
          operator.value === ">" ||
          operator.value === "<" ||
          operator.value === "=",
      ),
    },
    {
      field: "code_postal",
      headerName: "Code postal",
      flex: 1,
      sortable: false,
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value === "=",
      ),
    },
    {
      field: "code_commune",
      headerName: "Code commune",
      flex: 1,
      sortable: false,
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value === "=",
      ),
    },
    {
      field: "nom_commune",
      headerName: "Nom commune",
      flex: 1,
      sortable: false,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === "contains",
      ),
    },
    {
      field: "code_departement",
      headerName: "Département",
      flex: 1,
      sortable: false,
    },
  ];

  return (
    <Box className={"h-full shadow bg-white"}>
      <DataGrid
        autoHeight={false}
        getRowId={(row) => row.id_mutation}
        rows={data}
        columns={columns}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
      />
    </Box>
  );
}
