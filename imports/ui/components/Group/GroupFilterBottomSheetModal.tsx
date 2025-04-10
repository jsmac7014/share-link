import React from "react";
import { useSearchParams } from "react-router-dom";
import BottomSheetModal from "/imports/ui/components/BottomSheetModal";
import GroupFilterDomain from "/imports/ui/components/Group/GroupFilterDomain";
import dayjs from "dayjs";

export default function GroupFilterBottomSheetModal({
  isFilterBottomSheetOpen,
  setIsFilterBottomSheetOpen,
}: {
  isFilterBottomSheetOpen: boolean;
  setIsFilterBottomSheetOpen: (isOpen: boolean) => void;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleDateInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const date = event.target.value;
    if (dayjs(date, "YYYY-MM-DD", true).isValid()) {
      setSearchParams({ date });
    } else {
      alert("Invalid date format");
    }
  }

  return (
    <BottomSheetModal
      isOpen={isFilterBottomSheetOpen}
      onClose={() => setIsFilterBottomSheetOpen(false)}
      title="Filter"
    >
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-col gap-1">
          <label htmlFor={"date"} className="text-sm font-semibold text-zinc-70">
            Dates
          </label>
          <input
            value={searchParams.get("date")?.toString()}
            type="date"
            className="p-2 border rounded-lg"
            onChange={handleDateInputChange}
          />
        </div>
        <GroupFilterDomain />
      </div>
    </BottomSheetModal>
  );
}
