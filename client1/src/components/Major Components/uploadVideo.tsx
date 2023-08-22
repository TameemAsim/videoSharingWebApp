import React, { useEffect, useState } from 'react';
import Header from '../layout/header';
import { VideoForUploadVideo } from '../../pages/uploadVideoPage';

interface Props {
    videoData: VideoForUploadVideo,
    setVideoData: React.Dispatch<React.SetStateAction<VideoForUploadVideo>>,
    videoThumbnailFile: File | null,
    setVideoThumbnailFile: React.Dispatch<React.SetStateAction<File | null>>,
    videoFile: File | null,
    setVideoFile: React.Dispatch<React.SetStateAction<File | null>>,
    thumbnailProgress: string,
    videoProgress: string,
    uploadThumbnail: (file: File) => void,
    uploadVideo: (file: File) => void,
    handleUploadVideo: () => void
}

export default function UploadVideo({ videoData, setVideoData, videoThumbnailFile, setVideoThumbnailFile, thumbnailProgress, videoFile, setVideoFile, videoProgress, uploadThumbnail, uploadVideo, handleUploadVideo }: Props) {
    const [tagForAddition, setTagForAddition] = useState('');


    return (<div>
        <Header />
        {/* video title */}
        <div className='w-screen flex flex-col items-center'>
            <div className='mt-10 mb-4 sm:w-[95%] md:w-[60%] lg:w-[50%]'>
                <h1 className='text-xl font-semibold'>Video Title:</h1>
                <input type='text' className='focus:outline-none border-b-2 border-black text-base font-normal mx-auto mt-3 w-full' placeholder='Add your video title here...' onChange={ev => {
                    ev.preventDefault();
                    setVideoData(prevValues => {
                        const newVideoData = {
                            ...prevValues,
                            title: ev.target.value
                        }
                        return newVideoData;
                    });
                }} />
            </div>
            {/* video description */}
            <div className='mb-4 sm:w-[95%] md:w-[60%] lg:w-[50%]'>
                <h1 className='text-xl font-semibold'>Video Description:</h1>
                <textarea cols={12} maxLength={1200} className='focus:outline-none border-2 h-52 border-black text-base font-normal mx-auto mt-3 w-full' placeholder='Add your video title here...' onChange={ev => {
                    ev.preventDefault();
                    setVideoData(prevValues => {
                        const newVideoData = {
                            ...prevValues,
                            description: ev.target.value
                        }
                        return newVideoData;
                    });
                }} />
                <p className='mx-auto text-sm font-semibold mt-1'>{videoData.description.length}/1200</p>
            </div>
            {/* video tags */}
            <div className='mb-4 sm:w-[95%] md:w-[60%] lg:w-[50%]'>
                <div className=' w-full flex flex-wrap p-2'>
                    {videoData.tags.map((tag, index) => {
                        return (
                            <div className='p-2 m-2 rounded-md bg-red-500 text-sm text-white font-semibold'>
                                <div className='flex'>
                                    {tag} <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 ml-2 my-auto"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        onClick={(ev) => {
                                            ev.preventDefault(); setVideoData(prevValues => {
                                                const updatedTags = prevValues.tags.filter((_, i) => i !== index);
                                                return { ...prevValues, tags: updatedTags };
                                            })
                                        }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='w-full flex'>
                    <input type='text' placeholder='Type your tag here...' value={tagForAddition} className='w-[80%] focus:outline-none border-b-2 border-black px-2' onChange={ev => {
                        ev.preventDefault();
                        setTagForAddition(ev.target.value);
                    }} />
                    <button className='p-1 w-[20%] bg-black rounded-md text-sm font-semibold text-white' onClick={ev => {
                        ev.preventDefault();
                        console.log(videoData.tags)
                        setVideoData(prevValues => {
                            const tags = prevValues.tags;
                            const newTag = tagForAddition.split('')[0] === '#' ? tagForAddition.split('').splice(0, 0) : tagForAddition;
                            const updatedTags: string[] = [...tags, newTag] as string[];
                            return { ...prevValues, tags: updatedTags };
                        });
                        setTagForAddition('');
                    }}>Add Tag</button>
                </div>
            </div>
            {/* upload video thumbnail */}
            <div className='mb-4 sm:w-[95%] md:w-[60%] lg:w-[50%]'>
                <h1 className='text-xl font-semibold'>Video Thumbnail:</h1>
                <input type='file' className='focus:outline-none border-b-2 border-black text-base font-normal mx-auto mt-3 w-full' placeholder='' onChange={ev => {
                    ev.preventDefault();
                    ev.target.files && setVideoThumbnailFile(ev.target.files[0]);
                }} />
                <p className='mx-auto text-sm font-semibold mt-1'>{thumbnailProgress}</p>
                <button className='p-1 mt-1 text-md bg-white border-2 border-red-500 text-red-500 rounded-lg' onClick={ev => { ev.preventDefault(); videoThumbnailFile && uploadThumbnail(videoThumbnailFile); }}>Upload Thumbnail</button>
            </div>
            {/* upload video */}
            <div className='mb-4 sm:w-[95%] md:w-[60%] lg:w-[50%]'>
                <h1 className='text-xl font-semibold'>Video File:</h1>
                <input type='file' accept='video/*' className='focus:outline-none border-b-2 border-black text-base font-normal mx-auto mt-3 w-full' placeholder='' onChange={ev => {
                    ev.preventDefault();
                    ev.target.files && setVideoFile(ev.target.files[0]);
                }} />
                <p className='mx-auto text-sm font-semibold mt-1'>{videoProgress}</p>
                <button className='p-1 mt-1 text-md bg-white border-2 border-red-500 text-red-500 rounded-lg' onClick={ev => { ev.preventDefault(); videoFile && uploadVideo(videoFile); }}>Upload Video File</button>
            </div>
            {/* Save Video Button OR Upload Full Data Button */}
            <div className='mb-4 mt-2 sm:w-[95%] md:w-[60%] lg:w-[50%]'>
                <button className='bg-red-400 hover:bg-red-600 w-full text-white text-lg font-bold rounded-lg py-1' onClick={ev => { ev.preventDefault(); handleUploadVideo() }}>Upload Video</button>
            </div>
        </div>
    </div>
    );
}

// placeholder="Enter video description here..."
//         rows={5}
//         cols={50}