import React from "react";
import CustomInput from "../ui/custom-input";
import CustomSubmitbtn from "../ui/custom-submitbtn";
import CustomTextarea from "../ui/custom-textarea";

type Props = {
  signInData: {
    name: string;
    twitter: string;
    teleId: string;
    about: string;
  }; // Adjust the type according to your data structure
  setSignInData: React.Dispatch<React.SetStateAction<{}>>;
};

const SignUpIndividualForm = ({ signInData, setSignInData }: Props) => {
  return (
    <div className="flex flex-col gap-2 w-full px-[10px]">
      <div className="">
        <CustomInput
          name="name"
          label="Name"
          placeholder="Example"
          type="text"
          value={signInData?.name}
          setValue={setSignInData}
        />
      </div>
      <div className="">
        <CustomInput
          name="twitter"
          label="Twitter"
          placeholder="@username"
          type="text"
          value={signInData?.twitter}
          setValue={setSignInData}
        />
      </div>
      <div className="">
        <CustomInput
          name="teleId"
          label="Telegram ID"
          placeholder="@username"
          type="text"
          value={signInData?.teleId}
          setValue={setSignInData}
        />
      </div>
      <CustomSubmitbtn title="Submit" />
    </div>
  );
};

export default SignUpIndividualForm;
