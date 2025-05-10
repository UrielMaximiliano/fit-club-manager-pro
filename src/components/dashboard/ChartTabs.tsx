
import React from 'react';

interface TabOption {
  label: string;
  value: string;
}

interface ChartTabsProps {
  tabs: TabOption[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ChartTabs: React.FC<ChartTabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex mb-4 border-b border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`px-4 py-2 text-sm font-medium -mb-px ${
            activeTab === tab.value
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ChartTabs;
