import React from "react";
import {useUser} from "meteor/react-meteor-accounts";
import {Link} from "react-router-dom";

export default function NewNavbar() {
    const user = useUser();

    // @ts-ignore
    const name = user ? user.profile?.name : "";
    const username = user ? user.username : "";

    return (
        <div className="flex justify-between items-center w-full max-w-5xl mx-auto ">
            <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold text-blue-500">
                    Linkly
                </Link>
            </div>
            <div className="flex items-center">
                {user ? (
                    <>
                        <Link to="/profile" className="underline font-semibold text-gray-700">
                            {name || username}
                        </Link>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    )

}