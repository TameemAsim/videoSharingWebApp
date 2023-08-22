import React, { useEffect } from 'react';
import Header from '../layout/header';
import { VideoCard } from '../common/cards';
import { Video } from '../../recoil/atoms';

interface Props {
    arrayOfVideos: Video[]
}

export default function Home({ arrayOfVideos }: Props) {

    return (
        <div>
            <Header />
            <div className='flex flex-wrap justify-center mx-3 mt-3 text-white'>
                {arrayOfVideos.map((video, index) => {
                    return <div className='text-black border border-white rounded-lg mt-1 sm:w-[90%] sm:space-x-0 sm:mx-auto md:w-[50%] md:border-2 md:mx-0 lg:w-[33.33%] lg:border-2 cursor-pointer' key={index} ><VideoCard video={video} /></div>
                })}
            </div>
        </div>
    )
}