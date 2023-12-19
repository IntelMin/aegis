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
    <div className="flex flex-col gap-2">
      <div className="w-[375px] max-[450px]:w-[270px] max-[450px]:mx-auto">
        <CustomInput
          name="name"
          label="Name"
          placeholder="Example"
          type="text"
          value={signInData?.name}
          setValue={setSignInData}
        />
      </div>
      <div className="w-[375px] max-[450px]:w-[270px] max-[450px]:mx-auto">
        <CustomInput
          name="twitter"
          label="Twitter"
          placeholder="@username"
          type="text"
          value={signInData?.twitter}
          setValue={setSignInData}
        />
      </div>
      <div className="w-[375px] max-[450px]:w-[270px] max-[450px]:mx-auto">
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
