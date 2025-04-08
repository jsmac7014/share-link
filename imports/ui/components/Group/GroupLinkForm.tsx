import React, {useState} from "react";
import {Meteor} from "meteor/meteor";
import {toast} from "react-toastify";
import {useParams} from "react-router-dom";

export default function GroupLinkForm() {
    const [link, setLink] = useState("");
    const {groupId} = useParams();

    async function addLink() {
        try {
            await Meteor.callAsync("insert.link", {link, groupId});
            toast.success("Link added successfully");
        } catch (error) {
            console.error("Error adding link:", error);
            toast.error("Failed to add link");
        }
        setLink("");
    }

    return (
        <div className="w-full flex flex-row gap-1 flex-wrap">
            <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                type="text"
                placeholder="Enter link"
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 outline-none"/>
            <button
                className="p-2 bg-blue-500 rounded-lg text-white w-full outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                onClick={addLink}>Add
            </button>
        </div>
    )
}