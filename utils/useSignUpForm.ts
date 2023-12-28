// useForm.ts
import { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
type SignInData = {
    email: string,
    password: string,
    password2: string,
    project_name: string,
    website: string,
    token_address: string,
    tele_account: string,
    project_x: string,
    project_insta: string,
    role: string,
    // individual
    name: string,
    twitter: string,
    tele_id: string,
    about: string,
    // vc
    vc_contact_name: string,
    vc_email: string,
    // team
    project_email: string,
    logo_url: File | null,
    is_checked: boolean
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
            setSignInData((prev) => ({...prev, logo_url: imageUrl}));
        } catch (error) {
            console.log(error, "Error while image upload");
        }
    };

    const [signInData, setSignInData] = useState<SignInData>({
        email: "",
        password: "",
        password2: "",
        project_name: "",
        website: "",
        token_address: "",
        tele_account: "",
        project_x: "",
        project_insta: "",
        role: "",
        // individual
        name: "",
        twitter: "",
        tele_id: "",
        about: "",
        // vc
        vc_contact_name: "",
        vc_email: "",
        // team
        project_email: "",
        logo_url: null,
        is_checked: false
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(signInData);
        if (signInData.logo_url !== null) {
            await uploadImage(signInData.logo_url);
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
            project_name: "",
            website: "",
            token_address: "",
            tele_account: "",
            project_x: "",
            project_insta: "",
            role: "",
            name: "",
            twitter: "",
            tele_id: "",
            about: "",
            vc_contact_name: "",
            vc_email: "",
            project_email: "",
            logo_url: null,
            is_checked: false
        });
    };

    return [signInData, setSignInData, handleSubmit];
};
