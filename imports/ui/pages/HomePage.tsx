import React from 'react';
import {Helmet} from 'react-helmet-async';
import {Link} from "react-router-dom";

export default function HomePage() {
    return (
        <>
            <Helmet>
                <title>Linkly</title>
                <meta name="description" content="Add & Share your links!"/>
            </Helmet>
            <div className="container w-full mx-auto min-h-dvh py-12 px-8 space-y-6">
                <img src="/landing-macbook-ss.png" alt="Home" className="w-full max-w-3xl object-scale-down mx-auto"/>
                <div className="flex flex-col text-center space-y-4">
                    <div className="inline-flex w-full justify-center items-center">
                        <img src="/icon-512.png" alt="Logo" className="w-8 h-8"/>
                        <h6 className="text-xl font-bold text-blue-500">Linkly</h6>
                    </div>
                    <h1 className="text-5xl font-bold mb-4 text-zinc-800 underline underline-offset-8 decoration-blue-500  decoration-wavy">
                        Add & Share your links!
                    </h1>
                    <p className="text-lg text-gray-700 mb-8">
                        Make a group with your friends and share links to your favorite content. <br/>
                        Create a group, add your friends and start sharing links!
                        <br/>
                    </p>
                    <Link to="/sign-in">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                            Get Started
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
}
