import { modelToString } from "../../utils/utils.ts";
import { Button } from "semantic-ui-react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import _ from "lodash";

const DisplayModels = ({
  models,
  removeModel,
}: {
  models: { modelID: string; modelName: string; parameters: object }[];
  removeModel: (modelID: string) => void;
}) => {
  const modelsWithFormattedParameters: {
    modelID: string;
    modelName: string;
    parameters: object;
    formatedParameters: string;
  }[] = _.chain(models)
    .map((model) =>
      _.extend(model, { formatedParameters: modelToString(model) }),
    )
    .value();
  const columns: GridColDef<(typeof modelsWithFormattedParameters)[number]>[] =
    [
      {
        field: "modelName",
        headerName: "Model name",
        flex: 1,
      },
      {
        field: "formatedParameters",
        headerName: "parameters",
        flex: 1,
      },
      {
        field: "modelID",
        headerName: "action",
        renderCell: (params) => (
          <Button
            size={"tiny"}
            color={"black"}
            onClick={() => {
              console.log(params.row.modelID);
              removeModel(params.row.modelID);
            }}
          >
            Delete
          </Button>
        ),
      },
    ];

  return (
    <Box className={"h-full shadow bg-white"}>
      <DataGrid
        getRowId={(row) => row.modelID}
        rows={modelsWithFormattedParameters}
        columns={columns}
        pageSizeOptions={[1]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default DisplayModels;
