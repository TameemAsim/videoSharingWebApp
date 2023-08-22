import React, {useEffect, useState} from "react";
import { VideoCard } from "../common/cards";
import { SubscribeButton } from "../common/buttons";
import { User, Video } from "../../recoil/atoms";

interface Props {
    channel: User,
    channelVideos: Video[]
}

export default function ViewUser({ channel, channelVideos }: Props) {


    return (
        <div className="w-screen">
            <img src='defaultAvatar.png' className="sm:h-20 sm:w-20 md:w-40 md:h-40 mx-auto mt-6" alt="Channel Profile Photo" />
            <div className="w-full flex justify-center">
                <h1 className="mt-2 p-1 text-2xl font-semibold">{channel.username}</h1>
            </div>
            <div className="w-full flex justify-center">
                <h1 className="text-lg font-normal underline">{channel.email}</h1>
            </div>
            <div className="w-full my-2 flex justify-center">
                <SubscribeButton channelId={channel._id} />
                <h1 className="text-md font-light ml-2 my-auto">{channel.subscribers} subscribers</h1>
            </div>
            <hr className="mt-6 w-[90%] mx-auto border-t-2 border-black border-double" />
            <div className="w-full flex flex-wrap justify-center mx-3 mt-3 text-white">
                {channelVideos.length > 0 && channelVideos.map((video, index) => {
                    return <div className='text-black border border-white rounded-lg mt-1 sm:w-[90%] sm:space-x-0 sm:mx-auto md:w-[50%] md:border-2 md:mx-0 lg:w-[33.33%] lg:border-2 cursor-pointer' key={index} ><VideoCard video={video} /></div>
                })}
            </div>
        </div>
    )
}