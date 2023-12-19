import React from "react";
import CustomInput from "../ui/custom-input";
import CustomSubmitbtn from "../ui/custom-submitbtn";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup"
import { SignInData } from "./sign-up";

interface Props {
  onSubmit: (data: any) => void
  defaultValues: SignInData
}

const schema = yup.object()
  .shape({
    name: yup.string().required(),
    twitter: yup.string().required(),
    teleId: yup.string().required(),
  })
  .required()

const SignUpIndividualForm: React.FC<Props> = ({ onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  })

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-[395px]">
        <CustomInput
          label="Name"
          placeholder="Example"
          type="text"
          errors={errors}
          {...register("name")}
        />
      </div>
      <div className="w-[395px]">
        <CustomInput
          label="Twitter"
          placeholder="@username"
          type="text"
          errors={errors}
          {...register("twitter")}
  
        />
      </div>
      <div className="w-[395px]">
        <CustomInput
          label="Telegram ID"
          placeholder="@username"
          type="text"
          errors={errors}
          {...register("teleId")}
  
        />
      </div>
      <CustomSubmitbtn title="Submit" />
    </form>
  );
}

export default SignUpIndividualForm;
