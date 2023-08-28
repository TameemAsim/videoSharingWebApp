import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import Axios, { isAxiosError } from 'axios';
import { useRecoilState } from "recoil";
import ViewUser from "../components/Major Components/viewUser";
import Header from "../components/layout/header";
import proxy from "../proxy";

export default function ViewUserPage() {
    const { userId } = useParams();
    const [channel, setChannel] = useState({
        _id: "",
        username: "",
        email: "",
        subscribers: 0,
        subscribedUsers: [],
        img: "",
        imgName: ""
    });
    const [channelVideos, setChannelVideos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const User = await Axios.get(`${proxy}/users/find/${userId}`);
                if (User) {
                    setChannel(User.data);
                    const UserVideos = await Axios.get(`${proxy}/videos/allVideos/${userId}`);
                    setChannelVideos(UserVideos.data);
                }
            } catch (err) {
                if (isAxiosError(err)) {
                    if (err.response) {
                        alert(err.response.data.message);
                    } else if (err.request) {
                        alert('Request Failed, Please Try Again...');
                    } else {
                        alert('Error: ' + err.message);
                    }
                } else {
                    alert('An unkown error occured...');
                }
            }
        }

        fetchData();
    }, [])

    return (
        <div className="w-screen">
            <Header />
            <ViewUser channel={channel} channelVideos={channelVideos} />
        </div>
    )
}