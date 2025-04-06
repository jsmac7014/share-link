import React from "react";
import {useUser} from "meteor/react-meteor-accounts";

export default function ProfilePage() {
    const user = useUser();

    return (
        <div>
            <div className="bg-white p-8 rounded border ">
                <h1 className="text-3xl font-bold">Profile</h1>
                <form className="flex flex-col space-y-2">
                    <label htmlFor="username" className="text-gray-500">Username</label>
                    <input id="username" className="p-2 rounded border" type="text" value={user?.username}/>
                    <label htmlFor="email" className="text-gray-500">Email</label>
                    <input id="email" className="p-2 rounded border" type="email" value={user?.emails?.[0]?.address}/>
                    <label htmlFor="name" className="text-gray-500">Name</label>
                    <input id="name" className="p-2 rounded border" type="text" value={user?.profile?.name}/>
                    <label htmlFor="password" className="text-gray-500">Change Password</label>
                    <input id="password" className="p-2 rounded border" type="password" placeholder="********"/>
                    <button type="submit" className="w-fit bg-blue-500 text-white p-2 rounded self-end">Update</button>
                </form>
            </div>
            <div className="bg-white p-3 rounded border mt-4">
                <h1 className="text-3xl font-bold"></h1>
                <div className="flex flex-col space-y-2">
                    {/* Add group list here */}

                </div>
            </div>
        </div>
    );
}