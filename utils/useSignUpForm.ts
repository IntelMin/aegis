// useForm.ts
import { useState, Dispatch, SetStateAction } from "react";

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
};

export const useForm = (): [SignInData, Dispatch<SetStateAction<SignInData>>, (e: React.FormEvent<HTMLFormElement>) => Promise<void>] => {
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
        });
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
        });
    };

    return [signInData, setSignInData, handleSubmit];
};
