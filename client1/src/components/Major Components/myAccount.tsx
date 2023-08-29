import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { user, userVideos } from "../../recoil/atoms";
import Cookies from "js-cookie";
import Header from "../layout/header";
import MyAccountTabs from "../layout/myAccountTabs";
import Axios, { isAxiosError } from 'axios';
import proxy from "../../proxy";

export default function MyAccount() {
    const [userLoggedIn, setUserLoggedIn] = useRecoilState(user);
    const [userLoggedInVideos, setUserLoggedInVideos] = useRecoilState(userVideos);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUserVideos = async () => {
            try {
                const videoResponse = await Axios.get(`${proxy}/videos/allVideos/${userLoggedIn._id}`, {withCredentials: true});
                    if(videoResponse) {
                        setUserLoggedInVideos(videoResponse.data);
                    }
            } catch (err) {
                if(isAxiosError(err)) {
                    if (err.response) {
                        alert(err.response.data.message);
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

        if (!Cookies.get('access_token')) {
            navigate('/signIn');
        }else {
            console.log(userLoggedIn);
            
        }
    }, [])

    return (
        <div>
            <Header />
            <div className="flex justify-end" >
                <button className="w-[100px] sm:static sm:mt-1 sm:mr-1 md:absolute md:top-1 md:right-1 border-2 border-red-500 bg-white rounded-lg text-lg font-semibold p-1 text-red-500 hover:bg-red-500 hover:text-white" onClick={ev => {
                    ev.preventDefault();
                    setUserLoggedIn({
                        _id: "",
                        username: "",
                        email: "",
                        subscribers: 0,
                        subscribedUsers: [],
                        img: "",
                        imgName: ""
                    });
                    Cookies.remove('access_token');
                    navigate('/');
                }}>
                    Logout
                </button>
            </div>
            <div className="flex justify-center align-middle w-screen sm:h-36 md:h-40 my-4">
                <img className="sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full" src={userLoggedIn.img} alt="" />
            </div>
            <div className="flex justify-center align-middle w-screen sm:mb-3 md:mb-4 bg-">
                <h1 className="sm:text-3xl md:text-5xl p-2 rounded-sm bg-gradient-to-r from-blue-300 to-red-500 font-semibold">Hi {userLoggedIn.username}</h1>
            </div>
            <MyAccountTabs />
        </div>
    )
}