import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

type Medications = {
  brandName: string;
  dosage: string;
  generic: string;
};

const MedicationsSchema = z.object({
  brandName: z.string(),
  dosage: z.string(),
  generic: z.string(),
});

const test2 = () => {
  const [medications, setMedications] = useState<Medications[]>([]);

  const {
    reset,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Medications>({
    defaultValues: {
      brandName: "",
      dosage: "",
      generic: "",
    },
    mode: "onBlur",
    resolver: zodResolver(MedicationsSchema),
  });

  console.log(watch());

  const medicationOnSubmitHandler: SubmitHandler<Medications> = (
    data: Medications
  ) => {
    reset();
    console.log("hello =");
    setMedications((prev) => [...prev, data]);
    console.log("medication data = ", data);
  };

  return (
    <form onSubmit={handleSubmit(medicationOnSubmitHandler)}>
      <Controller
        name="brandName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            name="brandName"
            label="Brand Name"
            variant="outlined"
          />
        )}
      />
      <Controller
        name="dosage"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            name="dosage"
            label="Dosage"
            variant="outlined"
          />
        )}
      />
      <Controller
        name="generic"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            name="generic"
            label="Generic"
            variant="outlined"
          />
        )}
      />

      {errors && errors.brandName?.message}
      {errors && errors.dosage?.message}
      {errors && errors.generic?.message}
      <button type="submit">Add</button>
    </form>
  );
};

export default test2;
