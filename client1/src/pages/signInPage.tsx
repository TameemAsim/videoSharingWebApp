import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios, { isAxiosError } from 'axios';
import { useRecoilState } from "recoil";
import { user, userVideos } from "../recoil/atoms";
import SignInComponent from "../components/Major Components/signInComponent";
import proxy from "../proxy";

export default function SignInPage() {
    const [userLoggedIn, setUserLoggedIn] = useRecoilState(user);
    const [userLoggedInVideos, setUserLoggedInVideos] = useRecoilState(userVideos);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get('access_token')) {
            navigate('/');
        }
    }, []);

    function usernameInputFunction(ev: React.ChangeEvent<HTMLInputElement>) {
        ev.preventDefault();
        setUsername(ev.target.value);
    }

    function passwordInputFunction(ev: React.ChangeEvent<HTMLInputElement>) {
        ev.preventDefault();
        setPassword(ev.target.value);
    }

    async function handleLogin(ev: React.MouseEvent) {
        ev.preventDefault();
        try {
            const response = await Axios.post(`${proxy}/auth/signin`, { username, password }, { withCredentials: true });
            if (response) {
                if (response.status === 201) {
                    setUserLoggedIn(response.data);
                    console.log(response.data);
                    const videoResponse = await Axios.get(`${proxy}/videos/allVideos/${response.data._id}`, {withCredentials: true});
                    if(videoResponse) {
                        setUserLoggedInVideos(videoResponse.data);
                        navigate('/');
                    }
                }else {
                    alert(response.data);
                }
            }
            
        } catch (err) {
            if(isAxiosError(err)) {
                if (err.response) {
                    // The request was made and the server responded with an error status code
                    if(err.response.data.message === 'No video Found...') {
                        setUserLoggedInVideos([]);
                        navigate('/');
                    }else {
                        alert(err.response.data.message);
                    }
                } else if (err.request) {
                    // The request was made but no response was received
                    alert('Request failed. Please try again later.');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    alert('An error occurred. Please try again later.');
                }
            }else {
                alert('An unknown error occured...');
            }
        }
    }

    return (
        <SignInComponent usernameInputFunction={usernameInputFunction} passwordInputFunction={passwordInputFunction} handleLogin={handleLogin} />
    )

}