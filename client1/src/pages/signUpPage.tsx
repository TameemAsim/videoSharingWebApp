import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUpComponent from "../components/Major Components/signUpComponent";
import Axios, { isAxiosError } from 'axios';

export default function SignUpPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get('access_token')) {
            navigate('/');
        }
    })

    function usernameInputFunction(ev: React.ChangeEvent<HTMLInputElement>) {
        ev.preventDefault();
        setUsername(ev.target.value);
    }

    function emailInputFunction(ev: React.ChangeEvent<HTMLInputElement>) {
        ev.preventDefault();
        setEmail(ev.target.value);
    }

    function passwordInputFunction(ev: React.ChangeEvent<HTMLInputElement>) {
        ev.preventDefault();
        setPassword(ev.target.value);
    }

    async function handleSignUp(ev: React.MouseEvent) {
        ev.preventDefault();
        try {
            const response = await Axios.post('/auth/signup', { username, email, password }, { withCredentials: true });
            if (response) {
                if ((response.status === 200) && (response.data === 'User Created Successfully...')) {
                    alert('Account Created Successfully... Please Login');
                    navigate('/signIn');
                } else {
                    alert(response.data);
                }
            }
        } catch (error) {
            if(isAxiosError(error)) {
                console.log(error);
            }else {
                alert('An unknown error occured...');
            }
        }

    }

    return (
        <SignUpComponent usernameInputFunction={usernameInputFunction} emailInputFunction={emailInputFunction} passwordInputFunction={passwordInputFunction} handleSignUp={handleSignUp} />
    )

}