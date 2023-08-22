import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
    usernameInputFunction: (ev: React.ChangeEvent<HTMLInputElement>) => void,
    emailInputFunction?: (ev: React.ChangeEvent<HTMLInputElement>) => void,
    passwordInputFunction: (ev: React.ChangeEvent<HTMLInputElement>) => void,
    handleSignUp: (ev: React.MouseEvent) => void
}

export default function SignUpComponent({ usernameInputFunction, emailInputFunction, passwordInputFunction, handleSignUp }: Props) {
    return (
    <div className="flex justify-center h-screen bg-gray-100">
        <div className=" my-auto sm:w-[400px] md:w-[450px] h-[450px] bg-white shadow-xl shadow-gray-300 rounded-xl px-8 py-4">
            <h1 className="sm:text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl mt-2 mb-6">Sign Up & Create Your Account</h1>
            <form className="sm:w-[336px] md:w-[386px]">
                <h3 className="text-md font-semibold mb-1 pl-1">
                    Your Username
                </h3>
                <input type="text" name="username" className="border-2 border-black rounded-md w-[100%] py-2 pl-1 focus:outline-none mb-2" placeholder="user1111" onChange={usernameInputFunction} />
                <h3 className="text-md font-semibold mb-1 pl-1">
                    Your Email
                </h3>
                <input type="email" name="email" className="border-2 border-black rounded-md w-[100%] py-2 pl-1 focus:outline-none mb-2" placeholder="you@yourmail.com" onChange={emailInputFunction} />
                <h3 className="text-md font-semibold mb-1 pl-1">
                    Your Password
                </h3>
                <input type="password" name="password" className="border-2 border-black rounded-md w-[100%] py-2 pl-1 focus:outline-none mb-2" placeholder="Abc123#" onChange={passwordInputFunction} />
                <h3 className='text-sm font-medium text-red-400 pl-1 mb-1'>Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character</h3>
                <div className="w-full text-center my-3">
                    <button className="w-full bg-red-500 text-white hover:bg-red-600  rounded-md py-1 text-lg font-semibold" onClick={handleSignUp}>
                        SignUp
                    </button>
                </div>
                <div className="flex w-full">
                    <p>Already have an account?</p>
                    <Link className='text-red-500 ml-1 hover:underline font-semibold' to={'/signIn'}>SignIn</Link>
                </div>
            </form>
        </div>
    </div>
    )
}