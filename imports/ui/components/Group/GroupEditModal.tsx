import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useNavigate } from "react-router-dom";
import Modal from "/imports/ui/components/Modal";
import { GroupDetail } from "/imports/types/types";

export default function GroupEditModal({
  group,
  onClose,
  isOpen,
}: {
  group: GroupDetail;
  onClose: () => void;
  isOpen: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  async function updateGroup() {
    const groupId = group._id;
    const updatedGroup = {
      name,
      description,
    };

    await Meteor.callAsync("groups.update", groupId, updatedGroup);
    // refresh using react router
    navigate(0);
  }

  useEffect(() => {
    setName(group?.name || "");
    setDescription(group?.description || "");
  }, [group]);

  return (
    <Modal title={"Edit Group"} onClose={onClose} isOpen={isOpen}>
      <div className="flex flex-col space-y-2">
        <label htmlFor="name" className="text-gray-500">
          Group Name
        </label>
        <input
          id="name"
          className="p-2 rounded-lg border"
          type="text"
          defaultValue={name}
          onChange={(event) => setName(event.target.value)}
        />
        <label htmlFor="description" className="text-gray-500">
          Description
        </label>
        <textarea
          id="description"
          className="p-2 rounded-lg border"
          defaultValue={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <button
          className="w-fit bg-blue-500 text-white p-2 rounded-lg self-end"
          onClick={updateGroup}
        >
          Update
        </button>
      </div>
    </Modal>
  );
}
