import React, { useEffect, useState } from "react";
import UpdateVideo from "../components/Major Components/updateVideo";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userVideos } from "../recoil/atoms";
import Axios, { isAxiosError } from "axios";
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

export interface VideoForUpdateVideo {
    title: string;
    description: string;
    tags: string[];
    thumbnailURL: string;
    thumbnailName: string;
    videoURL: string;
    videoName: string;
}

export default function UpdateVideoPage() {
    const { videoId } = useParams();
    const [userLoggedInVideos, setUserLoggedInVideos] = useRecoilState(userVideos);
    const [video, setVideo] = useState<VideoForUpdateVideo>({
        title: '',
        description: '',
        tags: [],
        thumbnailURL: '',
        thumbnailName: '',
        videoURL: '',
        videoName: ''
    });
    const [videoThumbnailFile, setVideoThumbnailFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbnailProgress, setThumbnailProgress] = useState<string>("0");
    const [videoProgress, setVideoProgress] = useState<string>("0");
    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get('access_token')) {
            const fetchVideo = async () => {
                try {
                    const video = await Axios.get(`/videos/find/${videoId}`);
                    if (video) {
                        setVideo(video.data);
                    }
                } catch (err) {
                    if (Axios.isAxiosError(err)) {
                        if (err.response) {
                            alert(err.response.data.message);
                            navigate('/');
                        } else if (err.request) {
                            alert('Request Failed, Please Try Again...');
                            navigate('/');
                        } else {
                            console.log(err.message);
                        }
                    } else {
                        alert('An unknown error occurred.');
                    }
                }
            }
            fetchVideo();
        } else {
            navigate('/signIn');
        }
    }, []);


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
                    const fileNameForDeletion = video.thumbnailName;
                    const desertRef = ref(storage, `files/${fileNameForDeletion}`);
                    deleteObject(desertRef).then(() => {
                        console.log('file deleted Successfully');
                    }).catch(err => { console.log(err.message) });
                    setVideo(prevValues => {
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
                    const fileNameForDeletion = video.videoName;
                    const desertRef = ref(storage, `files/${fileNameForDeletion}`);
                    deleteObject(desertRef).then(() => {
                        console.log('file deleted Successfully');
                    }).catch(err => { console.log(err.message) });
                    setVideo(prevValues => {
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


    async function handleUpdateVideo() {
        if (video.title === '' || video.description === '' || video.thumbnailURL === '' || video.videoURL === '' || video.tags.length === 0) {
            alert('Kndly fill all fields. All are compulsory to fill...');
            console.log(video);
        } else {
            try {
                const response = await Axios.put(`/videos/${videoId}`, video, { withCredentials: true });
                if (response) {
                    setUserLoggedInVideos(prevValues => {
                        const previousVideos = [...prevValues];
                        const indexOfVideo = prevValues.findIndex(video => video._id === videoId);
                        previousVideos[indexOfVideo] = response.data;
                        const updatedUserVideos = previousVideos
                        return updatedUserVideos;
                    });
                    alert('Video Updated Successfully...');
                    navigate('/account');
                }
            } catch (err) {
                if(isAxiosError(err)) {
                    if (err.response) {
                        alert(err.response.data.message);
                    } else if (err.request) {
                        alert('Upload Failed, Please Try Later...');
                    } else {
                        alert('Error Occured: ' + err.message);
                    }
                }else {
                    alert("An unknown error occured...");
                }
            }
        }
    }


    return (
        <UpdateVideo video={video} setVideo={setVideo} videoThumbnailFile={videoThumbnailFile} setVideoThumbnailFile={setVideoThumbnailFile} thumbnailProgress={thumbnailProgress} videoFile={videoFile} setVideoFile={setVideoFile} videoProgress={videoProgress} uploadThumbnail={uploadThumbnail} uploadVideo={uploadVideo} handleUpdateVideo={handleUpdateVideo} />
    )
}