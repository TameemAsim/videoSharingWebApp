import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video } from "../../recoil/atoms";

interface Props {
    video: Video
}
export function VideoCard({ video }: Props) {
    const [timeDifference, setTimeDifference] = useState('');
    const navigate = useNavigate();


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






    const calculateDateDifference = (startDate: Date, endDate: string) => {
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


    useEffect(() => {
        const currentDateAndTime = getCurrentDateTimeISO8601();
        const timeDifference = calculateDateDifference(video.createdAt, currentDateAndTime);
        if(timeDifference.hours < 1) {
            setTimeDifference(calculateDateDifference(video.createdAt, currentDateAndTime).minutes + ' mins');
        }else if(timeDifference.hours >= 1 && timeDifference.days < 1) {
            setTimeDifference(calculateDateDifference(video.createdAt, currentDateAndTime).hours + ' hours');
        }else if(timeDifference.days >= 1 && timeDifference.weeks < 1) {
            setTimeDifference(calculateDateDifference(video.createdAt, currentDateAndTime).days + ' days');
        }else if(timeDifference.weeks >= 1 && timeDifference.months < 1) {
            setTimeDifference(calculateDateDifference(video.createdAt, currentDateAndTime).weeks + ' weeks');
        }else if(timeDifference.months >= 1 && timeDifference.years < 1) {
            setTimeDifference(calculateDateDifference(video.createdAt, currentDateAndTime).months + ' months');
        }else if(timeDifference.years >= 1) {
            setTimeDifference(calculateDateDifference(video.createdAt, currentDateAndTime).years + ' years');
        }else {
            setTimeDifference(0 + ' mins');
        }
        
    }, [])




    return (
        
            <div className=" m-2 bg-gray-200 rounded-lg px-1 pt-1 h-72" onClick={ev => {ev.preventDefault(); navigate(`/viewVideo/${video._id}/${video.createdAt}`)}} >
                {/* <!-- Video Thumbnail --> */}
                <img src={video.thumbnailURL} alt="Video Thumbnail" className="w-full h-[66.67%] rounded-lg mx-auto" />


                {/* <!-- Video Title --> */}
                <h2 className="text-md font-semibold mt-2 whitespace-normal truncate line-clamp-2">{video.title}</h2>




                <div className="flex items-center mt-2 pb-2">
                    {/* <!-- Channel Name --> */}
                    <p className="text-sm font-bold text-black ml-2 underline" onClick={ev => {ev.preventDefault(); ev.stopPropagation(); navigate(`/viewUser/${video.userId}`)}} >{video.channelName}</p>


                    <div className="flex-1"></div> {/* <!-- Empty space to push views and date to the right --> */}


                    {/* <!-- Views --> */}
                    <p className="text-sm text-gray-800 mr-2">{video.views} views</p>


                    {/* <!-- Upload Date --> */}
                    <p className="text-sm text-gray-800 ml-2 mr-1">{timeDifference} ago</p>
                </div>
            </div>

    )
}

export function SideVideoCard({video}: Props) {
    const [timeDifference, setTimeDifference] = useState('');
    const navigate = useNavigate();

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






    const calculateDateDifference = (startDate: Date, endDate: string) => {
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


    useEffect(() => {
        const currentDateAndTime = getCurrentDateTimeISO8601();
        const timeDifference = calculateDateDifference(video.createdAt, currentDateAndTime);
        if(timeDifference.hours < 1) {
            setTimeDifference(calculateDateDifference(video.createdAt, currentDateAndTime).minutes + ' mins');
        }else if(timeDifference.hours >= 1 && timeDifference.days < 1) {
            setTimeDifference(calculateDateDifference(video.createdAt, currentDateAndTime).hours + ' hours');
        }else if(timeDifference.days >= 1 && timeDifference.weeks < 1) {
            setTimeDifference(calculateDateDifference(video.createdAt, currentDateAndTime).days + ' days');
        }else if(timeDifference.weeks >= 1 && timeDifference.months < 1) {
            setTimeDifference(calculateDateDifference(video.createdAt, currentDateAndTime).weeks + ' weeks');
        }else if(timeDifference.months >= 1 && timeDifference.years < 1) {
            setTimeDifference(calculateDateDifference(video.createdAt, currentDateAndTime).months + ' months');
        }else if(timeDifference.years >= 1) {
            setTimeDifference(calculateDateDifference(video.createdAt, currentDateAndTime).years + ' years');
        }else {
            setTimeDifference(0 + ' mins');
        }
        
    }, []);
    
    return (
        <div className="flex flex-row sm:w-full md:w-[85%] mx-auto bg-gray-200 rounded-md p-1 cursor-pointer" onClick={ev => {ev.preventDefault(); navigate(`/viewVideo/${video._id}/${video.createdAt}`)}} >
            <div className="basis-1/2 my-auto rounded-md">
                <img className="rounded-md" src={video.thumbnailURL} alt="Thumbnail Image" />
            </div>
            <div className="basis-1/2 pl-2 my-auto">
                <h1 className="md:text-xs lg:text-sm font-semibold whitespace-normal truncate line-clamp-2">{video.title}</h1>
                <h1 className="md:text-xs lg:text-sm font-normal underline" onClick={ev => {ev.preventDefault(); ev.stopPropagation(); navigate(`/viewUser/${video.userId}`)}} >{video.channelName}</h1>
                <div className="w-full flex">
                    <h1 className="md:text-[8px] lg:text-xs font-medium">{video.views} views</h1>
                    <h1 className="md:text-[8px] lg:text-xs font-medium">&nbsp;&nbsp;|&nbsp;&nbsp;{timeDifference} ago</h1>
                </div>
            </div>
        </div>
    )
}