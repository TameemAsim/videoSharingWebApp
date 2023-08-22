import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../firebase";
import { userVideos } from "../recoil/atoms";
import Header from "../components/layout/header";

export default function DeleteVideoPage() {
    const [userLoggedInVideos, setUserLoggedInVideos] = useRecoilState(userVideos);
    const [video, setVideo] = useState();
    const { videoId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const executeAllFunctions = async () => {
            try {
                const videoResponse = await Axios.get(`/videos/find/${videoId}`);
                if (videoResponse.data) {
                    const fetchedVideo = videoResponse.data;
                    const thumbnailRef = ref(storage, `files/${fetchedVideo.thumbnailName}`);
                    const videoRef = ref(storage, `files/${fetchedVideo.videoName}`);

                    await deleteObject(thumbnailRef);
                    console.log('Thumbnail Deleted...');

                    await deleteObject(videoRef);
                    console.log('Video Deleted...');

                    const deleteDataFromDB = await Axios.delete(`/videos/${fetchedVideo._id}`);
                    if (deleteDataFromDB.data) {
                        setUserLoggedInVideos(deleteDataFromDB.data);
                        console.log('Data deleted from DB...');
                    }

                    navigate('/account');
                }
            } catch (err) {
                console.log(err);
            }
        }

        executeAllFunctions();

    }, [])

    return (
        <div className="w-screen h-screen">
            <Header />
            <h1 className="text-2xl text-black font-semibold">Deleting Video...</h1>
        </div>
    )
}