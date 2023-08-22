import { useState } from 'react';
import Header from '../layout/header';
import { VideoForUpdateVideo } from '../../pages/updateVideoPage';

interface Props {
    video: VideoForUpdateVideo,
    setVideo: React.Dispatch<React.SetStateAction<VideoForUpdateVideo>>,
    videoThumbnailFile: File | null,
    setVideoThumbnailFile: React.Dispatch<React.SetStateAction<File | null>>,
    videoFile: File | null,
    setVideoFile: React.Dispatch<React.SetStateAction<File | null>>,
    thumbnailProgress: string,
    videoProgress: string,
    uploadThumbnail: (file: File) => void,
    uploadVideo: (file: File) => void,
    handleUpdateVideo: () => void
}

export default function UpdateVideo({ video, setVideo, videoThumbnailFile, setVideoThumbnailFile, thumbnailProgress, videoFile, setVideoFile, videoProgress, uploadThumbnail, uploadVideo, handleUpdateVideo }: Props) {
    const [tagForAddition, setTagForAddition] = useState('');

    return (
        <div>
            <Header />
            <div className='w-screen flex flex-col items-center'>
                {/* Video Title */}
                <div className='mt-10 mb-4 sm:w-[95%] md:w-[60%] lg:w-[50%]'>
                    <h1 className='text-xl font-semibold'>Video Title:</h1>
                    <input type='text' className='focus:outline-none border-2 border-black text-base font-normal mx-auto mt-3 py-1 px-1 rounded-lg w-full' placeholder='Add your video title here...' defaultValue={video.title} onChange={ev => {ev.preventDefault(); setVideo(prevValues => {
                        return {...prevValues, title: ev.target.value};
                    })}}/>
                </div>
                {/* Video Description */}
                <div className='mb-4 sm:w-[95%] md:w-[60%] lg:w-[50%]'>
                    <h1 className='text-xl font-semibold'>Video Description:</h1>
                    <textarea cols={12} maxLength={1200} className='focus:outline-none border-2 h-52 border-black text-base font-normal mx-auto mt-3 py-2 px-1 rounded-lg w-full' placeholder='Add your video title here...' defaultValue={video.description} onChange={ev => {ev.preventDefault(); setVideo(prevValues => {
                        return {...prevValues, description: ev.target.value};
                    })}}/>
                    <p className='ml-1 text-sm font-semibold mt-1'>{video.description.length}/1200</p>
                </div>
                {/* Video Tags */}
                <div className='mb-4 sm:w-[95%] md:w-[60%] lg:w-[50%]'>
                    <div className=' w-full flex flex-wrap p-2'>
                        {video.tags.map((tag, index) => {
                            return (
                                <div className='p-2 m-2 rounded-md bg-red-500 text-sm text-white font-semibold'>
                                    <div className='flex'>
                                        {tag} <div className='bg-white text-black hover:bg-black hover:text-white ml-2 my-auto cursor-pointer rounded-full'>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                onClick={ev => {
                                                    ev.preventDefault();
                                                    setVideo(prevValues => {
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
                            setVideo((prevValues) => {
                                const newTag = tagForAddition.split('')[0] === '#' ? tagForAddition.split('').splice(0, 0) : tagForAddition;
                                if (newTag) {
                                    const updatedTags: string[] = [...prevValues.tags, newTag] as string[]
                                    return {
                                        ...prevValues,
                                        tags: updatedTags
                                    };
                                }
                                return prevValues;
                            });
                            setTagForAddition('');
                        }}>Add tag</button>
                    </div>
                </div>
                {/* Video Thumbnail */}
                <div className='mb-4 sm:w-[95%] md:w-[60%] lg:w-[50%]'>
                    <h1 className='text-xl font-semibold'>Video Thumbnail:</h1>
                    <img className='w-96 my-2 mx-auto rounded-lg' src={video.thumbnailURL} alt='Video Thumbnail' />
                    <input type='file' className='focus:outline-none border-b-2 border-black text-base font-normal mx-auto mt-3 w-full' placeholder='' onChange={ev => {
                        ev.preventDefault();
                        if(ev.target.files){
                            setVideoThumbnailFile(ev.target.files[0]);
                        }
                    }} />
                    <p className='mx-auto text-sm font-semibold mt-1'>{thumbnailProgress}</p>
                    <div className='w-full my-1 flex sm:block md:flex'>
                        <button className='p-1 text-md bg-white border-2 border-red-500 text-red-500 rounded-lg' onClick={ev => { 
                            ev.preventDefault();
                            if(videoThumbnailFile){
                                uploadThumbnail(videoThumbnailFile);
                            }
                            }}>
                            Upload Updated Thumbnail
                        </button>
                        <p className='text-md font-normal my-auto ml-2 p-1 text-red-500 border-b-2 border-dotted border-red-500'>{'(If you want to update Thumbnail)'}</p>
                    </div>
                </div>
                {/* upload video */}
                <div className='mb-4 sm:w-[95%] md:w-[60%] lg:w-[50%]'>
                    <h1 className='text-xl font-semibold'>Video File:</h1>
                    <video className='w-96 my-2 mx-auto rounded-lg' controls={true}>
                        <source src={video.videoURL} type="video/mp4" />
                    </video>
                    <input type='file' accept='video/*' className='focus:outline-none border-b-2 border-black text-base font-normal mx-auto mt-3 w-full' placeholder='' onChange={ev => {
                        ev.preventDefault();
                        ev.target.files && setVideoFile(ev.target.files[0]);
                    }} />
                    <p className='mx-auto text-sm font-semibold mt-1'>{videoProgress}</p>
                    <div className='w-full my-1 flex sm:block md:flex'>
                    <button className='p-1 mt-1 text-md bg-white border-2 border-red-500 text-red-500 rounded-lg' onClick={ev => { ev.preventDefault(); videoFile && uploadVideo(videoFile); }}>Upload Updated Video File</button>
                    <p className='text-md font-normal my-auto ml-2 p-1 text-red-500 border-b-2 border-dotted border-red-500'>{'(If you want to update Video)'}</p>
                    </div>
                </div>
                {/* Update Video Button OR Update Full Data Button */}
                <div className='mb-4 mt-2 sm:w-[95%] md:w-[60%] lg:w-[50%]'>
                    <button className='bg-red-400 hover:bg-red-600 w-full text-white text-lg font-bold rounded-lg py-1' onClick={ev => { ev.preventDefault(); handleUpdateVideo(); }}>Update Video</button>
                </div>
            </div>
        </div>
    )
}