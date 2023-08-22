import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Axios, { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, } from "firebase/storage";
import { useRecoilState } from 'recoil';
import { user, userVideos } from '../recoil/atoms';
import UploadVideo from "../components/Major Components/uploadVideo";

export interface VideoForUploadVideo {
    title: string;
    description: string;
    tags: string[];
    thumbnailURL: string;
    thumbnailName: string;
    videoURL: string;
    videoName: string;
}

export default function UploadVideoPage() {
    const [userLoggedIn, setUserLoggedIn] = useRecoilState(user);
    const [userLoggedInVideos, setUserLoggedInVideos] = useRecoilState(userVideos);
    const [videoData, setVideoData] = useState<VideoForUploadVideo>({
        title: '',
        description: '',
        thumbnailURL: '',
        thumbnailName: '',
        videoURL: '',
        videoName: '',
        tags: []
    });
    const [thumbnailProgress, setThumbnailProgress] = useState<string>("0");
    const [videoProgress, setVideoProgress] = useState<string>("0");
    const [videoThumbnailFile, setVideoThumbnailFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('access_token')) {
            navigate('/signIn');
        }
    }, []);


    // upload thumbnail to storage
    async function uploadThumbnail(file: File) {

        if (!file) {
            alert("Please upload an image first!");
        }

        const storageRef = ref(storage, `/files/${file.name}`);

        // progress can be paused and resumed. It also exposes progress updates.
        // Receives the storage reference and the file to upload.
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                // update progress
                setThumbnailProgress(percent + '%');
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);
                    setVideoData(prevValues => {
                        const newVideoData = {
                            ...prevValues,
                            thumbnailURL: url,
                            thumbnailName: file.name
                        }
                        return newVideoData;
                    });
                });
            }
        );
    }


    // upload video to storage
    async function uploadVideo(file: File) {

        if (!file) {
            alert("Please upload an image first!");
        }

        const storageRef = ref(storage, `/files/${file.name}`);

        // progress can be paused and resumed. It also exposes progress updates.
        // Receives the storage reference and the file to upload.
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                // update progress
                setVideoProgress(percent + '%');
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);
                    setVideoData(prevValues => {
                        const newVideoData = {
                            ...prevValues,
                            videoURL: url,
                            videoName: file.name
                        }
                        return newVideoData;
                    });
                });
            }
        );
    }


    // Make Save Video Api Call
    async function handleUploadVideo() {
        if (videoData.title === '' || videoData.description === '' || videoData.thumbnailURL === '' || videoData.videoURL === '' || videoData.tags.length === 0) {
            alert('Kndly fill all fields. All are compulsory to fill...');
            console.log(videoData);
        } else {
                try{
                    const response = await Axios.post('/videos/', {channelName: userLoggedIn.username, ...videoData}, {withCredentials: true});
                    if(response) {
                        setUserLoggedInVideos(prevValues => {
                            const updatedUserVideos = [...prevValues, response.data];
                            return updatedUserVideos;
                        });
                        alert('Video Uploaded Successfully...');
                        navigate('/');
                    }
                }catch(err) {
                    if(isAxiosError(err)) {
                        if(err.response) {
                            alert(err.response.data.message);
                        }else if(err.request) {
                            alert('Upload Failed, Please Try Later...');
                        }else {
                            alert('Error Occured: ' + err.message);
                        }
                    }else {
                        alert('An unknown error occured...');
                    }
                }
        }
    }

    return(<UploadVideo videoData={videoData} setVideoData={setVideoData} videoThumbnailFile={videoThumbnailFile} setVideoThumbnailFile={setVideoThumbnailFile} thumbnailProgress={thumbnailProgress} videoFile={videoFile} setVideoFile={setVideoFile} videoProgress={videoProgress} uploadThumbnail={uploadThumbnail} uploadVideo={uploadVideo} handleUploadVideo={handleUploadVideo}/>)
}