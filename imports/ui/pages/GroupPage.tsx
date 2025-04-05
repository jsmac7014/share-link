import React, {lazy, Suspense, useEffect, useState} from "react";
import {Meteor} from "meteor/meteor";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import type {Group} from "/imports/types/types";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Calendar from 'react-calendar';
import '../styles/calendar.css';

const LinkList = lazy(() => import("/imports/ui/components/LinkList"));

dayjs.extend(customParseFormat);

export default function GroupPage() {
    const [group, setGroup] = useState<Group>();
    const [isOwner, setIsOwner] = useState(false);
    const [link, setLink] = useState("");
    const [isCalendarOpen,] = useState(false);

    const {groupId} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    async function fetchGroup() {
        const data = await Meteor.callAsync("groups.get", groupId);
        if (!data) {
            console.error("No data received");
            return;
        }
        setGroup(data)
        setIsOwner(data.owner === Meteor.userId());
    }

    async function addLink() {
        await Meteor.callAsync("insert.link", {link, groupId});
        setLink("");
    }

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

    function handleDateInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const date = event.target.value;
        if (dayjs(date, "YYYY-MM-DD", true).isValid()) {
            setSearchParams({date});
        } else {
            alert("Invalid date format");
        }
    }

    useEffect(() => {
        fetchGroup();
    }, []);

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
                <div className="relative space-y-3 bg-white rounded p-4 border">
                    <div className="md:hidden">
                        <input value={searchParams.get("date")?.toString()} type="date" className="p-2 border rounded"
                               onChange={handleDateInputChange}/>
                    </div>
                    <h1 className="text-3xl font-bold">
                        {group?.name}
                    </h1>
                    <p className="text-gray-500">{group?.description}</p>
                    <div className="absolute top-0 right-3">
                        <button className="inline-flex items-center p-2 border rounded text-zinc-500 hover:bg-gray-100 bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                {(isOwner && searchParams.get("date") === dayjs().format("YYYY-MM-DD") &&
                    <div className="w-full flex flex-row gap-1 flex-wrap">
                        <input
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            type="text"
                            placeholder="Enter link"
                            className="flex-1 p-2 border border-gray-300 rounded"/>
                        <button className="min-w-32 p-2 bg-blue-500 rounded text-white" onClick={addLink}>Add</button>
                    </div>)}
                <Suspense
                    fallback={<div className="flex flex-col w-full h-dvh justify-center items-center">
                        <span>Fetching...</span>
                    </div>}>
                    <LinkList groupId={groupId!} date={searchParams.get("date")!}/>
                </Suspense>
            </div>
        </div>
    );
}