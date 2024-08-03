"use client";

/* eslint-disable */
import AppBarComponent from "@/app/components/AppBarComponent.tsx";
import { useState } from "react";
import { Button, FormField, Input, Portal, Radio } from "semantic-ui-react";
import _, { result, set } from "lodash";
import DisplayModels from "@/app/components/inputs/DisplayModels.tsx";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ModelSelector from "../components/inputs/ModelSelector.tsx";
import { Bar } from "react-chartjs-2";

import { Colors } from 'chart.js';



import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  LineElement,
  Legend,
  PointElement,
  LineController,
  ArcElement,
} from "chart.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineController,
  LineElement,
  BarElement,
  ArcElement,
  Colors
);

type ExperimentalResults = {
  results: { modelName: string, predictions: [], trueValues: [] }[]
}
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
      .max(500),
  });

  type formFields = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<formFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      numbersOfPredictions: undefined,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isResultPortalOpen, setIsResultPortalOpen] = useState(false);

  const [experimentalResults, setExperimentalResults] = useState({} as ExperimentalResults);


  const onSubmit: SubmitHandler<formFields> = async (data) => {
    setNumberOfPredictions(data.numbersOfPredictions);
    type ExperimentalSettings = { models: object; settings: { numberOfPredictions: number; typeoflocal: string } }
    const experimentSettings: ExperimentalSettings = _.chain({ models: models }).extend({ settings: { numberOfPredictions: data.numbersOfPredictions, typeoflocal: typeOfLocal } }).value();

    setIsSubmitting(true);
    fetch("/api/experiment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(experimentSettings),
    }).then((async response => {
      if (response.ok) {
        setIsSubmitting(false);
        const results = await response.json() as ExperimentalResults
        setIsResultPortalOpen(true)
        setExperimentalResults(results)
      }
      else {
        throw new Error("Error")
      }
    })).then((data) => { console.info(data) }).catch((error) => { console.error(error) });
  };

  return (
    <div className={"h-full"}>
      <AppBarComponent />
      <div className={"w-full h-full pt-20 mx-auto flex justify-center"}>
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
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenPortal()
                  }}
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
              loading={isSubmitting}
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
      <Portal open={isResultPortalOpen}>
        <div
          className={
            "h-full w-full top-0 left-0 fixed flex justify-center items-center border bg-white"
          }
        >
          <div style={{ display: "flex", height: '100%', width: '1000px', flexDirection: 'column', justifyContent: 'center' }}>
            <DisplayExperimentResults results={experimentalResults} typeoflocal={typeOfLocal} numberofpredictions={numberOfPredictions} />
            <div style={{ textAlign: 'center' }}>
              <Button onClick={() => setIsResultPortalOpen(false)}>Close</Button>

            </div>

          </div>
        </div>
      </Portal>
    </div>
  );
}


const DisplayExperimentResults = ({ results, typeoflocal, numberofpredictions }: { results: ExperimentalResults, typeoflocal: string, numberofpredictions: number | undefined }) => {
  const barplotData = {
    labels: ["Models"],
    datasets: _.chain(results.results).map((result) => {
      return {
        label: result.modelName.replace(':', ' '),
        data: [_.chain(result.predictions).map((res, index) => Math.abs(res - result.trueValues[index])).mean().value()],
      }
    }
    ).value()
  };
  const barplotOptions = {
    plugins: {
      title: {
        display: true,
        text: `Mean absolute error score for ${numberofpredictions} predictions`,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
      },
    },
  };
  return (
    <Bar options={barplotOptions} data={barplotData} />

  );
}