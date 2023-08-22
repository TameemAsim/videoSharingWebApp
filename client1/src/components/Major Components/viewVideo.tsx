import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../layout/header";
import Axios, { isAxiosError } from "axios";
import { SubscribeButton } from "../common/buttons";
import { useRecoilState } from "recoil";
import { User, Video, user } from "../../recoil/atoms";
import { SideVideoCard } from "../common/cards";

interface Comment {
    _id: string,
    username: string,
    userId: string,
    videoId: string,
    desc: string
}


export default function ViewVideo() {
    const [userLoggedIn, setUserLoggedIn] = useRecoilState(user);
    const { videoId, uploadedAt } = useParams();
    const innerComments = useRef<HTMLDivElement | null>(null);
    const outerComments = useRef<HTMLDivElement | null>(null);
    const [video, setVideo] = useState<Video | null>(null);
    const [recommendedVideos, setRecommendedVideos] = useState<Video[] | null>(null);
    const [channel, setChannel] = useState<User | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [timeDifference, setTimeDifference] = useState<string>('');
    const [descriptionExpanded, setDescriptionExpanded] = useState<boolean>(false);
    const [commentTyped, setCommentTyped] = useState<string>('');
    const [commentScroll, setCommentScroll] = useState<boolean | null>(null);
    const [timeSpentOnThisVideo, setTimeSpentOnThisVideo] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await Axios.get(`/videos/find/${videoId}`);
                if (response) {
                    setVideo(response.data);
                    const user = await Axios.get(`/users/find/${response.data.userId}`);
                    if (user) {
                        setChannel(user.data);
                    }
                    const comments = await Axios.get(`/comments/${response.data._id}`);
                    if (comments) {
                        setComments(comments.data);
                    }
                }
            } catch (err) {
                if (isAxiosError(err)) {
                    if (err.response) {
                        if (err.response.data.message === 'Video not found...') {
                            alert(err.response.data.message);
                            navigate('/');
                        } else {
                            console.log(err.response);
                        }
                    } else if (err.request) {
                        console.log('Request failed... Please refresh the page.');
                    } else {
                        console.log('An error occured... Please refresh the page.');
                    }
                } else {
                    alert('An unknown error occured...');
                }
            }
        }

        const fetchRecommendedVideos = async () => {
            try {
                const response = await Axios.get('/videos/random');
                if (response) {
                    setRecommendedVideos(response.data);
                }
            } catch (err) {
                if (isAxiosError(err)) {
                    if (err.response) {
                        alert(err.response.data.message);
                    } else if (err.request) {
                        alert('Request failed. Please try again later.');
                    } else {
                        alert('An error occurred. Please try again later.');
                    }
                } else {
                    alert('An unknown error occured...');
                }

            }
        }

        fetchVideo();
        fetchRecommendedVideos();

        if (innerComments.current && outerComments.current) {
            const innerCommentsHeight = innerComments.current.clientHeight;
            const outerCommentsHeight = outerComments.current.clientHeight;
            if (innerCommentsHeight > outerCommentsHeight) {
                setCommentScroll(true);
            }
        }

        setTimeSpentOnThisVideo(window.performance.now());

        setTimeout(() => {
            const currentDateAndTime = getCurrentDateTimeISO8601();
            const timeDifference = calculateDateDifference(uploadedAt, currentDateAndTime);
            if (timeDifference.hours < 1) {
                setTimeDifference(calculateDateDifference(uploadedAt, currentDateAndTime).minutes + ' mins');
            } else if (timeDifference.hours >= 1 && timeDifference.days < 1) {
                setTimeDifference(calculateDateDifference(uploadedAt, currentDateAndTime).hours + ' hours');
            } else if (timeDifference.days >= 1 && timeDifference.weeks < 1) {
                setTimeDifference(calculateDateDifference(uploadedAt, currentDateAndTime).days + ' days');
            } else if (timeDifference.weeks >= 1 && timeDifference.months < 1) {
                setTimeDifference(calculateDateDifference(uploadedAt, currentDateAndTime).weeks + ' weeks');
            } else if (timeDifference.months >= 1 && timeDifference.years < 1) {
                setTimeDifference(calculateDateDifference(uploadedAt, currentDateAndTime).months + ' months');
            } else if (timeDifference.years >= 1) {
                setTimeDifference(calculateDateDifference(uploadedAt, currentDateAndTime).years + ' years');
            } else {
                setTimeDifference(0 + ' mins');
            }

        }, 500);

        setTimeout(() => {
            const endTime: number = window.performance.now();
            const timeSpent = endTime - timeSpentOnThisVideo;

            if(endTime >= 5000) {
                Axios.put(`/videos/view/${videoId}`)
                .then(response => {
                    if(response.data.status === 201) {
                        console.log('View added to video.');
                    }else {
                        console.log('Some error occured in add view to video.');
                    }
                }).catch(err => {
                    console.log('Some frontend error occured: ', err.message);
                });
            }

        }, 5000);

    }, []);

    const getCurrentDateTimeISO8601 = () => {
        const currentDate = new Date();


        // Format the date and time components to include leading zeros if needed
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');


        // Get the timezone offset in the format ±HH:mm
        const timezoneOffsetMinutes = currentDate.getTimezoneOffset();
        const timezoneOffsetHours = Math.abs(timezoneOffsetMinutes / 60);
        const timezoneOffsetSign = timezoneOffsetMinutes < 0 ? '+' : '-';
        const timezoneOffsetFormatted = `${timezoneOffsetSign}${String(timezoneOffsetHours).padStart(2, '0')}:${String(Math.abs(timezoneOffsetMinutes % 60)).padStart(2, '0')}`;


        // Combine the components to form the ISO 8601 formatted date and time
        const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffsetFormatted}`;
        return formattedDateTime;
    };






    const calculateDateDifference = (startDate: string | undefined, endDate: string) => {
        if (typeof (startDate) !== "string") {
            return {
                minutes: 0,
                hours: 0,
                days: 0,
                weeks: 0,
                months: 0,
                years: 0,
            };
        }
        const start = new Date(startDate);
        const end = new Date(endDate);


        const timeDifference = end.getTime() - start.getTime();
        const millisecondsPerMinute = 1000 * 60;
        const millisecondsPerHour = millisecondsPerMinute * 60;
        const millisecondsPerDay = millisecondsPerHour * 24;
        const millisecondsPerWeek = millisecondsPerDay * 7;
        const millisecondsPerMonth = millisecondsPerDay * 30; // Approximate, adjust as needed
        const millisecondsPerYear = millisecondsPerDay * 365; // Approximate, adjust as needed


        const minutesDifference = Math.floor(timeDifference / millisecondsPerMinute);
        const hoursDifference = Math.floor(timeDifference / millisecondsPerHour);
        const daysDifference = Math.floor(timeDifference / millisecondsPerDay);
        const weeksDifference = Math.floor(timeDifference / millisecondsPerWeek);
        const monthsDifference = Math.floor(timeDifference / millisecondsPerMonth);
        const yearsDifference = Math.floor(timeDifference / millisecondsPerYear);


        return {
            minutes: minutesDifference,
            hours: hoursDifference,
            days: daysDifference,
            weeks: weeksDifference,
            months: monthsDifference,
            years: yearsDifference,
        };
    };


    return (
        <div className="w-screen">
            <Header />

            {(video && channel) && (
                <div className="w-full">
                    <div className="mt-4 w-[90%] mx-auto flex sm:hidden md:flex">
                        <div className="basis-2/3 h-5 bg-red-500 ">
                            {/* Video Frame */}
                            <video controls={true} className="w-full bg-white mb-3">
                                <source src={video.videoURL} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            {/* Video Title */}
                            <h1 className="text-xl font-semibold mb-2">{video.title}</h1>
                            <div className="w-full flex">
                                {/* Channel Image */}
                                <img className="h-11 w-11 rounded-full mt-1 mr-3 cursor-pointer" src={channel.img} alt="channel image" onClick={ev => { ev.preventDefault(); navigate(`/viewUser/${channel._id}`) }} />
                                {/* Channel Name & Subscribers */}
                                <div className="mr-4 cursor-pointer" onClick={ev => { ev.preventDefault(); navigate(`/viewUser/${channel._id}`) }}>
                                    <h1 className="text-lg font-semibold">{video.channelName}</h1>
                                    <h1 className="text-sm font-thin">{channel.subscribers} Subscribers</h1>
                                </div>
                                {/* Subscribe/Unsubscribe Button */}
                                <div div-username='Subscribe Button' className="mt-2 mr-8">
                                    <SubscribeButton channelId={channel._id} />
                                </div>
                                {/* Like Button */}
                                <button name='like button' className={`${video.likes.includes(userLoggedIn._id) ? 'hidden' : ''} mt-1 p-1 rounded-3xl w-20 border-2 border-red-500 `} onClick={async (ev) => {
                                    ev.preventDefault();
                                    try {
                                        const response = await Axios.put(`/users/like/${video._id}`);
                                        if (response) {

                                            setVideo((prevVideo) => {
                                                if (prevVideo) {
                                                    const updatedLikes = [...prevVideo.likes, userLoggedIn._id];
                                                    return {
                                                        ...prevVideo,
                                                        likes: updatedLikes,
                                                        dislikes: prevVideo.dislikes.filter((dislike) => dislike !== userLoggedIn._id),
                                                    };
                                                } else {
                                                    return prevVideo;
                                                }

                                            });
                                        }
                                    } catch (err) {
                                        if (isAxiosError(err)) {
                                            if (err.response) {
                                                console.log(err);
                                            } else if (err.request) {
                                                console.log('Request failed... Please refresh the page.');
                                            } else {
                                                console.log('An error occured... Please refresh the page.');
                                            }
                                        } else {
                                            alert('An unknown error occured...');
                                        }
                                    }
                                }} >
                                    👍 &nbsp;&nbsp;{video.likes.length}
                                </button>
                                {/* Dislike Button */}
                                <button name='dislike button' className={`${video.dislikes.includes(userLoggedIn._id) ? 'hidden' : ''} mt-1 ml-2 p-1 rounded-3xl w-20 border-2 border-red-500 `} onClick={async (ev) => {
                                    ev.preventDefault();
                                    try {
                                        const response = await Axios.put(`/users/dislike/${video._id}`);
                                        if (response) {
                                            setVideo((prevVideo) => {
                                                if (prevVideo) {
                                                    const updatedDislikes = [...prevVideo.dislikes, userLoggedIn._id];
                                                    return {
                                                        ...prevVideo,
                                                        dislikes: updatedDislikes,
                                                        likes: prevVideo.likes.filter((like) => like !== userLoggedIn._id),
                                                    };
                                                } else {
                                                    return prevVideo
                                                }
                                            });
                                        }
                                    } catch (err) {
                                        if (isAxiosError(err)) {
                                            if (err.response) {
                                                console.log(err);
                                            } else if (err.request) {
                                                console.log('Request failed... Please refresh the page.');
                                            } else {
                                                console.log('An error occured... Please refresh the page.');
                                            }
                                        } else {
                                            alert('An unknown error occured...');
                                        }
                                    }
                                }} >
                                    👎 &nbsp;&nbsp;{video.dislikes.length}
                                </button>
                                {/* Share Video Button for large screens */}
                                <div className="ml-2 mt-1 md:hidden lg:block">
                                    <ShareOptions textToShare={`http://localhost:3000/viewVideo/${videoId}`} />
                                </div>
                            </div>
                            {/* Share Video Button for medium screens */}
                            <div className="mt-2 md:block lg:hidden">
                                <ShareOptions textToShare={`http://localhost:3000/viewVideo/${videoId}`} />
                            </div>
                            {/* Video Description */}
                            <div className="w-full p-3 mt-5 mb-5 rounded-md bg-zinc-200">
                                <h1 className="text-md font-bold mb-1">{video.views} views &nbsp;&nbsp;&nbsp;{timeDifference} ago</h1>
                                <p className={descriptionExpanded ? "text-sm font-medium" : "text-sm font-medium whitespace-normal truncate line-clamp-2"}>{video.description}
                                    <div className="w-full flex flex-wrap">
                                        {video.tags.map((tag) => {
                                            return <p className="text-sm  text-blue-700 font-medium" onClick={ev => { ev.preventDefault(); navigate(`/tags/${tag}`) }}>&nbsp;{`${tag}`}</p>;
                                        })}
                                    </div>
                                </p>
                                {descriptionExpanded ? '' : <button className="focus:outline-none text-sm font-bold underline" onClick={ev => {
                                    ev.preventDefault();
                                    setDescriptionExpanded(true);
                                }}>Show more</button>}
                                {!descriptionExpanded ? '' : <button className="focus:outline-none text-sm font-bold underline" onClick={ev => {
                                    ev.preventDefault();
                                    setDescriptionExpanded(false);
                                }}>Show less</button>}
                            </div>
                            {/* Comment Input and Add comment Button */}
                            <div className="w-full flex mb-5">
                                <input type='text' className='focus:outline-none flex-grow border-b-2 border-black text-base font-normal mx-auto mt-3 px-1' placeholder="Type your comment here..." value={commentTyped} onChange={ev => { ev.preventDefault(); setCommentTyped(ev.target.value); }} />
                                <button className="p-1 bg-black rounded-md text-white text-md font-semibold" onClick={async (ev) => {
                                    ev.preventDefault();
                                    try {
                                        const response = await Axios.post(`/comments/`, { username: userLoggedIn.username, videoId, desc: commentTyped }, { withCredentials: true });
                                        if (response) {
                                            setComments(prevValues => {
                                                return [response.data, ...prevValues]
                                            });
                                            setCommentTyped('');
                                        }
                                    } catch (err) {
                                        console.log(err);
                                    }


                                }} >Comment</button>
                            </div>
                            {/* Video comments */}
                            <div className="w-full">
                                {comments.map(comment => {
                                    return (
                                        <div className="w-full">
                                            <h1 className="text-sm font-semibold underline">{comment.username}</h1>
                                            <p className="text-sm font-normal">{comment.desc}</p>
                                        </div>
                                    )
                                })}
                            </div>

                        </div>
                        {/* Recommended Videos */}
                        <div className="basis-1/3 h-5">
                            {recommendedVideos && recommendedVideos.map(video => {
                                return <SideVideoCard video={video} />
                            })}
                        </div>
                    </div>
                    <div className="mt-4 w-screen sm:block md:hidden">
                        <div className="w-[95%] mx-auto mb-3">
                            <video controls={true} className="w-full bg-white mb-3">
                                <source src={video.videoURL} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <h1 className="text-xl font-semibold mb-2">{video.title}</h1>
                            <div className="w-full flex mb-1">
                                <img className="h-11 w-11 rounded-full mt-1 mr-3 cursor-pointer" src={channel.img} alt="channel image" onClick={ev => { ev.preventDefault(); navigate(`/viewUser/${channel._id}`) }} />
                                {/* Channel Name & Subscribers */}
                                <div className="mr-4 cursor-pointer" onClick={ev => { ev.preventDefault(); navigate(`/viewUser/${channel._id}`) }}>
                                    <h1 className="text-lg font-semibold">{video.channelName}</h1>
                                    <h1 className="text-sm font-thin">{channel.subscribers} Subscribers</h1>
                                </div>
                                {/* Subscribe/Unsubscribe Button */}
                                <div div-username='Subscribe Button' className="mt-2 mr-8">
                                    <SubscribeButton channelId={channel._id} />
                                </div>
                            </div>
                            <div className="w-full flex">
                                <button name='like button' className={`${video.likes.includes(userLoggedIn._id) ? 'hidden' : ''} mt-1 p-1 rounded-3xl w-20 border-2 border-red-500 `} onClick={async (ev) => {
                                    ev.preventDefault();
                                    try {
                                        const response = await Axios.put(`/users/like/${video._id}`);
                                        if (response) {
                                            setVideo((prevVideo) => {
                                                if (prevVideo) {
                                                    const updatedLikes = [...prevVideo.likes, userLoggedIn._id];
                                                    return {
                                                        ...prevVideo,
                                                        likes: updatedLikes,
                                                        dislikes: prevVideo.dislikes.filter((dislike) => dislike !== userLoggedIn._id),
                                                    };
                                                } else {
                                                    return prevVideo;
                                                }
                                            });
                                        }
                                    } catch (err) {
                                        if (isAxiosError(err)) {
                                            if (err.response) {
                                                console.log(err);
                                            } else if (err.request) {
                                                console.log('Request failed... Please refresh the page.');
                                            } else {
                                                console.log('An error occured... Please refresh the page.');
                                            }
                                        } else {
                                            alert('An unknown error occured...');
                                        }
                                    }
                                }} >
                                    👍 &nbsp;&nbsp;{video.likes.length}
                                </button>
                                {/* Dislike Button */}
                                <button name='dislike button' className={`${video.dislikes.includes(userLoggedIn._id) ? 'hidden' : ''} mt-1 ml-2 p-1 rounded-3xl w-20 border-2 border-red-500 `} onClick={async (ev) => {
                                    ev.preventDefault();
                                    try {
                                        const response = await Axios.put(`/users/dislike/${video._id}`);
                                        if (response) {
                                            setVideo((prevVideo) => {
                                                if (prevVideo) {
                                                    const updatedDislikes = [...prevVideo.dislikes, userLoggedIn._id];
                                                    return {
                                                        ...prevVideo,
                                                        dislikes: updatedDislikes,
                                                        likes: prevVideo.likes.filter((like) => like !== userLoggedIn._id),
                                                    };
                                                } else {
                                                    return prevVideo; // or handle the case when prevVideo is null
                                                }
                                            });
                                        }
                                    } catch (err) {
                                        if (isAxiosError(err)) {
                                            if (err.response) {
                                                console.log(err);
                                            } else if (err.request) {
                                                console.log('Request failed... Please refresh the page.');
                                            } else {
                                                console.log('An error occured... Please refresh the page.');
                                            }
                                        } else {
                                            alert('An unknown error occured...');
                                        }
                                    }
                                }} >
                                    👎 &nbsp;&nbsp;{video.dislikes.length}
                                </button>
                                <div className="ml-2 mt-1">
                                    <ShareOptions textToShare={`http://localhost:3000/viewVideo/${videoId}`} />
                                </div>
                            </div>
                            <div className="w-full p-3 mt-5 mb-5 rounded-md bg-zinc-200">
                                <h1 className="text-md font-bold mb-1">{video.views} views &nbsp;&nbsp;&nbsp;{timeDifference} ago</h1>
                                <p className={descriptionExpanded ? "text-sm font-medium" : "text-sm font-medium whitespace-normal truncate line-clamp-2"}>{video.description}
                                    <div className="w-full flex flex-wrap">
                                        {video.tags.map((tag) => {
                                            return <p className="text-sm  text-blue-700 font-medium" onClick={ev => { ev.preventDefault(); navigate(`/tags/${tag}`) }}>&nbsp;{`${tag}`}</p>;
                                        })}
                                    </div>
                                </p>
                                {descriptionExpanded ? '' : <button className="focus:outline-none text-sm font-bold underline" onClick={ev => {
                                    ev.preventDefault();
                                    setDescriptionExpanded(true);
                                }}>Show more</button>}
                                {!descriptionExpanded ? '' : <button className="focus:outline-none text-sm font-bold underline" onClick={ev => {
                                    ev.preventDefault();
                                    setDescriptionExpanded(false);
                                }}>Show less</button>}
                            </div>
                            <div className="w-full flex mb-5">
                                <input type='text' className='focus:outline-none flex-grow border-b-2 border-black text-base font-normal mx-auto mt-3 px-1' placeholder="Type your comment here..." value={commentTyped} onChange={ev => { ev.preventDefault(); setCommentTyped(ev.target.value); }} />
                                <button className="p-1 bg-black rounded-md text-white text-md font-semibold" onClick={async (ev) => {
                                    ev.preventDefault();
                                    try {
                                        const response = await Axios.post(`/comments/`, { username: userLoggedIn.username, videoId, desc: commentTyped }, { withCredentials: true });
                                        if (response) {
                                            setComments(prevValues => {
                                                return [response.data, ...prevValues]
                                            });
                                            setCommentTyped('');
                                        }
                                    } catch (err) {
                                        console.log(err);
                                    }


                                }} >Comment</button>
                            </div>
                            {/* Video comments */}
                            <div ref={outerComments} className={`h-[300px] mb-3 ${commentScroll ? 'overflow-y-scroll' : ''}`}>
                                <div ref={innerComments} className="w-full">
                                    {comments.map(comment => {
                                        return (
                                            <div className="w-full">
                                                <h1 className="text-sm font-semibold underline">{comment.username}</h1>
                                                <p className="text-sm font-normal">{comment.desc}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="w-full">
                                <SideVideoCard video={video} />
                            </div>
                        </div>
                    </div>
                </div>
            )}



        </div>
    )
}

