import React from "react";
import CustomInput from "../ui/custom-input";
import CustomSubmitbtn from "../ui/custom-submitbtn";

type Props = {
  signInData: {
    email: string;
    projectname: string;
    website: string;
    tokenAddress: string;
    teleAccount: string;
    projectX: string;
    projectInsta: string;
  }; // Adjust the type according to your data structure
  setSignInData: React.Dispatch<React.SetStateAction<{}>>;
};

const SignUpDetailForm = ({ signInData, setSignInData }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-[380px]">
        <CustomInput
          name="projectname"
          label="Project name"
          placeholder="Example"
          type="text"
          value={signInData?.projectname}
          setValue={setSignInData}
        />
      </div>
      <div className="w-[380px]">
        <CustomInput
          name="website"
          label="Project website"
          placeholder="Https://example.example"
          type="text"
          value={signInData?.website}
          setValue={setSignInData}
        />
      </div>
      <div className="w-[380px]">
        <CustomInput
          name="tokenAddress"
          label="Token address"
          placeholder="0x..."
          type="text"
          value={signInData?.tokenAddress}
          setValue={setSignInData}
        />
      </div>
      <div className="w-[380px]">
        <CustomInput
          name="teleAccount"
          label="Telegram account"
          placeholder="@example"
          type="text"
          value={signInData?.teleAccount}
          setValue={setSignInData}
        />
      </div>
      <div className="w-[380px] grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <CustomInput
            name="projectX"
            label="Project’s X"
            placeholder="@example"
            type="text"
            value={signInData?.projectX}
            setValue={setSignInData}
          />
        </div>
        <div className="col-span-1">
          <CustomInput
            name="projectInsta"
            label="Project’s Instagram"
            placeholder="@example"
            type="text"
            value={signInData?.projectInsta}
            setValue={setSignInData}
          />
        </div>
      </div>
      <CustomSubmitbtn title="Submit" isSignIn />
    </div>
  );
};

export default SignUpDetailForm;
