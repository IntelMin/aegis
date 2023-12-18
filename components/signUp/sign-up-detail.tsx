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
    name: string;
    projectEmail: string;
    about: string;
  }; // Adjust the type according to your data structure
  setSignInData: React.Dispatch<React.SetStateAction<{}>>;
};

const SignUpDetailForm = ({ signInData, setSignInData }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-[380px]">
        <CustomInput
          name="name"
          label="Name"
          placeholder="Example"
          type="text"
          value={signInData?.name}
          setValue={setSignInData}
        />
      </div>
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
          name="projectEmail"
          label="Project email"
          placeholder="Your email"
          type="text"
          value={signInData?.projectEmail}
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
          name="about"
          label="Tell us why do you like to be given early access "
          placeholder="I like because..."
          type="text"
          value={signInData?.about}
          setValue={setSignInData}
        />
      </div>
      <CustomSubmitbtn title="Submit" />
    </div>
  );
};

export default SignUpDetailForm;
