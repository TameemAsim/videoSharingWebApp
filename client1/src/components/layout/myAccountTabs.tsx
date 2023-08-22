import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { user, userVideos } from "../../recoil/atoms";
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import Axios, { AxiosError } from "axios";
import { VideoCard } from "../common/cards";


export default function MyAccountTabs() {
    const [userLoggedIn, setUserLoggedIn] = useRecoilState(user);
    const [userLoggedInVideos, setUserLoggedInVideos] = useRecoilState(userVideos);
    const [profileActivated, setProfileActivated] = useState<boolean>(true);
    const [myChannelActivated, setMyChannelActivated] = useState<boolean>(false);
    const [settingsActivated, setSettingsActivated] = useState<boolean>(false);
    const [profileEdit, setProfileEdit] = useState<boolean>(false);
    const [progress, setProgress] = useState<string>("0%");
    const [profilePhoto, setProfilePhoto] = useState<boolean>(false);
    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
    const [profileData, setProfileData] = useState({
        username: userLoggedIn.username,
        email: userLoggedIn.email
    });
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log(userLoggedInVideos);
    }, [userLoggedInVideos])

    // Tabs and thier common functions
    const tabs_functions = {
        profileFunction: (ev: React.MouseEvent) => {
            ev.preventDefault();
            setAllDivs(true, false, false);

        },
        myChannelFunction: (ev: React.MouseEvent) => {
            ev.preventDefault();
            setAllDivs(false, true, false);

        },
        settingsFunction: (ev: React.MouseEvent) => {
            ev.preventDefault();
            setAllDivs(false, false, true);

        }
    }

    // Change Tabs State
    function setAllDivs(first: boolean, second: boolean, third: boolean) {
        setProfileActivated(first);
        setMyChannelActivated(second);
        setSettingsActivated(third);
    }

    // Change Profile Photo
    async function uploadProfilePhoto() {

        if (!profilePhotoFile) {
            alert("Please upload an image first!");
            return;
        }

        const storageRef = ref(storage, `/files/${profilePhotoFile.name}`);
        console.log(storageRef);

        // progress can be paused and resumed. It also exposes progress updates.
        // Receives the storage reference and the file to upload.
        const uploadTask = uploadBytesResumable(storageRef, profilePhotoFile);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                // update progress
                setProgress(percent + '%');
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);
                    if (!(userLoggedIn.img === 'defaultAvatar.png')) {
                        const fileNameForDeletion = userLoggedIn.imgName;
                        const desertRef = ref(storage, `files/${fileNameForDeletion}`);
                        deleteObject(desertRef).then(() => {
                            console.log('file deleted Successfully');
                        }).catch(err => { console.log(err.message) });
                    }


                    Axios.put(`/users/${userLoggedIn._id}`, { img: url, imgName: profilePhotoFile.name }, { withCredentials: true })
                        .then(response => {
                            const user = response.data
                            delete user.password;
                            setUserLoggedIn(user);
                            setProfilePhoto(false);
                            setProgress(0 + '%')
                        })
                        .catch(err => {
                            alert('An error Occured, ' + err.message);
                        });
                });
            }
        );

    }

    async function handleUpdateProfileData() {
        try {
            console.log('Profile data sent: ' + profileData);

            const response = await Axios.put(`/users/${userLoggedIn._id}`, profileData, { withCredentials: true });
            if (response) {
                const user = response.data;
                delete user.password;
                setUserLoggedIn(user);
            }
        } catch (err) {
            if (Axios.isAxiosError(err)) {
                if (err.response) {
                    setUserLoggedIn(prevValue => ({ ...prevValue }));
                    alert(err.response.data.message);
                } else if (err.request) {
                    alert('Request failed. Please try again later.');
                } else {
                    alert('An error occurred. Please try again later: ' + err.message);
                }
            } else {
                alert('An unknown error occurred.');
            }
        }
    }


    // Profile Tab Screen
    const profileScreen = (
        <div className={`${profileActivated ? 'w-[90%] mx-auto my-3 s shadow-xl shadow-gray-300 rounded-lg py-2' : 'hidden'}`}>
            <img className="mx-auto z-0 rounded-full mt-2 mb-3 h-28 w-28" src={userLoggedIn.img} alt="Profile-Img" />
            <div className="flex justify-center mx-auto mb-1 ">
                <button className="rounded-md p-1 w-[160px] bg-gray-200 text-red-400 hover:bg-red-500 hover:text-white mb-2" onClick={ev => {
                    ev.preventDefault();
                    setProfilePhoto(!profilePhoto);
                }}>
                    {profilePhoto ? "Cancel" : "Change Profile Photo"}
                </button>
                <input type="file" className={profilePhoto ? '' : 'hidden'} onChange={ev => { ev.preventDefault(); (ev.target.files && setProfilePhotoFile(ev.target.files[0])) }} />
                <button className={profilePhoto ? 'w-[90px] pb-1 bg-red-500 text-white rounded-md' : 'hidden'} onClick={ev => { ev.preventDefault(); uploadProfilePhoto(); }} >Upload</button>
                <h1 className={profilePhoto ? "text-lg font-semibold" : 'hidden'}>{progress}</h1>
            </div>
            <div className="flex w-full justify-center my-3">
                <h3 className="font-mono text-lg">{userLoggedIn.subscribers} Subscribers</h3>
            </div>
            <div className="flex w-full justify-center my-3">
                <button className="w-24 h-7 pb-2 hover:bg-orange-500 hover:text-white rounded-lg text-lg font-semibold text-orange-500 border border-orange-500 mr-2" onClick={ev => { ev.preventDefault(); setProfileEdit(true); }}>Edit</button>
                <button className="w-24 h-7 pb-2 hover:bg-blue-500 hover:text-white rounded-lg text-lg font-semibold text-blue-500 border border-blue-500" onClick={ev => { ev.preventDefault(); setProfileEdit(false); handleUpdateProfileData(); }}>Save</button>
            </div>
            <div className="flex w-full justify-center mb-3">
                <form>
                    <div data-username="username" className="flex sm:block md:flex my-2">
                        <h4 className="sm:text-sm md:text-xl font-semibold">Username:&nbsp;&nbsp;&nbsp;&nbsp;</h4>
                        <input type="text" className="focus:outline-none sm:w-[210px] md:w-[400px] border-b border-black sm:text-sm md:text-xl" defaultValue={userLoggedIn.username} readOnly={!profileEdit} onChange={ev => { ev.preventDefault(); setProfileData({ ...profileData, username: ev.target.value }) }} />
                    </div>
                    <div data-username="email" className="flex sm:block md:flex my-2">
                        <h4 className="sm:text-sm md:text-xl font-semibold">Email:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h4>
                        <input type="text" className="focus:outline-none sm:w-[210px] md:w-[400px] border-b border-black sm:text-sm md:text-xl" defaultValue={userLoggedIn.email} readOnly={!profileEdit} onChange={ev => { ev.preventDefault(); setProfileData({ ...profileData, email: ev.target.value }) }} />
                    </div>
                </form>
            </div>

        </div>
    )


    const myChannelScreen = (
        <div className={`${myChannelActivated ? 'w-[90%] mx-auto my-3 s shadow-xl shadow-gray-300 rounded-lg py-2' : 'hidden'}`}>
            <div data-username="Upload Video Button" className="flex justify-center align-middle my-4">
                <button className="w-[150px] rounded-lg text-lg font-semibold border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-1" onClick={ev => {
                    ev.preventDefault();
                    navigate('/uploadVideo')
                }}>Upload Video</button>
            </div>
            <h1 className={userLoggedInVideos.length === 0 ? "text-xl font-medium text-gray-400 mx-auto" : "hidden"}>No Video Found</h1>
            <div className={userLoggedInVideos.length === 0 ? 'hidden' : 'flex flex-wrap justify-center'}>
                {userLoggedInVideos.map((video, index) => {
                    return <div className='text-black border border-white rounded-lg mt-1 sm:w-[90%] sm:space-x-0 sm:mx-auto md:w-[50%] md:border-2 md:mx-0 lg:w-[33.33%] lg:border-2 cursor-pointer' key={index} >
                        <VideoCard video={video} />
                        <div className="w-full flex justify-center">
                            <button className="w-[100px] rounded-lg text-lg font-semibold border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-1 mr-1" onClick={ev => { ev.preventDefault(); navigate(`/updateVideo/${video._id}`); }} >Update</button>
                            <button className="w-[100px] rounded-lg text-lg font-semibold border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-1" onClick={ev => {
                                ev.preventDefault();
                                console.log('Video Delete Id in My Account' + video._id);
                                navigate(`/deleteVideo/${video._id}`);
                            }} >Delete</button>
                        </div>
                    </div>
                })}
            </div>
        </div>
    )

    const settingsScreen = (
        <div className={`${settingsActivated ? 'w-[90%] mx-auto my-3 s shadow-xl shadow-gray-300 rounded-lg py-2' : 'hidden'}`}>
            <div className="flex w-full justify-center mb-3">
                <form>
                    <div data-username="password" className="flex sm:block md:flex my-2">
                        <h4 className="sm:text-sm md:text-xl font-semibold">Password:&nbsp;</h4>
                        <input type="text" className="focus:outline-none sm:w-[190px] md:w-[400px] border-b border-black sm:text-sm md:text-xl" placeholder="Add New Password" onChange={ev => {
                            ev.preventDefault();
                            setNewPassword(ev.target.value);
                        }} />
                    </div>
                    <div data-username="Change Password Button" className="flex my-2 justify-center">
                        <button className="w-44 h-7 pb-2 bg-orange-500 text-white rounded-lg sm:text-md md:text-lg font-semibold hover:text-orange-500 hover:border hover:border-orange-500 hover:bg-white mr-2" onClick={ev => {
                            ev.preventDefault();
                            Axios.put(`/users/changePassword/${userLoggedIn._id}`, { password: newPassword }, { withCredentials: true })
                                .then(response => {
                                    if (response.data === 'Password Successfully Changed') {
                                        alert(response.data);
                                    } else {
                                        alert('Error Occured: ' + response.data.message);
                                    }
                                })
                                .catch(err => {
                                    alert('Error Occured: ' + err.message);
                                });
                        }}>
                            Save New Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )


    return (
        <div>
            <div className="flex flex-row">
                <div className={`basis-1/3 flex justify-center align-middle border-2 cursor-pointer border-white ${profileActivated ? 'bg-red-500 text-white' : 'bg-red-200 text-black hover:bg-red-300 sm:rounded-xl md:rounded-lg'} h-12`} onClick={tabs_functions.profileFunction}>
                    <h1 className="font-semibold sm:text-md md:text-lg mt-[6px]">Profile</h1>
                </div>
                <div className={`basis-1/3 flex justify-center align-middle border-2 cursor-pointer border-white ${myChannelActivated ? 'bg-red-500 text-white' : 'bg-red-200 text-black hover:bg-red-300 sm:rounded-xl md:rounded-lg'} h-12`} onClick={tabs_functions.myChannelFunction}>
                    <h1 className="font-semibold sm:text-md md:text-lg mt-[6px]">My Channel</h1>
                </div>
                <div className={`basis-1/3 flex justify-center align-middle border-2 cursor-pointer border-white ${settingsActivated ? 'bg-red-500 text-white' : 'bg-red-200 text-black hover:bg-red-300 sm:rounded-xl md:rounded-lg'} h-12`} onClick={tabs_functions.settingsFunction}>
                    <h1 className="font-semibold sm:text-md md:text-lg mt-[6px]">Settings</h1>
                </div>
            </div>
            <div className="w-screen">
                {profileScreen}
                {myChannelScreen}
                {settingsScreen}
            </div>
        </div>
    )
}
