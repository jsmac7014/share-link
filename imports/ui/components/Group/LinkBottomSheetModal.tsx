import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { toast } from "react-toastify";
import { useFind, useSubscribe } from "meteor/react-meteor-data";
import BottomSheetModal from "/imports/ui/components/BottomSheetModal";
import { LinkWithUserInfo } from "/imports/types/types";
import { LinkComments } from "/imports/api/link-comments/link-comments";

export default function LinkBottomSheetModal({
  selectedLink,
  groupId,
  isOpen,
  setIsOpen,
}: {
  selectedLink: LinkWithUserInfo | null;
  groupId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [comment, setComment] = useState<string>("");

  try {
    useSubscribe("linkComments", selectedLink?._id, groupId);
  } catch (error) {
    console.error("Error subscribing to links:", error);
  }

  const comments = useFind(() => {
    return LinkComments.find({ linkId: selectedLink?._id }, { sort: { createdAt: -1 } });
  }, [selectedLink]);

  async function addComment() {
    if (!comment) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      await Meteor.callAsync("insert.linkComment", selectedLink?._id, groupId, comment);
      toast.success("Comment added!", { autoClose: 500 });
      setComment("");
    } catch (error) {
      toast.error(error?.toString(), { autoClose: 500 });
    }
  }

  return (
    <BottomSheetModal title={""} isOpen={isOpen} onClose={() => setIsOpen(false)}>
      {selectedLink && (
        <div className="flex flex-col w-full h-full gap-1">
          <img className="rounded-lg" src={selectedLink.imageLink} alt="" />
          <div className="flex flex-col gap-1">
            <a
              className="text-sm font-bold text-blue-500 hover:text-blue-700 transition duration-200 ease-in-out whitespace-nowrap overflow-hidden  text-ellipsis"
              href={selectedLink.url}
              target="_blank"
              rel="noreferrer"
            >
              {selectedLink.url}
            </a>
            <div>
              <h3 className="text-lg font-bold">{selectedLink.title}</h3>
              <p className="text-gray-500 text-sm">@{selectedLink.userInfo?.username}</p>
            </div>
            <p className="text-sm">{selectedLink.description}</p>
            <p className="text-gray-500 text-xs">
              {new Date(selectedLink.createdAt).toLocaleDateString()}{" "}
              {new Date(selectedLink.createdAt).toLocaleTimeString()}
            </p>
          </div>
          {/* comments section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Comments</h3>
            {/* list of comments */}
            <ul className="flex flex-col gap-2 overflow-y-scroll max-h-52">
              {comments.map((comment) => (
                <li
                  key={comment._id?.toString()}
                  className="flex flex-col gap-1 border-b border-gray-200 pb-2"
                >
                  <p className="text-gray-500 text-xs">@{comment.userInfo?.username}</p>
                  <div>
                    <p className="text-sm">{comment.text}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(comment.createdAt).toLocaleDateString()}{" "}
                      {new Date(comment.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-20 border border-gray-200 rounded-lg p-2"
                placeholder="Add a comment..."
              ></textarea>
              <button className="bg-blue-500 text-white rounded-lg p-2" onClick={addComment}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </BottomSheetModal>
  );
}
