import React, { useEffect, useRef, useState } from "react";
import Modal from "/imports/ui/components/Modal";
import { Link } from "react-router-dom";
import { useFind, useSubscribe } from "meteor/react-meteor-data";
import { Groups } from "/imports/api/groups/groups";
import { Meteor } from "meteor/meteor";
import dayjs from "dayjs";
import { Helmet } from "react-helmet-async";
import Checkbox from "/imports/ui/components/Checkbox";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  // When creating new group
  const [hiddenChecked, setHiddenChecked] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = useRef();

  useSubscribe("groups", currentTab);
  const groups = useFind(() => Groups.find());

  const date = dayjs().format("YYYY-MM-DD");

  const handleCreateGroup = () => {
    const obj = {
      name: groupName,
      description: groupDescription,
      owner: Meteor.userId(),
      members: [],
      createdAt: new Date(),
      hidden: hiddenChecked,
      ...(hiddenChecked && { pin: pin }),
    };

    createGroup(obj);
  };

  function handleContinue() {
    if (hiddenChecked) {
      setIsCreateGroupModalOpen(false);
      setIsPinModalOpen(true);
    }
  }

  // function ifPinIsEmpty() {
  //   return pin.every((digit) => digit === "");
  // }

  async function createGroup(obj) {
    try {
      await Meteor.call("insert.group", obj);
      handleCloseCreateGroupModal();
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Error creating group:", error);
    }
  }

  function handleCloseCreateGroupModal() {
    setGroupName("");
    setGroupDescription("");
    setHiddenChecked(false);
    setIsCreateGroupModalOpen(false);
  }

  function handleClosePinModal() {
    setPin(["", "", "", ""]);
    setGroupName("");
    setGroupDescription("");
    setHiddenChecked(false);
    setIsPinModalOpen(false);
  }

  function handlePinInputChange(event, index) {
    //   if input move to next input
    const value = event.target.value;
    if (!/^[1-9]$/.test(value)) return;
    // 상태 업데이트
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (inputRefs[index + 1]) inputRefs[index + 1].focus();
  }

  function handlePinInputKeyDown(event, index) {
    if (event.key === "Backspace") {
      // if pin is set on that index do not move focus
      const newPin = [...pin];
      if (newPin[index] === "") {
        inputRefs[index - 1]?.focus();
      }
      newPin[index] = "";
      setPin(newPin);
    }
  }

  return (
    <div className="w-full space-y-2">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      {/*tabs*/}
      <div className="w-full flex flex-row gap-2">
        <button
          className={
            currentTab === "all"
              ? "p-2 min-w-14 rounded-full bg-blue-500 text-white text-sm"
              : "p-2 min-w-14 rounded-full  text-zinc-800 text-sm"
          }
          onClick={() => setCurrentTab("all")}
        >
          All
        </button>
        <button
          className={
            currentTab === "owned"
              ? "p-2 min-w-14 rounded-full bg-blue-500 text-white text-sm"
              : "p-2 min-w-14 rounded-full  text-zinc-800 text-sm"
          }
          onClick={() => setCurrentTab("owned")}
        >
          Owned
        </button>
        <button
          className={
            currentTab === "invited"
              ? "p-2 min-w-14 rounded-full bg-blue-500 text-white text-sm"
              : "p-2 min-w-14 rounded-full  text-zinc-800 text-sm"
          }
          onClick={() => setCurrentTab("invited")}
        >
          Invited
        </button>
        <button
          className={
            currentTab === "hidden"
              ? "p-2 min-w-14 rounded-full bg-blue-500 text-white text-sm"
              : "p-2 min-w-14 rounded-full  text-zinc-500 text-sm"
          }
          onClick={() => setCurrentTab("hidden")}
        >
          Hidden
        </button>
      </div>
      <ul className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
        {/* create group */}
        <button
          onClick={() => setIsCreateGroupModalOpen(true)}
          className="w-full min-h-24 border-2 border-gray-200  border-dotted p-3 rounded-lg flex flex-row items-center gap-2 cursor-pointer text-gray-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.379a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Zm-6.75-10.5a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V10.5Z"
              clipRule="evenodd"
            />
          </svg>
          <span>Create New Group</span>
        </button>
        {groups?.map((group) => (
          <Link to={"/group/" + group._id + "?date=" + date} key={group._id}>
            <li
              key={group._id}
              className="w-full bg-white border p-3 rounded-lg flex flex-col h-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                />
              </svg>
              <h3 className="text-md">{group.name}</h3>
              <p className="text-sm">{group.description}</p>
            </li>
          </Link>
        ))}
      </ul>

      <Modal
        onClose={handleCloseCreateGroupModal}
        title={"Create Group"}
        isOpen={isCreateGroupModalOpen}
      >
        <div className="flex flex-col space-y-2">
          <input
            className="border  border-gray-200 p-2 rounded-lg"
            type="text"
            placeholder="Group Name"
            onChange={(e) => setGroupName(e.target.value)}
          />
          <textarea
            className="border  border-gray-200 p-2 rounded-lg"
            placeholder="Group Description"
            onChange={(e) => setGroupDescription(e.target.value)}
          />
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
              ref={(el) => (inputRefs[0] = el)}
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
              ref={(el) => (inputRefs[1] = el)}
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
              ref={(el) => (inputRefs[2] = el)}
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
                inputRefs[3] = el;
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
    </div>
  );
}
