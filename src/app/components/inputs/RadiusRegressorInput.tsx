import { useState } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Label } from "semantic-ui-react";
import { motion } from "framer-motion";
import _ from "lodash";

/**
 *
 * @param {Object} props - The props for the component.
 * @param {Function} props.onParametersChanges - The function to be called when the radius state changes.
 */
const RadiusRegressorInput = ({
  onParametersChanges,
  onCancel,
}: {
  onParametersChanges: (model: {
    modelName: string;
    parameters: { radius: number | undefined };
    ready: boolean;
  }) => void;
  onCancel: () => void;
}) => {
  const [radius, setRadius] = useState<number | undefined>(undefined);

  const schema = z.object({
    radius: z
      .number({ invalid_type_error: "You must provide a valid number" })
      .min(0.1, "Must be greater than 0.1 km"),
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
      radius: undefined,
    },
  });

  const onSubmit: SubmitHandler<formFields> = async (data) => {
    console.log(data);
    onParametersChanges({
      modelName: "RadiusRegressor",
      parameters: { radius: data.radius },
      ready: !_.isUndefined(data.radius),
    });
  };

  // The component returns a div containing a description and an input field for the radius.
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.1 }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <label
          htmlFor="radius"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Radius
        </label>
        <Input type={"number"} labelPosition="right" fluid placeholder="Area">
          <input
            required={true}
            type={"float"}
            {...register("radius", { valueAsNumber: true })}
            id={"radius"}
            value={radius}
          />
          <Label>
            km<sup>2</sup>
          </Label>
        </Input>
        {errors.radius ? (
          <p className={"text-red-500"}>{errors.radius.message}</p>
        ) : (
          <p className={"text-red-500 invisible"}>error</p>
        )}
        <div className={"flex justify-center"}>
          <Button onClick={onCancel}>
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

export default RadiusRegressorInput;
