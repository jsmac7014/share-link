import React, { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import dayjs from "dayjs";
import { ToastContainer } from "react-toastify";
import customParseFormat from "dayjs/plugin/customParseFormat";

import GroupDetail from "/imports/ui/components/Group/GroupDetail";
import GroupLinkForm from "/imports/ui/components/Group/GroupLinkForm";
import GroupFilter from "/imports/ui/components/Group/GroupFilter";
import { GroupFilterProvider } from "/imports/ui/context/GroupFilterProvider";

import { useSubscribe } from "meteor/react-meteor-data";
import GroupFilterBottomSheetModal from "/imports/ui/components/Group/GroupFilterBottomSheetModal";

const LinkList = lazy(() => import("/imports/ui/components/Group/LinkList"));

dayjs.extend(customParseFormat);

export default function GroupPage() {
  const { groupId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useSubscribe("links.group.by.domain", groupId);
  useSubscribe("group.detail", groupId);

  const [isFilterBottomSheetOpen, setIsFilterBottomSheetOpen] = useState(false);

  function validateDateParam() {
    const dateString = searchParams.get("date");

    if (!dayjs(dateString, "YYYY-MM-DD", true).isValid()) {
      const today = dayjs().format("YYYY-MM-DD");
      alert("Invalid date format");
      navigate(`/group/${groupId}?date=${today}`);
    }
  }

  useEffect(() => {
    validateDateParam();
  }, [searchParams]);

  return (
    <GroupFilterProvider>
      <div className="grid md:grid-cols-12 gap-2 grid-cols-1">
        <div className="md:flex md:flex-col md:gap-2 md:w-full md:col-span-4 hidden">
          <GroupFilter />
        </div>
        <div className="col-span-8 flex flex-col w-full h-full space-y-2 lg:mt-9">
          <GroupDetail />
          <div className="flex flex-row w-full gap-2">
            <button
              className="md:hidden inline-flex items-center p-2 border rounded-lg text-zinc-500 hover:bg-gray-100 bg-white"
              onClick={() => setIsFilterBottomSheetOpen(true)}
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
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                />
              </svg>
            </button>
            {searchParams.get("date") === dayjs().format("YYYY-MM-DD") && <GroupLinkForm />}
          </div>
          <Suspense
            fallback={
              <div className="flex flex-col w-full h-dvh justify-center items-center">
                <span>Fetching...</span>
              </div>
            }
          >
            <LinkList groupId={groupId!} date={searchParams.get("date")!} />
          </Suspense>
        </div>
        <ToastContainer />
      </div>
      <GroupFilterBottomSheetModal
        isFilterBottomSheetOpen={isFilterBottomSheetOpen}
        setIsFilterBottomSheetOpen={setIsFilterBottomSheetOpen}
      />
    </GroupFilterProvider>
  );
}
