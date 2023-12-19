// useForm.ts
import { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
type SignInData = {
    email: string,
    password: string,
    password2: string,
    projectname: string,
    website: string,
    tokenAddress: string,
    teleAccount: string,
    projectX: string,
    projectInsta: string,
    role: string,
    // individual
    name: string,
    twitter: string,
    teleId: string,
    about: string,
    // vc
    vcContactName: string,
    vcEmail: string,
    // team
    projectEmail: string,
    logourl: File | null,
    isChecked: boolean
};
export const useForm = (): [SignInData, Dispatch<SetStateAction<SignInData>>, (e: React.FormEvent<HTMLFormElement>) => Promise<void>] => {

    const router = useRouter();


    const uploadImage = async (newImage: File | null) => {
        if (!newImage) {
            console.error("No image selected");
            return;
        }
        if (
            !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        ) {
            console.error("No API key provided");
            return;
        }

        const imageData = new FormData();
        imageData.append("file", newImage);
        imageData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        );
        imageData.append(
            "cloud_name",
            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        );
        imageData.append("folder", "Cloudinary-React");

        try {
            const uploadResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: imageData,
                }
            );
            const uploadedImageData = await uploadResponse.json();
            const imageUrl = uploadedImageData.secure_url;
            console.log("Imge", imageUrl);
            setSignInData((prev) => ({...prev, logourl: imageUrl}));
        } catch (error) {
            console.log(error, "Error while image upload");
        }
    };

    const [signInData, setSignInData] = useState<SignInData>({
        email: "",
        password: "",
        password2: "",
        projectname: "",
        website: "",
        tokenAddress: "",
        teleAccount: "",
        projectX: "",
        projectInsta: "",
        role: "",
        // individual
        name: "",
        twitter: "",
        teleId: "",
        about: "",
        // vc
        vcContactName: "",
        vcEmail: "",
        // team
        projectEmail: "",
        logourl: null,
        isChecked: false
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(signInData);
        if (signInData.logourl !== null) {
            await uploadImage(signInData.logourl);
        }
        await fetch("/api/signup", {
            method: "POST",
            body: JSON.stringify(signInData),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (res) => {
            if (res.status === 200) {
                console.log("success");
                toast.success('Sign Up Successfull!')
                router.push("/signin");
            }
        }).catch((err) => { if (err) { console.log(err); toast.error('Sign Up Failed!') } });
        setSignInData({
            email: "",
            password: "",
            password2: "",
            projectname: "",
            website: "",
            tokenAddress: "",
            teleAccount: "",
            projectX: "",
            projectInsta: "",
            role: "",
            name: "",
            twitter: "",
            teleId: "",
            about: "",
            vcContactName: "",
            vcEmail: "",
            projectEmail: "",
            logourl: null,
            isChecked: false
        });
    };

    return [signInData, setSignInData, handleSubmit];
};
