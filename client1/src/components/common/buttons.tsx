import React from "react";
import Cookies from "js-cookie";
import { User, user } from '../../recoil/atoms';
import { useRecoilState } from "recoil";
import Axios from 'axios';
import proxy from "../../proxy";

interface IconButtonProps {
    onClick: (ev: React.MouseEvent) => void,
    content: React.ReactNode,
    description: string
}

export function IconButton({ onClick, content, description }: IconButtonProps) {
    return (
        <div className="group inline-block relative">
            <button className='hover:bg-red-500 hover:text-white p-2 my-2 mx-3 rounded-full' onClick={onClick}>
                {content}
            </button>
            <div className="absolute hidden group-hover:block bg-gray-200 text-gray-800 px-2 py-1 rounded-lg mt-2">
                {description}
            </div>
        </div>
    )
}

interface BrandButtonProps {
    onClick: (ev: React.MouseEvent) => void,
    content: string
}

export function BrandButton({ onClick, content }: BrandButtonProps) {
    return (
        <button className='p-1 m-2 ml-4 bg-red-500 rounded-lg font-bold text-lg text-white' onClick={onClick}>
            {content}
        </button>
    )
}

interface AccountButtonProps {
    contentIfSignedIn: React.ReactNode,
    contentIfSignedOut: string,
    onClick: (ev: React.MouseEvent) => void,
    description: string
}

export function AccountButton({ contentIfSignedIn, contentIfSignedOut, onClick, description }: AccountButtonProps) {
    return (
        <div className="group inline-block relative">
            <button className={` ${Cookies.get('access_token') ? 'rounded-full hover:border hover:border-black mt-3' : 'border-2 w-[90%] h-[75%] rounded-md px-3 py-1 border-red-500 hover:bg-red-500 hover:text-white'} my-2 mx-[1%] mr-3`} onClick={onClick}>
                {Cookies.get('access_token') ? contentIfSignedIn : contentIfSignedOut}
            </button>
            <div className="absolute hidden group-hover:block bg-gray-200 text-gray-800 px-2 py-1 rounded-lg mt-2">
                {description}
            </div>
        </div>
    )
}

interface SubscribeButtonProps {
    channelId: string
}

export function SubscribeButton({ channelId }: SubscribeButtonProps) {
    const [userLoggedIn, setUserLoggedIn] = useRecoilState(user);


    function handleSubscribeClick() {
        Axios.put(`${proxy}/users/sub/${channelId}`, {}, {withCredentials: true})
            .then(response => {
                if (response.data === 'Subscription successful...') {
                    
                    setUserLoggedIn((prevLoggedInUser) => {
                        return {
                            ...prevLoggedInUser,
                            subscribedUsers: [...prevLoggedInUser.subscribedUsers, channelId]
                        }
                    });
                } else {
                    alert('An error occured... Please try later');
                }
            })
            .catch(err => {
                alert(`An occured... ${err.message}`);
            })
    }


    function handleUnsubscribeClick() {
        Axios.put(`${proxy}/users/unsub/${channelId}`, {}, {withCredentials: true})
            .then(response => {
                if (response.data === "Unsubscribed Successfully...") {
                    
                    setUserLoggedIn((prevLoggedInUser) => {
                        const subscribedUsersList = prevLoggedInUser.subscribedUsers;
                        
                        return {
                            ...prevLoggedInUser,
                            subscribedUsers: subscribedUsersList.filter(item => item !== channelId)
                        }
                    });
                } else {
                    alert('An error occured... Please try later');
                }
            })
            .catch(err => {
                alert(`An occured... ${err.message}`);
            });
    }


    return (
        <div>
            <button className={userLoggedIn.subscribedUsers.includes(channelId) ? 'hidden' : 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 w-28 rounded-full'} onClick={ev => { ev.preventDefault(); handleSubscribeClick(); }}>
                Subscribe
            </button>
            <button className={userLoggedIn.subscribedUsers.includes(channelId) ? 'bg-white border-2 border-black hover:bg-slate-200 text-black font-bold py-2 px-4 w-30 rounded-full text-center' : 'hidden'} onClick={ev => { ev.preventDefault(); handleUnsubscribeClick(); }} >
                Unsubscribe
            </button>
        </div>
    )
}
