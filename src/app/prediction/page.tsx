"use client";

import AppBarComponent from "@/app/components/AppBarComponent.tsx";
import { useState } from "react";
import { Button, Dropdown, Input, Label } from "semantic-ui-react";
import _ from "lodash";
import { Mutation } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { CircularProgress } from "@mui/material";

import { motion } from "framer-motion";
import ModelSelector from "@/app/components/inputs/ModelSelector.tsx";

/**
 * The main component for the Prediction page.
 */
export default function Prediction() {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(0);
  const [isFetchingAdresses, setIsFetchingAdresses] = useState(false);
  const makePrediction = (
    model: {
      modelName: string;
      parameters: Object;
    },
    target: Omit<Mutation, "new_id_mutation">,
  ) => {
    setIsLoading(true);
    const options = {
      method: "POST",
      body: JSON.stringify({ target, model }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch("api/predictions", options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Problem with the request");
      })
      .then((result) => {
        setIsLoading(false);
        setPrediction(result.prediction);
      })
      .catch((error) => console.log("error", error));
  };

  /**
   * Fetches addresses based on the search string.
   * @param {string} search - The search string.
   */
  const fetchAddresses = (search: string) => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        search,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    /**
     * Fetches data from the "api/locations" endpoint.
     * Processes the response and sets the addressesSearchOptions state.
     */
    setIsFetchingAdresses(true);
    fetch("api/locations", options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Problem with the request");
      })
      .then((result) => {
        if (_.isEmpty(result)) {
          // This will remove previous search results
          setAddressesSearchOptions([]);
        } else {
          const addOptions = _.chain(
            result as {
              results: {
                numero: string;
                nom_voie: string;
                code_postal: string;
                nom_commune: string;
                geolocalisation_adresse: { lat: number; long: number };
              }[];
            },
          )
            .get("results")
            .map((add, index) => ({
              key: index,
              text: `${add.numero} ${add.nom_voie} ${add.code_postal} ${add.nom_commune}`,
              value: JSON.stringify(add),
            }))
            .value();
          setAddressesSearchOptions(addOptions);
          setIsFetchingAdresses(false);
        }
      })

      .catch((error) => console.log("error", error));
  };

  /**
   * Type definition for the AdresseOption object.
   */
  type AdresseOption = {
    key: number;
    text: string;
    value: string;
  };

  /**
   * State for storing the address search options.
   */
  const [addressesSearchOptions, setAddressesSearchOptions] = useState(
    [] as AdresseOption[],
  );

  /**
   * State for storing the selected address.
   */
  const [selectedAddress, setSelectedAddress] = useState(Object);

  /**
   *
   */
  const [steps, setSteps] = useState(0);

  /**
   * State for storing the mutation data.
   */
  const [mutation, setMutation] = useState({
    id_mutation: "",
    date_mutation: new Date("2012-12-12"),
    nature_mutation: "",
    valeur_fonciere: 0,
    adresse_numero: 0,
    adresse_nom_voie: "",
    adresse_code_voie: "",
    code_postal: 0,
    code_commune: 0,
    nom_commune: "",
    code_departement: 0,
    nombre_lots: 0,
    type_local: "",
    surface_reelle_bati: 0,
    nombre_pieces_principales: 0,
    longitude: 0,
    latitude: 0,
  } as Omit<Mutation, "new_id_mutation">);

  const [typeLocal, setTypeLocal] = useState(
    undefined as "Appartement" | "Maison" | undefined,
  );
  const [surface, setSurface] = useState<number>();

  const [model, setModel] = useState({
    modelName: "CityRegressor",
    parameters: {},
    ready: true,
  });

  return (
    <div className={"h-full"}>
      <AppBarComponent />
      <div
        className={
          "w-full h-full pt-20 mx-auto border-b-blue-700 flex justify-center bg-gradient-to-b from-white from-80% to-gray-200"
        }
      >
        <div className={"w-100 p-10"}>
          {steps === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.1 }}
              className={"h-64 flex flex-col justify-between"}
            >
              <h1>What is the address of the property to be valued?</h1>
              <form className={""}>
                {/* This semantic dropdown may be considred as HTMLInputElement, with a value props
                            in order for the dropdown to display the selected value, we must use primitive types like string, number etc...
                            we can't use object as value, so we must convert the object to a string using JSON.stringify() and then parse it back to object using JSON.parse()
                            */}
                <Dropdown
                  icon="search"
                  loading={isFetchingAdresses}
                  style={{ height: "40px" }}
                  placeholder="3 rue noel tessier..."
                  search
                  selection
                  className={"w-full"}
                  closeOnChange
                  value={selectedAddress}
                  options={addressesSearchOptions}
                  onChange={(_e, { value }) => {
                    console.info(value);
                    setSelectedAddress(value);
                  }}
                  onSearchChange={(e) => {
                    fetchAddresses((e.target as HTMLInputElement).value);
                  }}
                />
              </form>
              <div className={"flex justify-center pt-10"}>
                <Button
                  onClick={() => setSteps((prev) => prev + 1)}
                  disabled={
                    _.isEmpty(addressesSearchOptions) ||
                    _.isEmpty(selectedAddress)
                  }
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}
          {steps === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.1 }}
              className={"h-64 flex flex-col justify-between"}
            >
              <h1>What type of accommodation is it?</h1>
              <div className={"flex justify-center mx-2"}>
                <div
                  onClick={() => setTypeLocal("Maison")}
                  className={`flex flex-col items-center border rounded w-40 p-2 hover:bg-gray-100 ${typeLocal === "Maison" && "border border-black hover:bg-transparent"}`}
                >
                  <FontAwesomeIcon
                    icon={faHouse}
                    size={"4x"}
                    fixedWidth
                    color={"darkgray"}
                    className={`p-3 ${typeLocal === "Maison" && "text-black"}`}
                  />
                  <div className={"flex justify-center"}>
                    <p
                      className={`text-gray-500 ${typeLocal === "Maison" && "text-black"}`}
                    >
                      House
                    </p>
                  </div>
                </div>
                <div className={"flex justify-center mx-2"}>
                  <div
                    onClick={() => setTypeLocal("Appartement")}
                    className={`flex flex-col items-center border rounded w-40 p-2 hover:bg-gray-100 ${typeLocal === "Appartement" && "border border-black hover:bg-transparent"}`}
                  >
                    <FontAwesomeIcon
                      icon={faBuilding}
                      size={"4x"}
                      fixedWidth
                      color={"darkgray"}
                      className={`p-3 ${typeLocal === "Appartement" && "text-black"}`}
                    />
                    <div className={"flex justify-center"}>
                      <p
                        className={`text-gray-500 ${typeLocal === "Appartement" && "text-black"}`}
                      >
                        Appartement
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={"flex justify-center"}>
                <Button
                  onClick={() => setSteps((prev) => prev - 1)}
                  disabled={
                    _.isEmpty(addressesSearchOptions) ||
                    _.isEmpty(selectedAddress)
                  }
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setSteps((prev) => prev + 1)}
                  disabled={_.isUndefined(typeLocal)}
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}
          {steps === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.1 }}
              className={"h-64 flex flex-col justify-between"}
            >
              <h1>How much living space does your property have?</h1>
              <div className={"flex justify-center mx-2"}>
                <Input
                  labelPosition="right"
                  type="number"
                  placeholder="Surface"
                  className={"w-96"}
                  onChange={(e) =>
                    setSurface(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                    )
                  }
                >
                  <input value={surface} />
                  <Label>
                    m<sup>2</sup>
                  </Label>
                </Input>
              </div>

              <div className={"flex justify-center pt-10"}>
                <Button
                  onClick={() => setSteps((prev) => prev - 1)}
                  disabled={
                    _.isEmpty(addressesSearchOptions) ||
                    _.isEmpty(selectedAddress)
                  }
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setSteps((prev) => prev + 1)}
                  disabled={_.isUndefined(surface)}
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {steps === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.1 }}
              className={"h-64 flex flex-col justify-between"}
            >
              <h1 className={"mb-10"}>Choose your model</h1>
              <ModelSelector
                onCancel={() => setSteps((prev) => prev - 1)}
                onModelSubmit={(model) => {
                  setSteps((prev) => prev + 1);
                  // put all previous var in json
                  const newInfo = {
                    latitude:
                      JSON.parse(selectedAddress).geolocalisation_adresse.lat,
                    longitude:
                      JSON.parse(selectedAddress).geolocalisation_adresse.lon,
                    nom_commune: JSON.parse(selectedAddress).nom_commune,
                    code_commune: JSON.parse(selectedAddress).code_insee,
                    code_postal: JSON.parse(selectedAddress).code_postal,
                    adresse_numero: JSON.parse(selectedAddress).numero,
                    adresse_nom_voie: JSON.parse(selectedAddress).nom_voie,
                    type_local: typeLocal,
                  };
                  setModel(model);
                  setMutation(_.extend(mutation, newInfo));
                  makePrediction(model, mutation);
                }}
              ></ModelSelector>
            </motion.div>
          )}

          {steps === 4 && (
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={"h-60"}
            >
              <h1>Your estimation</h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <p
                  className={
                    "text-gray-500 whitespace-normal dark:text-gray-400"
                  }
                >
                  <span className={"text-black font-semibold"}>Adress</span>:{" "}
                  {`${mutation.adresse_numero} ${mutation.adresse_nom_voie}, ${mutation.code_commune} ${mutation.nom_commune}`}
                </p>
                <p
                  className={
                    "text-gray-500 whitespace-normal dark:text-gray-400"
                  }
                >
                  <span className={"text-black font-semibold"}>
                    Localization
                  </span>
                  : {mutation.latitude}, {mutation.longitude}
                </p>
                <p
                  className={
                    "text-gray-500 whitespace-normal dark:text-gray-400"
                  }
                >
                  <span className={"text-black font-semibold"}>
                    Type of local
                  </span>
                  : {typeLocal}
                </p>
                <p
                  className={
                    "text-gray-500 whitespace-normal dark:text-gray-400"
                  }
                >
                  <span className={"text-black font-semibold"}>Model</span>:{" "}
                  {model.modelName}
                </p>
              </motion.div>
              <div className={"flex justify-center pt-10"}>
                {isLoading ? (
                  <CircularProgress color={"inherit"} />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{ duration: 0.1 }}
                    className={""}
                  >
                    <p
                      className={
                        "text-4xl font-bold text-gray-900 dark:text-white"
                      }
                    >
                      {prediction.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <div>
                      <Button
                        onClick={() => {
                          setModel({
                            modelName: "CityRegressor",
                            parameters: {},
                            ready: true,
                          });
                          setSteps((prev) => prev - 1);
                        }}
                      >
                        Previous
                      </Button>
                      <Button onClick={() => setSteps(0)}>Restart</Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
