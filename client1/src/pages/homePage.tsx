import React, { useEffect, useState } from 'react';
import Axios, { isAxiosError } from 'axios';
import Home from '../components/Major Components/home';


export default function HomePage() {
    const [videos, setVideos] = useState([]);
    
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await Axios.get('/videos/random');
                if(response) {
                    setVideos(response.data);
                }
            } catch (err) {
                if(isAxiosError(err)) {
                    if(err.response) {
                        alert(err.response.data.message);
                    }else if(err.request) {
                        alert('Request failed. Please try again later.');
                    }else {
                        alert('An error occurred. Please try again later.');
                    }
                }else {
                    alert('An unknown error occured...');
                }
            }
        }
        fetchVideos();
    }, [])

    return (<Home arrayOfVideos={videos} />)
}