function ShareOptions({ textToShare }: { textToShare: string }) {
    const [shareOptionsDisplayed, setShareOptionsDisplayed] = useState(false);

    const copyUrl = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url)
            .then(() => {
                setShareOptionsDisplayed(!shareOptionsDisplayed);
                alert('Url copied to clipboard.');
            })
            .catch(err => {
                console.log('Url Copy Error: ' + err.message);
            });
    }

    const handleEmailShare = () => {
        const subject = "Shared via React App";
        const mailtoLink = `mailto:?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(textToShare)}`;
        window.location.href = mailtoLink;
        setShareOptionsDisplayed(!shareOptionsDisplayed);
    };

    const handleWhatsAppShare = () => {
        const whatsappLink = `https://wa.me/?text=${encodeURIComponent(textToShare)}`;
        window.open(whatsappLink, "_blank");
        setShareOptionsDisplayed(!shareOptionsDisplayed);
    };

    return (
        <div>
            {!shareOptionsDisplayed && <button className="p-2 border-2 border-red-500 rounded-3xl mr-2 text-md font-semibold text-red-500 hover:bg-red-500 hover:text-white" onClick={ev => {
                ev.preventDefault();
                setShareOptionsDisplayed(!shareOptionsDisplayed);
            }} >Share</button>}
            <div>
                {shareOptionsDisplayed && <div>
                    <button className="p-2 border-2 border-red-500 rounded-3xl mr-2 text-md font-semibold text-red-500" onClick={copyUrl}>🔗 Copu Url</button>
                    <button className="p-2 border-2 border-red-500 rounded-3xl mr-2 text-md font-semibold text-red-500" onClick={handleEmailShare}>
                        📧 Email
                    </button>
                    <button className="p-2 border-2 border-red-500 rounded-3xl text-md font-semibold text-red-500" onClick={handleWhatsAppShare}>
                        💬 WhatsApp
                    </button>
                </div>}
            </div>
        </div>
    );
}

