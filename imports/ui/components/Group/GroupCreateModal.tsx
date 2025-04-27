import React, { useState } from "react";
import Modal from "/imports/ui/components/Modal";
import Checkbox from "/imports/ui/components/Checkbox";
import { Meteor } from "meteor/meteor";
import { Group } from "/imports/types/types";
import { useUser } from "meteor/react-meteor-accounts";

type GroupCreateFormErrors = {
  name?: string;
  description?: string;
  [key: string]: string | undefined;
};

export default function GroupCreateModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [, setIsPinModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const [formErrors, setFormErrors] = useState<GroupCreateFormErrors>({
    name: "",
    description: "",
  });
  // When creating new group
  const [hiddenChecked, setHiddenChecked] = useState(false);
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const user = useUser();

  async function createGroup(obj: Group) {
    try {
      await Meteor.callAsync("insert.group", obj);
      handleCloseCreateGroupModal();
      handleClosePinModal();
    } catch (error: unknown) {
      if (error instanceof Meteor.Error) {
        const parsedErrors: { name: string; message: string }[] = JSON.parse(error.details!);
        const errorMap: GroupCreateFormErrors = {};
        parsedErrors.forEach(({ name, message }) => {
          errorMap[name] = message;
        });
        console.log(errorMap);
        setFormErrors(errorMap);
      }
    }
  }

  const handleCreateGroup = () => {
    const obj: Group = {
      name: groupName,
      description: groupDescription,
      owner: user?._id,
      members: [],
      createdAt: new Date(),
      hidden: hiddenChecked,
      ...(hiddenChecked && { pin: pin }),
    };

    createGroup(obj);
  };

  function handleCloseCreateGroupModal() {
    setGroupName("");
    setGroupDescription("");
    setHiddenChecked(false);
    setFormErrors({});
    onClose();
  }

  function handleClosePinModal() {
    setPin(["", "", "", ""]);
    setGroupName("");
    setGroupDescription("");
    setHiddenChecked(false);
    setIsPinModalOpen(false);
  }

  return (
    <>
      <Modal onClose={handleCloseCreateGroupModal} title={"Create Group"} isOpen={isOpen}>
        <div className="flex flex-col space-y-2">
          <input
            className="border  border-gray-200 p-2 rounded-lg"
            type="text"
            placeholder="Group Name"
            onChange={(e) => setGroupName(e.target.value)}
          />
          {formErrors["name"] && <span className="text-red-500">{formErrors["name"]}</span>}
          <textarea
            className="border  border-gray-200 p-2 rounded-lg"
            placeholder="Group Description"
            onChange={(e) => setGroupDescription(e.target.value)}
          />
          {formErrors["name"] && <span className="text-red-500">{formErrors["description"]}</span>}
          <Checkbox
            label="Set as hidden group"
            onChange={setHiddenChecked}
            checked={hiddenChecked}
          />
          <div className="self-end flex gap-2">
            <button
              onClick={handleCloseCreateGroupModal}
              className="px-6 py-2 rounded-lg bg-white text-zinc-800 border border-gray-200"
            >
              Close
            </button>
            <button
              onClick={handleCreateGroup}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
