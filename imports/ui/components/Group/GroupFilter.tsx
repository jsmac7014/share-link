import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useFind, useSubscribe } from "meteor/react-meteor-data";
import { useParams, useSearchParams } from "react-router-dom";

import dayjs from "dayjs";
import Calendar from "react-calendar";
import "../../styles/calendar.css";

import { LinksByDomain } from "/imports/api/client/linksByDomain";

export default function GroupFilter() {
  const [isOpen, setIsOpen] = useState(true);
  const { groupId } = useParams();

  useSubscribe("links.group.by.domain", groupId);
  const domains = useFind(() => LinksByDomain.find());
  const [searchParams, setSearchParams] = useSearchParams();
  function changeDate(date: Date) {
    date.setDate(date.getDate() + 1);
    setSearchParams({ date: date.toISOString().split("T")[0] });
  }

  return (
    <motion.div className="flex flex-col gap-2">
      <h3
        className="text-lg font-semibold text-zinc-800 cursor-pointer inline-flex items-center gap-1"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <motion.svg
          initial={{ rotate: 0 }}
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </motion.svg>
        Filter
      </h3>
      <AnimatePresence mode="wait" initial={false}>
        {isOpen && (
          <motion.div
            key="wrapper"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100%" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut", delay: 0.2 }}
            className="bg-white p-3 rounded-lg space-y-2 shadow-sm border border-gray-200"
          >
            <div className="flex flex-col">
              <h6 className="text-sm font-semibold text-zinc-700">Dates</h6>
              <span className="text-xs text-zinc-500">Select date</span>
            </div>
            <Calendar
              onClickDay={(date) => changeDate(date)}
              className="w-full h-fit border-none"
              selectRange={false}
              value={
                dayjs(searchParams.get("date"), "YYYY-MM-DD", true).isValid()
                  ? dayjs(searchParams.get("date")).toDate()
                  : dayjs().format("YYYY-MM-DD")
              }
            />
            <div className="flex flex-col">
              <h6 className="text-sm font-semibold text-zinc-700">Websites</h6>
              <span className="text-xs text-zinc-500">Scroll down a bit</span>
            </div>
            <div className="overflow-scroll h-48 border rounded-lg p-2">
              <div className="flex flex-col gap-2 h-full ">
                {/* groups of websites */}
                {domains.map((domain, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-2 items-center justify-between bg-zinc-100 p-2 rounded-lg"
                  >
                    <div className="flex flex-row gap-2">
                      <span className="text-sm font-semibold text-zinc-800">{domain._id}</span>
                      <span className="text-sm font-semibold text-zinc-800">({domain.count})</span>
                    </div>
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                ))}
                {/*  if domain list is empty */}
                {domains.length === 0 && (
                  <div className="flex flex-col w-full h-full justify-center items-center">
                    <span className="text-sm font-semibold text-zinc-500">No domains found</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
