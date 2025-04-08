import React, {lazy, Suspense, useEffect, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Calendar from 'react-calendar';
import '../styles/calendar.css';
import GroupDetail from "/imports/ui/components/Group/GroupDetail";
import GroupLinkForm from "/imports/ui/components/Group/GroupLinkForm";
import {ToastContainer} from "react-toastify";

const LinkList = lazy(() => import("/imports/ui/components/Group/LinkList"));

dayjs.extend(customParseFormat);

export default function GroupPage() {
    // const [link, setLink] = useState("");
    const [isCalendarOpen,] = useState(false);

    const {groupId} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();



    function changeDate(date: Date) {
        date.setDate(date.getDate() + 1);
        setSearchParams({date: date.toISOString().split("T")[0]});
    }

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
            <div className={`md:block md:col-span-4 ${isCalendarOpen ? "block" : "hidden"}`}>
                <Calendar
                    onClickDay={(date) => changeDate(date)}
                    className="w-full h-fit"
                    selectRange={false}
                    value={dayjs(searchParams.get("date"), "YYYY-MM-DD", true).isValid()
                        ? dayjs(searchParams.get("date")).toDate()
                        : dayjs().format("YYYY-MM-DD")}
                />
            </div>
            <div className="col-span-8 flex flex-col w-full h-full space-y-2">
                <GroupDetail/>
                {searchParams.get("date") === dayjs().format("YYYY-MM-DD") && (
                    <GroupLinkForm />
                )}
                <Suspense
                    fallback={<div className="flex flex-col w-full h-dvh justify-center items-center">
                        <span>Fetching...</span>
                    </div>}>
                    <LinkList groupId={groupId!} date={searchParams.get("date")!}/>
                </Suspense>
            </div>
            <ToastContainer/>
        </div>
    );
}