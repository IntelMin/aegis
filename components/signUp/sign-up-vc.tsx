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
    twitter: string;
    teleId: string;
    about: string;
    vcContactName: string;
    vcEmail: string;
  }; // Adjust the type according to your data structure
  setSignInData: React.Dispatch<React.SetStateAction<{}>>;
};

const SignUpVcForm = ({ signInData, setSignInData }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-[380px]">
        <CustomInput
          name="vcContactName"
          label="Contact Name"
          placeholder="Example"
          type="text"
          value={signInData?.vcContactName}
          setValue={setSignInData}
        />
      </div>
      <div className="w-[380px]">
        <CustomInput
          name="vcEmail"
          label="Email of contact person"
          placeholder="Your email"
          type="text"
          value={signInData?.vcEmail}
          setValue={setSignInData}
        />
      </div>
      <div className="w-[380px] grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <CustomInput
            name="website"
            label="Website"
            placeholder="Example"
            type="text"
            value={signInData?.website}
            setValue={setSignInData}
          />
        </div>
        <div className="col-span-1">
          <CustomInput
            name="twitter"
            label="Twitter"
            placeholder="Example"
            type="text"
            value={signInData?.twitter}
            setValue={setSignInData}
          />
        </div>
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

export default SignUpVcForm;
