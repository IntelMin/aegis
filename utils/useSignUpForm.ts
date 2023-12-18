// useForm.ts
import { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
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
    isChecked: boolean
};
export const useForm = (): [SignInData, Dispatch<SetStateAction<SignInData>>, (e: React.FormEvent<HTMLFormElement>) => Promise<void>] => {
    const router = useRouter();
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
        isChecked: false
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(signInData);
        await fetch("/api/signup", {
            method: "POST",
            body: JSON.stringify(signInData),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if (res.status === 200) {
                console.log("success");
                router.push("/signin");
            }
        }).catch((err) => { if (err) { console.log(err); } });
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
            isChecked: false
        });
    };

    return [signInData, setSignInData, handleSubmit];
};
