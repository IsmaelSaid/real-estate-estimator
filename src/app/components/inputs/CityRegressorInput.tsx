import { Button } from "semantic-ui-react";

const CityRegressorInput = ({
  onParametersChanges,
  onCancel,
}: {
  onParametersChanges: (model: {
    modelName: string;
    parameters: object;
    ready: boolean;
  }) => void;
  onCancel: () => void;
}) => (
  <div>
    <div style={{ height: "17.5px", marginBottom: "7px" }}></div>
    <div style={{ height: "38px", padding: "9.5px 14px" }}></div>
    <p className={"text-red-500 invisible"}>error</p>

    <div className={"flex justify-center"}>
      <Button onClick={onCancel}>Cancel</Button>
      <Button
        color={"black"}
        onClick={() =>
          onParametersChanges({
            modelName: "CityRegressor",
            parameters: {},
            ready: true,
          })
        }
      >
        Use this model
      </Button>
    </div>
  </div>
);

export default CityRegressorInput;
