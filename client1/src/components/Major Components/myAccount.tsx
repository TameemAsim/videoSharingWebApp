import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { user } from "../../recoil/atoms";
import Cookies from "js-cookie";
import Header from "../layout/header";
import MyAccountTabs from "../layout/myAccountTabs";

export default function MyAccount() {
    const [userLoggedIn, setUserLoggedIn] = useRecoilState(user);
    const navigate = useNavigate();


    useEffect(() => {
        if (!Cookies.get('access_token')) {
            navigate('/signIn');
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