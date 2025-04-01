import React, {useEffect, useState} from 'react'
import {useSubscribe, useTracker} from "meteor/react-meteor-data";
import {Groups} from "/imports/api/groups/groups";
import Portal from "/imports/ui/components/Portal";
import Modal from "/imports/ui/components/Modal";

export default function Dashboard() {
    const [groups, setGroups] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        Meteor.call('groups.getUserGroups', Meteor.userId(), (error, result) => {
            if (error) {
                console.error("Error fetching groups:", error);
            } else {
                console.log("User groups:", result);
                setGroups(result);
            }
        });
    }, []);

    const createGroupOnClick = () => {
        console.log("Create group button clicked");
        // Add your logic to create a new group here
        const obj = {
            name: 'Test Group',
            description: 'This is a test group',
            owner: Meteor.userId(),
            members: [Meteor.userId()],
            createdAt: new Date()
        }

        Meteor.call('groups.insert', obj, (error, result) => {
            if (error) {
                console.error("Error creating group:", error);
            } else {
                console.log("Group created successfully:", result);
            }
        });
    }

    function handleOpenModal() {
        console.log("click");
        setIsOpen(true);
    }

    function handleCloseModal() {
        console.log("click");
        setIsOpen(false);
    }

    return (
        <div>
            <h2>Your Groups</h2>
            <ul className="border border-blue-500">
                {groups?.map(group => (
                    <li key={group._id}>
                        <h3>{group.name}</h3>
                        <p>{group.description}</p>
                    </li>
                ))}
            </ul>
            <button onClick={handleOpenModal} className="p-2 rounded bg-blue-500 text-white">
                Create New Group
            </button>
            {isOpen && (
                <Portal>
                    <Modal onClose={handleCloseModal}>
                        Hello
                    </Modal>
                </Portal>
            )}
        </div>

    )
}
