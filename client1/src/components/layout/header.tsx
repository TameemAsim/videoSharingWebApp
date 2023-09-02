import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { searchForMobile, sideBarEnabled, searchInput } from '../../recoil/atoms';
import Sidebar from './sidebar';
import * as Icons from '../common/svgIcons';
import * as Buttons from '../common/buttons';
import Cookies from 'js-cookie';


export default function Header() {
    const navigate = useNavigate();
    const [sideBar, setSideBar] = useRecoilState(sideBarEnabled);
    const [searchEnabledForMobile, setSearchEnabledForMobile] = useRecoilState(searchForMobile);
    const [SearchInput, setSearchInput] = useRecoilState(searchInput);


    return (
        <div>
        <h1 className="text-center text-white bg-black text-md font-mono">Open for contribution: <a className="text-red-500 underline" href="https://github.com/18feb06/videoSharingWebApp">Click Here</a></h1>
            {/* tablet & laptop */}
            <div className='flex flex-row sm:hidden md:flex'>
                <Sidebar />
                <div className='basis-1/4 flex flex-row justify-start'>


                    {/* Menu Button */}
                    {!sideBar && <Buttons.IconButton onClick={ev => {
                        ev.preventDefault();
                        setSideBar(!sideBar);
                    }} content={<Icons.MenuIcon />} description={'Menu'} />}


                    {/* brand Button */}
                    <Buttons.BrandButton onClick={ev => {
                        ev.preventDefault();
                        navigate('/');
                    }} content={'Tam Tube'} />
                </div>
                <div className='basis-2/4'>


                    {/* Search Bar */}
                    <div className='border border-black rounded-2xl my-[12px] flex overflow-hidden'>
                        <input
                            type='search'
                            className='flex-grow focus:outline-none p-1 text-base rounded-2xl'
                            placeholder='Search Here'
                            value={SearchInput}
                            onChange={ev => { ev.preventDefault(); setSearchInput(ev.target.value); }}
                        />
                        {/* search bar search button button */}
                        <button className='flex bg-slate-200 p-1 w-[10%] justify-center hover:bg-red-500 hover:text-white' onClick={ev => {
                            if(SearchInput === ''){
                                ev.preventDefault();
                            }else {
                                ev.preventDefault();
                                navigate(`/resistSearchError/${SearchInput}`);
                            }
                            }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 18h4M21 21l-6-6M3 9a6 6 0 1112 0c0 2.761-2.686 5-6 5s-6-2.239-6-5 2.686-5 6-5c1.542 0 2.963 .578 4.049 1.534"
                                />
                            </svg>
                        </button>
                    </div>


                </div>
                <div className='basis-1/4'>
                    <div className='flex justify-end'>


                        {/* Upload Video Button */}
                        <Buttons.IconButton onClick={ev => {
                            ev.preventDefault();
                            if (Cookies.get('access_token')) {
                                navigate('/uploadVideo');
                            } else {
                                alert('Kindly Login to upload Video...');
                            }
                        }} content={<Icons.UploadVideoIcon />} description={'Upload Video'} />


                        {/* Account Button */}
                        <Buttons.AccountButton contentIfSignedIn={<Icons.AccountIcon />} contentIfSignedOut={'Sign In'} description={'Account'} onClick={ev => {
                            ev.preventDefault();
                            if (Cookies.get('access_token')) {
                                navigate('/account');
                            } else {
                                navigate('/signIn');
                            }
                        }} />
                    </div>
                </div>
            </div>


            {/* MOBILE */}


            {/* mobile while search is not enabled */}
            <div className={searchEnabledForMobile ? 'hidden' : 'flex flex-row md:hidden'}>
                <div className='basis-2/5 flex'>
                    <Sidebar />


                    {/* Menu Mobile Button */}
                    {!sideBar && <Buttons.IconButton onClick={ev => {
                        ev.preventDefault();
                        setSideBar(!sideBar);
                    }} content={<Icons.MenuIcon />} description={'Menu'} />}


                    {/* Brand Mobile Button */}
                    <Buttons.BrandButton onClick={ev => { ev.preventDefault(); navigate('/') }} content={'Tam Tube'} />
                </div>
                <div className='basis-3/5 flex justify-end'>


                    {/* Search Mobile Button */}
                    <Buttons.IconButton onClick={ev => { ev.preventDefault(); setSearchEnabledForMobile(true); }} content={<Icons.SearchIcon />} description={'Search'} />


                    {/* Upload Video Mobile Button*/}
                    <Buttons.IconButton onClick={ev => {
                        ev.preventDefault();
                        if (Cookies.get('access_token')) {
                            navigate('/uploadVideo');
                        } else {
                            alert('Kindly Login to upload Video...');
                        }
                    }} content={<Icons.UploadVideoIcon />} description={'Upload Video'} />


                    {/* Account Mobile Button */}
                    <Buttons.AccountButton contentIfSignedIn={<Icons.AccountIcon />} contentIfSignedOut={'Sign In'} description={'Account'} onClick={ev => {
                        ev.preventDefault();
                        if (Cookies.get('access_token')) {
                            navigate('/account');
                        } else {
                            navigate('/signIn');
                        }
                    }} />
                </div>
            </div>
            {/* mobile while search is enabled */}
            <div className={searchEnabledForMobile ? 'border border-black rounded-2xl my-[12px] flex overflow-hidden sm:flex md:hidden' : 'hidden'}>


                {/* Mobile Search Back Icon */}
                <button className='flex-grow bg-red-500 p-1 justify-center text-white' onClick={ev => {
                    ev.preventDefault();
                    setSearchEnabledForMobile(false);
                }}>
                    <Icons.BackSearchIcon />
                </button>


                {/* Mobile Search Query Input Place */}
                <input
                    type='search'
                    className='focus:outline-none p-1 text-base w-[80%] rounded-2xl'
                    placeholder='Search Here'
                    value={SearchInput}
                    onChange={ev => { ev.preventDefault(); setSearchInput(ev.target.value); }}
                />


                {/* Mobile Search Submit Button */}
                <button className='flex bg-red-500 p-1 w-[10%] justify-center text-white' onClick={ev => {
                    if (SearchInput === '') {
                        ev.preventDefault();
                    } else {
                        ev.preventDefault();
                        navigate(`/resistSearchError/${SearchInput}`);
                        setSearchEnabledForMobile(false);
                    }
                }}>
                    <Icons.SearchIcon />
                </button>
            </div>
        </div>
    )
};
