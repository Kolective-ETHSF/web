import { useEffect, useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { History, MousePointerClick, TrainFront, UserRound, Wallet } from "lucide-react";
import DashboardMainWallet from "./DashboardMainWallet";
import DashboardAIWallet from "./DashboardAIWallet";
import DashboardOverview from "./DashboardOverview";
import DashboardHistory from "./DashboardHistory";
import DashboardPositions from "./DashboardPositions";

const tabKeys = ["overview", "positions", "history", "main", "ai"];

export default function DashboardComponent() {
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (tabKeys.includes(hash)) {
      setSelectedTab(hash);
    }
  }, []);

  const handleTabChange = (key: "overview" | "positions" | "history" | "main" | "ai") => {
    setSelectedTab(key);
    window.location.hash = key;
  };

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        color="warning"
        variant="bordered"
        selectedKey={selectedTab}
        onSelectionChange={(key) => handleTabChange(key as "overview" | "positions" | "history" | "main" | "ai")} // ✅ Perbaikan disini
      >
        <Tab
          key="overview"
          title={
            <div className="flex items-center space-x-2">
              <UserRound />
              <span>Overview</span>
            </div>
          }
        >
          <DashboardOverview />
        </Tab>
        <Tab
          key="positions"
          title={
            <div className="flex items-center space-x-2">
              <MousePointerClick />
              <span>Positions</span>
            </div>
          }
        >
          <DashboardPositions />
        </Tab>
        <Tab
          key="history"
          title={
            <div className="flex items-center space-x-2">
              <History />
              <span>History</span>
            </div>
          }
        >
          <DashboardHistory />
        </Tab>
        <Tab
          key="main"
          title={
            <div className="flex items-center space-x-2">
              <Wallet />
              <span>Main Wallet</span>
            </div>
          }
        >
          <DashboardMainWallet />
        </Tab>
        <Tab
          key="ai"
          title={
            <div className="flex items-center space-x-2">
              <TrainFront />
              <span>AI Wallet</span>
            </div>
          }
        >
          <DashboardAIWallet />
        </Tab>
      </Tabs>
    </div>
  );
}
