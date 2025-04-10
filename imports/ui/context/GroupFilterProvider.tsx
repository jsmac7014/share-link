import React, { createContext, useState } from "react";

type GroupFilterContextType = {
  checkedDomain: string[];
  toggleDomainCheckbox: (domain: string) => void;
  clearCheckedDomain: () => void;
};

export const GroupFilterContext = createContext<GroupFilterContextType>({
  checkedDomain: [],
  toggleDomainCheckbox: () => {},
  clearCheckedDomain: () => {},
});

export const GroupFilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkedDomain, setCheckedDomain] = useState<string[]>([]);
  const toggleDomainCheckbox = (domain: string) => {
    setCheckedDomain((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain],
    );
  };

  const clearCheckedDomain = () => {
    setCheckedDomain([]);
  };

  const value = {
    checkedDomain,
    toggleDomainCheckbox,
    clearCheckedDomain,
  };

  return <GroupFilterContext.Provider value={value}>{children}</GroupFilterContext.Provider>;
};
