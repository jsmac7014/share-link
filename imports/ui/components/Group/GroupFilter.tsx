import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSearchParams } from "react-router-dom";

import dayjs from "dayjs";
import Calendar from "react-calendar";
import "../../styles/calendar.css";
import GroupFilterDomain from "/imports/ui/components/Group/GroupFilterDomain";

export default function GroupFilter() {
  const [isOpen, setIsOpen] = useState(true);

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
            <GroupFilterDomain />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
