import React, { useContext, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useFind, useSubscribe } from "meteor/react-meteor-data";
import { LinksWithUserInfo } from "/imports/api/client/linksWithUserInfo";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import { GroupFilterContext } from "/imports/ui/context/GroupFilterProvider";
import { LinkWithUserInfo } from "/imports/types/types";
import LinkBottomSheetModal from "/imports/ui/components/Group/LinkBottomSheetModal";

export default function LinkList({ groupId, date }: { groupId: string; date: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<LinkWithUserInfo | null>(null);
  // Get Timezone of the user
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  try {
    useSubscribe("links.with.userInfo", groupId, date, timezone);
  } catch (error) {
    console.error("Error subscribing to links:", error);
  }

  const { checkedDomain } = useContext(GroupFilterContext);

  const links = useFind(() => {
    const regex = new RegExp(
      checkedDomain.map((domain) => domain.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")).join("|"),
    );
    return LinksWithUserInfo.find({ url: { $regex: regex } }, { sort: { createdAt: -1 } });
  }, [checkedDomain]);

  // async function deleteLink(linkId: string | undefined) {
  //   try {
  //     await Meteor.callAsync("delete.link", linkId);
  //     toast.success("Link deleted!");
  //   } catch (error) {
  //     toast.error(error?.toString());
  //   }
  // }

  if (!links || links.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 1 } }}
        transition={{ type: "tween", duration: 0.2 }}
        className="w-full h-96 flex flex-col items-center justify-center p-4"
      >
        <div className="h-full inline-flex gap-1 items-center">
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
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <span className="text-gray-500">No links found.</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <motion.ul
        className="flex flex-col w-full gap-1"
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 1 } }}
      >
        {links.map((link) => (
          <motion.li
            key={link._id?.toString()}
            className="w-full"
            layoutId={link._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            transition={{ type: "tween", duration: 0.2 }}
            onClick={() => {
              setSelectedLink(link);
              setIsOpen(true);
            }}
          >
            <div className="w-full cursor-pointer">
              <div className="bg-white w-full h-full border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200 ease-in-out">
                <div className="w-full flex flex-col gap-2 overflow-hidden p-2">
                  {link.imageLink && (
                    <img
                      src={link.imageLink}
                      className="object-cover rounded-lg"
                      alt={link.title}
                    />
                  )}
                  <div className="flex flex-col">
                    <p className="text-gray-500 text-xs">@{link.userInfo?.username}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(link.createdAt).toLocaleDateString()}{" "}
                      {new Date(link.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="h-full flex flex-col justify-between">
                    <div className="flex flex-col">
                      <h3 className="md:text-md text-sm font-bold line-clamp-2">{link.title}</h3>
                      <p className="truncate text-sm">{link.description}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col"></div>
            </div>
          </motion.li>
        ))}
      </motion.ul>
      {selectedLink && (
        <LinkBottomSheetModal
          selectedLink={selectedLink}
          groupId={groupId}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
}
