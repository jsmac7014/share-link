import React, { useState} from 'react'
import Portal from "/imports/ui/components/Portal";
import Modal from "/imports/ui/components/Modal";
import {Link, useSearchParams} from "react-router-dom";
import {useFind, useSubscribe} from "meteor/react-meteor-data";
import {Groups} from "/imports/api/groups/groups";
import {Meteor} from "meteor/meteor";
import dayjs from "dayjs";
import {Helmet} from "react-helmet-async";

export default function Dashboard() {
    const [isOpen, setIsOpen] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");

    useSubscribe("groups");
    const groups = useFind(()=> Groups.find());

    const date = dayjs().format("YYYY-MM-DD");

    const createGroupOnClick = () => {
        // Add your logic to create a new group here
        const obj = {
            name: groupName,
            description: groupDescription,
            owner: Meteor.userId(),
            members: [],
            createdAt: new Date()
        }

        Meteor.call('groups.insert', obj, (error, result) => {
            if (error) {
                console.error("Error creating group:", error);
            } else {
                console.log("Group created successfully:", result);
                setGroupName("");
                setGroupDescription("");
                setIsOpen(false);
            }
        });
    }

    function handleOpenModal() {
        setIsOpen(true);
    }

    function handleCloseModal() {
        console.log("click");
        setIsOpen(false);
    }

    return (
        <div className="w-full space-y-2">
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <h2 className="font-bold text-3xl">Your Groups</h2>
            <ul className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
                {/* create group */}
                <button
                    onClick={handleOpenModal}
                    className="w-full border-2 border-gray-300 border-dotted p-3 rounded-lg flex flex-row items-center gap-2 cursor-pointer text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.379a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Zm-6.75-10.5a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V10.5Z" clipRule="evenodd" />
                    </svg>
                    <span>Create New Group</span>
                </button>
                {groups?.map(group => (
                    <Link to={"/group/" + group._id + "?date=" + date} key={group._id}>
                        <li key={group._id} className="w-full bg-white border p-3 rounded-lg flex flex-col h-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"/>
                            </svg>
                            <h3 className="text-md">{group.name}</h3>
                            <p className="text-sm">{group.description}</p>
                        </li>
                    </Link>
                ))}
            </ul>
            {isOpen && (
                <Portal>
                    <Modal onClose={handleCloseModal} title={"Create Group"}>
                        <div className="flex flex-col space-y-2">
                            <input className="border border-gray-300 p-2 rounded-lg" type="text" placeholder="Group Name" onChange={(e) => setGroupName(e.target.value)}/>
                            <textarea className="border border-gray-300 p-2 rounded-lg" placeholder="Group Description" onChange={(e) => setGroupDescription(e.target.value)}/>
                            <button onClick={createGroupOnClick} className="p-2 rounded-lg bg-blue-500 text-white">
                                Create Group
                            </button>
                        </div>
                    </Modal>
                </Portal>
            )}
        </div>

    )
}
