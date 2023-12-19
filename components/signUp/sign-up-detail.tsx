import React from "react";
import CustomInput from "../ui/custom-input";
import CustomSubmitbtn from "../ui/custom-submitbtn";
import CustomTextarea from "../ui/custom-textarea";
import Image from "next/image";

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
    teleId: string;
  }; // Adjust the type according to your data structure
  setSignInData: React.Dispatch<React.SetStateAction<{}>>;
};

const SignUpDetailForm = ({ signInData, setSignInData }: Props) => {
  const [newImage, setNewImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        setPreview(reader.result as string);
      };
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="w-[395px] grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <CustomInput
            name="name"
            label="Name"
            placeholder="Example"
            type="text"
            value={signInData?.name}
            setValue={setSignInData}
          />
        </div>
        <div className="col-span-1">
          <CustomInput
            name="projectname"
            label="Project name"
            placeholder="Example"
            type="text"
            value={signInData?.projectname}
            setValue={setSignInData}
          />
        </div>
      </div>
      <div className="w-[395px] grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <CustomInput
            name="projectEmail"
            label="Project email"
            placeholder="Your email"
            type="text"
            value={signInData?.projectEmail}
            setValue={setSignInData}
          />
        </div>
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
      </div>
      <div className="w-[395px] grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <CustomInput
            name="teleId"
            label="Telegram of contact person"
            placeholder="@Example"
            type="text"
            value={signInData?.teleId}
            setValue={setSignInData}
          />
        </div>
        <div className="col-span-1">
          <CustomInput
            name="tokenAddress"
            label="Token address"
            placeholder="0x..."
            type="text"
            value={signInData?.tokenAddress}
            setValue={setSignInData}
          />
        </div>
      </div>
      <div className="w-[395px]">
        <div className="flex flex-col gap-2 w-full">
          <label
            htmlFor="imageLogo"
            className="text-[#FAFAFA] text-[14px] font-[400] leading-[20px]"
          >
            Project logo
          </label>
          <input
            type="file"
            id="imageLogo"
            className="hidden"
            onChange={handleImageChange}
            accept="image/*"
          />
          <div className="flex gap-2 items-center">
            {preview && (
              <Image
                width={300}
                height={300}
                src={preview}
                alt="preview"
                className="w-[100%]"
                style={{ objectFit: "cover", height: "88px", width: "30%" }}
              />
            )}
            <div
              className="flex flex-col p-[12px] items-center justify-center w-full bg-zinc-900 border border-zinc-800 cursor-pointer"
              onClick={() => document.getElementById("imageLogo")!.click()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
              >
                <path
                  d="M17.5 13V16.3333C17.5 16.7754 17.3244 17.1993 17.0118 17.5118C16.6993 17.8244 16.2754 18 15.8333 18H4.16667C3.72464 18 3.30072 17.8244 2.98816 17.5118C2.67559 17.1993 2.5 16.7754 2.5 16.3333V13"
                  stroke="#FAFAFA"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.1666 7.16667L9.99992 3L5.83325 7.16667"
                  stroke="#FAFAFA"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 3V13"
                  stroke="#FAFAFA"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h1 className="text-[#FAFAFA] text-[14px] font-[400] leading-[20px]">
                Upload the project logo
              </h1>
              <p className="text-[#71717A]">.png .jpg .jpeg | max:12mb </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[395px]">
        <CustomTextarea
          name="about"
          label="Tell us why do you like to be given early access "
          placeholder="I like because..."
          value={signInData?.about}
          setValue={setSignInData}
        />
      </div>
      <CustomSubmitbtn title="Submit" />
    </div>
  );
};

export default SignUpDetailForm;
