"use client";

import AppBarComponent from "@/app/components/AppBarComponent.tsx";
import { useState } from "react";
import { Button, Form, FormField, Portal, Radio } from "semantic-ui-react";
import _ from "lodash";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import ModelSelector from "../components/inputs/ModelSelector";

export default function Experiment() {
  const [portalOpen, setPortalOpen] = useState(false);

  const [numberOfPredictions, setNumberOfPredictions] = useState<
    number | undefined
  >(undefined);
  const [typeOfLocal, setTypeOfLocal] = useState("House");

  const handleOpenPortal = () => {
    setPortalOpen(true);
  };

  const handleClosePortal = () => {
    setPortalOpen(false);
  };

  const [models, setModels] = useState<
    { modelID: string; modelName: string; parameters: object }[]
  >([]);

  const removeModel = (modelID: string) => {
    setModels(
      _.chain(models)
        .clone()
        .filter((model) => model.modelID !== modelID)
        .value(),
    );
  };

  return (
    <div className={"h-full"}>
      <AppBarComponent />
      <div className={"w-full h-full pt-16 mx-auto flex justify-center"}>
        <div className={"w-full ml-96 mr-96 p-10 shadow bg-white"}>
          <div className={""}>
            <h1>Set up your experiment</h1>
            <h5>Select the type of local</h5>
            <Form>
              <FormField>
                <Radio
                  label="House"
                  name="radioGroup"
                  value="House"
                  checked={typeOfLocal === "House"}
                  onClick={() => setTypeOfLocal("House")}
                />
              </FormField>
              <FormField>
                <Radio
                  label="Apartment"
                  type={"radio"}
                  value={"Apartment"}
                  checked={typeOfLocal === "Apartment"}
                  onClick={(_event) => setTypeOfLocal("Apartment")}
                />
              </FormField>
            </Form>

            <h5>Number of predictions</h5>
            <div className={"flex"}>
              <Form>
                <FormField>
                  <input
                    type="number"
                    value={numberOfPredictions || ""}
                    onChange={(e) =>
                      setNumberOfPredictions(Number(e.target.value))
                    }
                  />
                </FormField>
              </Form>
            </div>

            <h5>Model selection</h5>
            <div className={"h-96"}>
              <div className={"mb-5"}>
                <Button
                  color={"black"}
                  size={"tiny"}
                  onClick={() => handleOpenPortal()}
                >
                  Add a model
                </Button>
              </div>
              <DisplayModels models={models} removeModel={removeModel} />
            </div>
          </div>
        </div>
        <Portal open={portalOpen}>
          <div
            className={
              "h-full w-full top-0 left-0 fixed flex justify-center items-center border bg-black/50 backdrop-blur-lg"
            }
          >
            <div
              className={"h-96 flex items-center shadow bg-white rounded p-10"}
            >
              <ModelSelector
                onCancel={handleClosePortal}
                onModelSubmit={(model: {
                  modelName: string;
                  parameters: object;
                }) => {
                  handleClosePortal();
                  setModels(
                    _.chain(models)
                      .clone()
                      .push({
                        modelID: `${model.modelName}${Date.now()}`,
                        ...model,
                      })
                      .value(),
                  );
                }}
              />
            </div>
          </div>
        </Portal>
      </div>
    </div>
  );
}

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
        renderCell: (params) => {
          return (
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
          );
        },
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

const modelToString = (model: {
  modelName: string;
  parameters: object;
}): string => {
  switch (model.modelName) {
    case "KMeansRegressor":
      return `${_.get(model, "parameters.numberOfClusters")} cluster(s)`;
    case "RadiusRegressor":
      return `${_.get(model, "parameters.radius")} km`;
    case "KNNRegressor":
      return `${_.get(model, "parameters.numberOfNeighbors")} neighbor(s)`;
    default:
      return "";
  }
};
