import React, { lazy, Suspense, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import dayjs from "dayjs";
import { ToastContainer } from "react-toastify";
import customParseFormat from "dayjs/plugin/customParseFormat";

import GroupDetail from "/imports/ui/components/Group/GroupDetail";
import GroupLinkForm from "/imports/ui/components/Group/GroupLinkForm";
import GroupFilter from "/imports/ui/components/Group/GroupFilter";

const LinkList = lazy(() => import("/imports/ui/components/Group/LinkList"));

dayjs.extend(customParseFormat);

export default function GroupPage() {
  const { groupId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
    <div className="grid md:grid-cols-12 gap-2 grid-cols-1">
      <div className="md:flex md:flex-col md:gap-2 md:w-full md:col-span-4 hidden">
        <GroupFilter />
      </div>
      <div className="col-span-8 flex flex-col w-full h-full space-y-2 lg:mt-9">
        <GroupDetail />
        {searchParams.get("date") === dayjs().format("YYYY-MM-DD") && <GroupLinkForm />}
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
  );
}
