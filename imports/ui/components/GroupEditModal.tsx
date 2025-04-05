import React, {useState} from "react";
import {Meteor} from "meteor/meteor";
import {useNavigate} from "react-router-dom";
import Modal from "/imports/ui/components/Modal";
import {Group} from "/imports/types/types";

export default function GroupEditModal({group, onClose}: { group: Group, onClose: () => void }) {
    const [name, setName] = useState(group.name);
    const [description, setDescription] = useState(group.description);
    const navigate = useNavigate();

    async function updateGroup() {
        const groupId = group._id;
        const updatedGroup = {
            name, description
        };

        await Meteor.callAsync("groups.update", groupId, updatedGroup);
        onClose();
        // refresh using react router
        navigate(0);

    }

    return (
        <Modal title={"Edit Group"} onClose={onClose}>
            <div className="flex flex-col space-y-2">
                <label htmlFor="name" className="text-gray-500">Group Name</label>
                <input id="name" className="p-2 rounded border" type="text" defaultValue={name}
                       onChange={(event) => setName(event.target.value)}/>
                <label htmlFor="description" className="text-gray-500">Description</label>
                <textarea id="description" className="p-2 rounded border" defaultValue={description}
                          onChange={(event) => setDescription(event.target.value)}/>
                <button className="w-fit bg-blue-500 text-white p-2 rounded self-end" onClick={updateGroup}>Update
                </button>
            </div>
        </Modal>
    )
}