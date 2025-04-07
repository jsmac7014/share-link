import React, {lazy, Suspense, useEffect, useState} from "react";
import {Meteor} from "meteor/meteor";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import type {Group} from "/imports/types/types";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Calendar from 'react-calendar';
import '../styles/calendar.css';
import GroupEditModal from "/imports/ui/components/GroupEditModal";
import { ToastContainer, toast } from 'react-toastify';

const LinkList = lazy(() => import("/imports/ui/components/LinkList"));

dayjs.extend(customParseFormat);

export default function GroupPage() {
    const [group, setGroup] = useState<Group>();
    const [isOwner, setIsOwner] = useState(false);
    const [link, setLink] = useState("");
    const [isCalendarOpen,] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
        try {
            await Meteor.callAsync("insert.link", {link, groupId});
        } catch (error) {
            console.error("Error adding link:", error);
            toast.error("Failed to add link");
        }
        setLink("");
    }

    async function createInvite() {
        try {
            const inviteURL = await Meteor.callAsync("insert.invite", groupId);
            await navigator.clipboard.writeText(inviteURL);
            toast("Invite link created successfully", {type: "success"});
        } catch (error) {
            console.error("Error creating invite:", error);
            toast.error("Failed to create invite link");
        }
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
                    <div className="inline-flex gap-2">
                        <button
                            title="Edit group"
                            className="inline-flex items-center p-2 border rounded text-zinc-500 hover:bg-gray-100 bg-white"
                            onClick={() => setIsEditModalOpen(!isEditModalOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                            </svg>
                        </button>
                        {/* Create invitation link */}
                        <button className="p-2 border rounded text-zinc-500 hover:bg-gray-100 bg-white" title="Create invitation link" onClick={createInvite}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/>
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
            {isEditModalOpen && (
                <GroupEditModal group={group!} onClose={() => setIsEditModalOpen(false)}/>
            )}
            <ToastContainer />
        </div>
    );
}