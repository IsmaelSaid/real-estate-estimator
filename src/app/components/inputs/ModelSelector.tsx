import { useState } from "react";
import { Form, FormField, Radio } from "semantic-ui-react";
import _ from "lodash";
import CityRegressorInput from "./CityRegressorInput.tsx";
import RadiusRegressorInput from "./RadiusRegressorInput.tsx";
import KMeansRegressorInput from "./KMeansRegressorInput.tsx";
import KNNRegressorInput from "./KNNRegressorInput.tsx";

const ModelSelector = ({
  onModelSubmit,
  onCancel = () => {},
}: {
  onModelSubmit: (model: {
    modelName: string;
    parameters: object;
    ready: boolean;
  }) => void;
  onCancel: () => void;
}) => {
  const handleModelSubmit = (model: {
    modelName: string;
    parameters: object;
    ready: boolean;
  }) => {
    onModelSubmit(model);
  };
  const modelTemplate = {
    CityRegressor: (
      <CityRegressorInput
        onParametersChanges={(model) => handleModelSubmit(model)}
        onCancel={onCancel}
      />
    ),
    RadiusRegressor: (
      <RadiusRegressorInput
        onParametersChanges={(model) => handleModelSubmit(model)}
        onCancel={onCancel}
      />
    ),
    KNNRegressor: (
      <KNNRegressorInput
        onParametersChanges={(model) => handleModelSubmit(model)}
        onCancel={onCancel}
      />
    ),
    KMeansRegressor: (
      <KMeansRegressorInput
        onParametersChanges={(model) => handleModelSubmit(model)}
        onCancel={onCancel}
      />
    ),
  };
  const [model, setModel] = useState({
    modelName: "CityRegressor",
    parameters: {},
    ready: true,
  });

  return (
    <div className={"justify-center mx-2 border-amber-950"}>
      <Form className={"flex flex-row"}>
        <FormField>
          <Radio
            className={"pr-3"}
            label="City Regressor"
            name="radioGroup"
            value="CityRegressor"
            checked={model.modelName === "CityRegressor"}
            onClick={(event, data) => {
              setModel({
                modelName: "CityRegressor",
                parameters: {},
                ready: true,
              });
            }}
          />
        </FormField>
        <FormField>
          <Radio
            className={"px-3"}
            label="Radius Regressor"
            name="radioGroup"
            value="RadiusRegressor"
            checked={model.modelName === "RadiusRegressor"}
            onClick={(event, data) => {
              setModel({
                modelName: "RadiusRegressor",
                parameters: {},
                ready: false,
              });
            }}
          />
        </FormField>
        <FormField>
          <Radio
            className={"px-3"}
            label="KNN Regressor"
            name="radioGroup"
            value="KNNRegressor"
            checked={model.modelName === "KNNRegressor"}
            onClick={(event, data) => {
              setModel({
                modelName: "KNNRegressor",
                parameters: {},
                ready: false,
              });
            }}
          />
        </FormField>
        <FormField>
          <Radio
            className={"px-3"}
            label="KMeans Regressor"
            name="radioGroup"
            value="KMeansRegressor"
            checked={model.modelName === "KMeansRegressor"}
            onClick={(event, data) => {
              setModel({
                modelName: "KMeansRegressor",
                parameters: {},
                ready: false,
              });
            }}
          />
        </FormField>
      </Form>
      <div className={"pb-10"}>
        {_.chain(modelTemplate).get(model.modelName).value()}
      </div>
    </div>
  );
};

export default ModelSelector;
