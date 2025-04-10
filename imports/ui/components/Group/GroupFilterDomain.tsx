import React, { useContext } from "react";
import { useFind } from "meteor/react-meteor-data";

import { GroupFilterContext } from "/imports/ui/context/GroupFilterProvider";
import { LinksByDomain } from "/imports/api/client/linksByDomain";

export default function GroupFilterDomain() {
  const domains = useFind(() => LinksByDomain.find());

  const { checkedDomain, toggleDomainCheckbox, clearCheckedDomain } =
    useContext(GroupFilterContext);
  return (
    <div>
      <div className="flex flex-row justify-between mb-2">
        <div className="flex flex-col">
          <h6 className="text-sm font-semibold text-zinc-700">Websites</h6>
          <span className="text-xs text-zinc-500">Scroll down a bit</span>
        </div>
        <button
          className="text-sm border rounded-lg p-1 border-gray-200 hover:bg-gray-100 transition-all duration-200"
          onClick={clearCheckedDomain}
        >
          Clear
        </button>
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
              <input
                type="checkbox"
                className="appearance-none bg-white inset-shadow-sm inset-shadow-gray-300 checked:bg-zinc-800 w-4 h-4 rounded-md"
                checked={checkedDomain.includes(domain._id)}
                onChange={() => toggleDomainCheckbox(domain._id)}
              />
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
    </div>
  );
}
