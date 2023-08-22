import React from 'react';
import { sideBarEnabled } from '../../recoil/atoms';
import { useRecoilState } from 'recoil';
import { CrossIcon } from '../common/svgIcons'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


function Sidebar() {
    const [sideBar, setSideBar] = useRecoilState(sideBarEnabled);
    const navigate = useNavigate();


    return (
        <div className={`absolute left-0 top-0 ${sideBar ? '' : 'hidden'}`}>
            <div className='w-[242px] fixed inset-0 h-screen bg-white'>
                <div className='flex'>
                    <button className='hover:bg-red-500 hover:text-white p-2 my-2 mt-3 mx-3 rounded-full' onClick={ev => {
                        ev.preventDefault();
                        setSideBar(!sideBar);
                    }}>
                        <CrossIcon />
                    </button>
                    <button className='p-1 m-2 mt-3 ml-4 bg-red-500 rounded-lg font-bold text-lg text-white' onClick={ev => { ev.preventDefault(); navigate('/'); }}>Tam Tube</button>
                </div>
                <button className='w-full py-4 border border-x-0 border-t-1 border-b-0 border-red-100 mt-3 hover:bg-slate-200' onClick={ev => { ev.preventDefault(); navigate('/'); }}>
                    <div className='flex'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 ml-5 mr-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 22V12h6v10"
                            />
                        </svg>
                        Home
                    </div>
                </button>
                <button className={Cookies.get('access_token') ? 'w-full py-4 border border-x-0 border-t-1 border-b-0 border-red-100 hover:bg-slate-200' : 'hidden'} onClick={ev => { ev.preventDefault(); navigate('/account') }}>
                    <div className='flex'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 ml-5 mr-8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                d="M21 7l-3-3H6L3 7H1v15h22V7h-2zM12 17a4 4 0 100-8 4 4 0 000 8z"
                            />
                        </svg>
                        Your Videos
                    </div>
                </button>
                <button className={Cookies.get('access_token') ? 'w-full py-4 border border-x-0 border-t-1 border-b-0 border-red-100 hover:bg-slate-200' : 'hidden'} onClick={ev => {
                    ev.preventDefault();
                    if (Cookies.get('access_token')) {
                        navigate('/subscriptions');
                    } else {
                        navigate('/signIn');
                    }
                }}>
                    <div className='flex'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="black"
                            className="h-6 w-6 ml-5 mr-8"
                        >
                            <path d="M21.57 7.25c-.22-.82-.86-1.46-1.68-1.68C18.55 5 12 5 12 5s-6.55 0-7.89.57c-.82.22-1.46.86-1.68 1.68C3 8.59 3 12 3 12s0 3.41 .43 4.75c.22 .82 .86 1.46 1.68 1.68C5.45 19 12 19 12 19s6.55 0 7.89-.57c.82-.22 1.46-.86 1.68-1.68C21 15.41 21 12 21 12s0 -3.41-.43-4.75zM10 16V8l6 4-6 4z" />
                        </svg>


                        Subscriptions
                    </div>
                </button>
                <button className='w-full py-4 border border-x-0 border-t-1 border-b-0 border-red-100 hover:bg-slate-200' onClick={ev => { ev.preventDefault(); navigate('/trending'); }}>
                    <div className='flex'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" className='h-6 w-6 ml-5 mr-8' stroke-linejoin="round">
                            <polygon points="5 4 15 12 5 20 5 4" />
                        </svg>
                        Trending
                    </div>
                </button>
            </div>
        </div>
    )
}


export default Sidebar;
