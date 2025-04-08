import React from "react";
import {Link} from "react-router-dom";
import {useUser} from "meteor/react-meteor-accounts";

export default function NotFoundPage() {
    const user = useUser();

    return (
        <div className="min-h-dvh flex flex-col items-center justify-center gap-2">
            <div className="text-zinc-800 inline-flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="size-10">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
                </svg>
                <h1 className="text-3xl">404 - Page Not Found</h1>
            </div>
            <p>The page you are looking for does not exist.</p>
            {user && (
                <p className="text-gray-500">
                    You can go back to the <Link to="/dashboard" className="text-blue-500">dashboard</Link>.
                </p>
            )}
            <Link to="/" className="p-2 rounded border border-gray-200 bg-white">
                Go back to homepage
            </Link>
        </div>
    );
}