import Modal from "/imports/ui/components/Modal";
import Checkbox from "/imports/ui/components/Checkbox";
import React, { useRef, useState } from "react";
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
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const [formErrors, setFormErrors] = useState<GroupCreateFormErrors>({
    name: "",
    description: "",
  });
  // When creating new group
  const [hiddenChecked, setHiddenChecked] = useState(false);
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
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

  function handleContinue() {
    if (hiddenChecked) {
      onClose();
      setIsPinModalOpen(true);
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

  function handlePinInputChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
    //   if input move to next input
    const value = event.target.value;
    if (!/^[1-9]$/.test(value)) return;
    // 상태 업데이트
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (inputRefs.current[index + 1]) inputRefs.current[index + 1]?.focus();
  }

  function handlePinInputKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key === "Backspace") {
      // if pin is set on that index do not move focus
      const newPin = [...pin];
      if (newPin[index] === "") {
        inputRefs.current[index - 1]?.focus();
      }
      newPin[index] = "";
      setPin(newPin);
    }
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
            {hiddenChecked ? (
              <button
                onClick={handleContinue}
                className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleCreateGroup}
                className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
              >
                Create
              </button>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        onClose={handleClosePinModal}
        isOpen={isPinModalOpen}
        title={"Set PIN for hidden group"}
      >
        <div className="w-full max-w-xl mx-auto flex flex-col space-y-2">
          <div className="flex w-full h-full gap-2">
            <input
              className="flex-1 rounded-lg border border-gray-200 text-xl lg:text-3xl text-center aspect-square"
              type="number"
              inputMode="numeric"
              min={1}
              max={9}
              placeholder="1"
              value={pin[0]}
              ref={(el) => {
                inputRefs.current[0] = el;
              }}
              onChange={(event) => handlePinInputChange(event, 0)}
              onKeyDown={(event) => handlePinInputKeyDown(event, 0)}
            />
            <input
              className="flex-1 rounded-lg border border-gray-200 text-xl lg:text-3xl text-center aspect-square"
              type="number"
              inputMode="numeric"
              min={1}
              max={9}
              value={pin[1]}
              placeholder="2"
              ref={(el) => {
                inputRefs.current[1] = el;
              }}
              onChange={(event) => handlePinInputChange(event, 1)}
              onKeyDown={(event) => handlePinInputKeyDown(event, 1)}
            />
            <input
              className="flex-1 rounded-lg border border-gray-200 text-xl lg:text-3xl text-center aspect-square"
              type="number"
              inputMode="numeric"
              min={1}
              max={9}
              placeholder="3"
              value={pin[2]}
              ref={(el) => {
                inputRefs.current[2] = el;
              }}
              onChange={(event) => handlePinInputChange(event, 2)}
              onKeyDown={(event) => handlePinInputKeyDown(event, 2)}
            />
            <input
              className="flex-1 rounded-lg border border-gray-200 text-xl lg:text-3xl text-center aspect-square"
              type="number"
              inputMode="numeric"
              min={1}
              max={9}
              value={pin[3]}
              placeholder="4"
              ref={(el) => {
                inputRefs.current[3] = el;
              }}
              onChange={(event) => handlePinInputChange(event, 3)}
              onKeyDown={(event) => handlePinInputKeyDown(event, 3)}
            />
          </div>
          <div className="self-end flex gap-2">
            <button
              onClick={handleClosePinModal}
              className="px-6 py-2 rounded-lg bg-white text-zinc-800 border border-gray-200"
            >
              Close
            </button>
            <button
              onClick={handleCreateGroup}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
