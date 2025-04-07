import React from 'react';
import {Meteor} from "meteor/meteor";
import {useFind, useSubscribe} from "meteor/react-meteor-data";
import {Links} from "/imports/api/links/links";


export default function LinkList({groupId, date}: { groupId: string, date: string }) {
    // Get Timezone of the user
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
        useSubscribe("links", groupId, date, timezone);
    } catch (error) {
        console.error("Error subscribing to links:", error);
    }

    const links = useFind(() => Links.find({groupId: groupId}, {sort: {createdAt: -1}}));

    async function deleteLink(linkId: string | undefined) {
        await Meteor.callAsync("delete.link", linkId);
    }

    if (!links || links.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <div className="inline-flex gap-1 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/>
                    </svg>
                    <span className="text-gray-500">No links found.</span>
                </div>
            </div>
        );
    }

    return (
        <ul className="flex flex-col w-full gap-1">
            {links.map((link) => (
                    <li key={link._id?.toString()}>
                        <div className="relative">
                            <button className="absolute top-2 right-2 p-1 rounded"
                                    onClick={() => deleteLink(link._id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                                <div
                                    className="flex bg-white w-full h-full p-2 gap-2 border border-gray-300 rounded min-h-32">
                                    {link.imageLink && (
                                        <img src={link.imageLink} className="w-32 object-cover rounded"
                                             alt={link.title}/>
                                    )}
                                    <div className="w-full flex flex-col min-h-full justify-between">
                                        <div className="w-11/12">
                                            <h3 className="text-lg font-bold line-clamp-2">{link.title}</h3>
                                            <p className="line-clamp-2">{link.description}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 place-self-end text-xs">{new Date(link.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </li>
                )
            )}
        </ul>
    );
}