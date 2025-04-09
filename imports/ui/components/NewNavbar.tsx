import React from "react";
import { useUser } from "meteor/react-meteor-accounts";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";

export default function NewNavbar() {
  const user = useUser();

  return (
    <div className="flex justify-between items-center w-full max-w-5xl mx-auto ">
      <div className="flex items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-500">
          Linkly
        </Link>
      </div>
      <div className="flex items-center">
        {user ? (
          <div className="inline-flex items-center gap-2">
            <Link
              to="/profile"
              className="bg-white rounded-lg border p-2 font-semibold text-gray-700"
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
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </Link>
            <button
              className="p-2 bg-white border rounded-lg hover:bg-gray-50"
              onClick={() => Meteor.logout()}
              title="logout"
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
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
