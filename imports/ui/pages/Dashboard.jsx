import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { Link, useSearchParams } from "react-router-dom";
import { useFind, useSubscribe } from "meteor/react-meteor-data";
import { Groups } from "/imports/api/groups/groups";
import dayjs from "dayjs";
import { Helmet } from "react-helmet-async";
import GroupCreateModal from "/imports/ui/components/Group/GroupCreateModal";
import { requestForToken } from "/imports/firebase-config";

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  useSubscribe("groups", searchParams.get("t"));
  const groups = useFind(() => Groups.find());

  const date = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    if (!searchParams.has("t")) {
      setSearchParams({ t: "owned" });
    }
  }, []);

  // FCM 토큰 요청
  useEffect(() => {
    requestForToken()
      .then((currentToken) => {
        if (currentToken) {
          console.log("FCM 토큰: ", currentToken);
          Meteor.call("save.fcm.token", currentToken); // 서버에 저장
        } else {
          console.log("FCM 토큰을 받을 수 없습니다.");
        }
      })
      .catch((err) => {
        console.log("FCM 토큰 발급 오류: ", err);
      });
  }, []);

  return (
    <div className="w-full space-y-2">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      {/*tabs*/}
      <div className="w-full flex flex-row gap-2">
        <Link
          to={"/dashboard?t=owned"}
          className={
            searchParams.get("t") === "owned"
              ? "p-2 min-w-14 rounded-full bg-blue-500 text-white text-sm"
              : "p-2 min-w-14 rounded-full  text-zinc-800 text-sm"
          }
        >
          Owned
        </Link>
        <Link
          to={"/dashboard?t=invited"}
          className={
            searchParams.get("t") === "invited"
              ? "p-2 min-w-14 rounded-full bg-blue-500 text-white text-sm"
              : "p-2 min-w-14 rounded-full  text-zinc-800 text-sm"
          }
        >
          Invited
        </Link>
        <Link
          to={"/dashboard?t=hidden"}
          className={
            searchParams.get("t") === "hidden"
              ? "p-2 min-w-14 rounded-full bg-blue-500 text-white text-sm"
              : "p-2 min-w-14 rounded-full  text-zinc-500 text-sm"
          }
        >
          Hidden
        </Link>
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
      <GroupCreateModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
      />
    </div>
  );
}
