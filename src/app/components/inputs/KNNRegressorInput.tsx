import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "semantic-ui-react";
import { motion } from "framer-motion";

/**
 *
 * @param {Object} props - The props for the component.
 * @param {Function} props.onParametersChanges - The function to be called when the radius state changes.
 */
const KNNRegressorInput = ({
  onParametersChanges,
  onCancel,
}: {
  onParametersChanges: (model: {
    modelName: string;
    parameters: { numberOfNeighbors: number | undefined };
    ready: boolean;
  }) => void;
  onCancel: () => void;
}) => {
  const [numberOfNeighbors, setNumberOfNeighbors] = useState<
    number | undefined
  >(undefined);

  const schema = z.object({
    numberOfNeighbors: z
      .number({ invalid_type_error: "You must provide a valid number" })
      .positive()
      .int("must be an integer"),
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
      numberOfNeighbors: undefined,
    },
  });
  const onSubmit: SubmitHandler<formFields> = async (data) => {
    onParametersChanges({
      modelName: "KNNRegressor",
      parameters: { numberOfNeighbors: data.numberOfNeighbors },
      ready: !_.isUndefined(data.numberOfNeighbors),
    });
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.1 }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <label
          htmlFor="numberOfNeighbors"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Number of neighbors
        </label>
        <Input type="number" fluid placeholder="Number of neighbors">
          <input
            type={"number"}
            {...register("numberOfNeighbors", { valueAsNumber: true })}
            id={"numberOfNeighbors"}
            value={numberOfNeighbors}
          />
        </Input>
        {errors.numberOfNeighbors ? (
          <p className={"text-red-500"}>{errors.numberOfNeighbors.message}</p>
        ) : (
          <p className={"text-red-500 invisible"}>error</p>
        )}
        <div className={"flex justify-center"}>
          <Button color={"gray"} onClick={onCancel}>
            Cancel
          </Button>
          <Button color={"black"} type={"submit"}>
            Use this model
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default KNNRegressorInput;
