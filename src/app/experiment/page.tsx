"use client";

/* eslint-disable */
import AppBarComponent from "@/app/components/AppBarComponent.tsx";
import { useState } from "react";
import { Button, FormField, Input, Portal, Radio } from "semantic-ui-react";
import _ from "lodash";
import DisplayModels from "@/app/components/inputs/DisplayModels.tsx";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ModelSelector from "../components/inputs/ModelSelector.tsx";

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

  const schema = z.object({
    numbersOfPredictions: z
      .number({ invalid_type_error: "You must provide a valid number" })
      .int()
      .positive()
      .min(2)
      .max(10),
  });

  type formFields = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<formFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      numbersOfPredictions: undefined,
    },
  });

  const onSubmit: SubmitHandler<formFields> = async (data) => {
    console.log(data);
    console.log(models);
  };

  return (
    <div className={"h-full"}>
      <AppBarComponent />
      <div className={"w-full h-full pt-16 mx-auto flex justify-center"}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={"w-full ml-96 mr-96 p-10 shadow bg-white"}
        >
          <div className={""}>
            <h1>Set up your experiment</h1>
            <h5>Select the type of local</h5>
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

            <h5>Number of predictions</h5>
            <div className={"flex flex-col"}>
              <label
                htmlFor="radius"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Number of predictions
              </label>
              <Input>
                <input
                  required={true}
                  id={"numbersOfPredictions"}
                  {...register("numbersOfPredictions", {
                    valueAsNumber: true,
                  })}
                  type="number"
                  value={numberOfPredictions}
                />
              </Input>
              {errors.numbersOfPredictions ? (
                <p className={"text-red-500"}>
                  {errors.numbersOfPredictions.message}
                </p>
              ) : (
                <p className={"text-red-500 invisible"}>error</p>
              )}
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
          {/*margin top of 52px*/}

          <div style={{ marginTop: "55px" }} className={"flex justify-center "}>
            <Button
              type={"submit"}
              style={{ marginTop: "10px" }}
              color={"black"}
              disabled={_.isEmpty(models)}
            >
              Run experiment
            </Button>
          </div>
        </form>
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
  );
}
