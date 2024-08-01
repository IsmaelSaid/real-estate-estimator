import { useState } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import { motion } from "framer-motion";
import { Button, Input } from "semantic-ui-react";

const KMeansRegressorInput = ({
  onParametersChanges,
  onCancel,
}: {
  onParametersChanges: (model: {
    modelName: string;
    parameters: { numberOfClusters: number | undefined };
    ready: boolean;
  }) => void;
  onCancel: () => void;
}) => {
  const [k, setK] = useState<number | undefined>(undefined);

  const schema = z.object({
    k: z
      .number({ invalid_type_error: "You must provide a valid number" })
      .int()
      .positive()
      .min(5)
      .max(24),
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
      k: undefined,
    },
  });

  const onSubmit: SubmitHandler<formFields> = async (data) => {
    console.log(data);
    onParametersChanges({
      modelName: "KMeansRegressor",
      parameters: { numberOfClusters: data.k },
      ready: !_.isUndefined(data.k),
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
          htmlFor="radius"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Number of clusters
        </label>
        <Input fluid type="number" placeholder="Number of clusters">
          <input {...register("k", { valueAsNumber: true })} value={k} />
        </Input>
        {errors.k ? (
          <p className={"text-red-500"}>{errors.k.message}</p>
        ) : (
          <p className={"text-red-500 invisible"}>error</p>
        )}
        <div className={"flex justify-center"}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button color={"black"} type={"submit"}>
            Use this model
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default KMeansRegressorInput;
