import React from "react";
import CustomInput from "../ui/custom-input";
import CustomSubmitbtn from "../ui/custom-submitbtn";
import CustomTextarea from "../ui/custom-textarea";
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
    vcContactName: yup.string().required(),
    vcEmail: yup.string().email().required(),
    website: yup.string().required(),
    twitter: yup.string().required(),
    about: yup.string().required(),
  })
  .required()

const SignUpVcForm: React.FC<Props> = ({ onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  })

  return (
    <form className="flex flex-col gap-2 w-full px-[10px]" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <CustomInput
          label="Contact Name"
          placeholder="Example"
          type="text"
          errors={errors}
          {...register("vcContactName")}
        />
      </div>
      <div>
        <CustomInput
          label="Email of contact person"
          placeholder="Your email"
          type="text"
          errors={errors}
          {...register("vcEmail")}
        />
      </div>
      <div className=" grid grid-cols-2 gap-4 max-[450px]:grid-cols-1">
        <div className="col-span-1 ">
          <CustomInput
            label="Website"
            placeholder="Example"
            type="text"
            errors={errors}
            {...register("website")}

          />
        </div>
        <div className="col-span-1">
          <CustomInput
            label="Twitter"
            placeholder="Example"
            type="text"
            errors={errors}
            {...register("twitter")}
          />
        </div>
      </div>
      <div>
        <CustomTextarea
          label="Tell us why do you like to be given early access "
          placeholder="I like because..."
          errors={errors}
          {...register("about")}
        />
      </div>
      <CustomSubmitbtn title="Submit" />
    </form>
  )
}

export default SignUpVcForm;
