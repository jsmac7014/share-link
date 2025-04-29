import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { toast } from "react-toastify";
import GroupEditModal from "/imports/ui/components/Group/GroupEditModal";

import { useFind } from "meteor/react-meteor-data";
import { GroupDetail as GroupDetailCollection } from "/imports/api/client/groupDetail";

export default function GroupDetail() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const group = useFind(() => GroupDetailCollection.find())[0];

  const userId = Meteor.userId();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [inviteURL, setInviteURL] = useState("");

  const handleInviteBtnClick = async () => {
    if (!inviteURL) {
      const url = await Meteor.callAsync("insert.invite", groupId);
      setInviteURL(url);
      toast.info("Invite link create!\n Tap again to copy to clipboard ");
    } else {
      try {
        await navigator.clipboard.writeText(inviteURL);
        toast.success("Invite link copied!");
      } catch (err) {
        toast.error("Copy failed" + err);
      }
    }
  };

  async function handleLeaveGroup() {
    try {
      await Meteor.callAsync("groups.leave", groupId, Meteor.userId());
      return navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to leave group");
    }
  }

  return (
    <div className="relative space-y-3 bg-white rounded-lg p-4 border shadow-sm">
      <div>
        <h1 className="text-3xl font-bold">{group?.name}</h1>
        <p className="text-gray-500">{group?.description}</p>
        <div className="flex flex-row gap-2">
          {/*number of members*/}
          {/*  owner name  */}
          <p className="text-gray-500 text-sm">@{group?.ownerInfo.username}</p>
          {group?.members != null && group?.members?.length > 0 && (
            <p className="text-gray-500 text-sm">{group?.members?.length} members</p>
          )}
        </div>
      </div>
      {group?.ownerInfo._id == userId ? (
        <div className="inline-flex gap-2">
          <button
            title="Edit group"
            className="inline-flex items-center p-2 border rounded-lg text-zinc-500 hover:bg-gray-100 bg-white"
            onClick={() => setIsEditModalOpen(!isEditModalOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
          {/* Create invitation link */}
          <button
            className="p-2 border rounded-lg text-zinc-500 hover:bg-gray-100 bg-white"
            title="Create invitation link"
            onClick={handleInviteBtnClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div className="inline-flex">
          <button
            className="p-2 border rounded-lg text-zinc-500 hover:bg-gray-100 bg-white inline-flex gap-1 items-center"
            onClick={handleLeaveGroup}
          >
            <span className="text-sm">Leave group</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
              />
            </svg>
          </button>
        </div>
      )}
      <GroupEditModal
        group={group!}
        onClose={() => setIsEditModalOpen(false)}
        isOpen={isEditModalOpen}
      />
    </div>
  );
}
