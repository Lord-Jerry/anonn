import { useRouter } from "next/router";
import { useState } from "react";

export default function Tab() {
  const [tab, setTab] = useState("ongoing");
    const handleTabRoute=(tab: string)=>{
     setTab(tab);
    }
	return (
    <div className="flex justify-around py-8 w-[400px] mx-auto">
      <p
        className={`tab ${tab === "history" ? "selected_tab" : ""}`}
        onClick={() => handleTabRoute("history")}
      >
        History
      </p>
      <p
        className={`tab ${tab === "ongoing" ? "selected_tab" : ""}`}
        onClick={() => handleTabRoute("ongoing")}
      >
        Ongoing
      </p>
      <p
        className={`tab ${tab === "rejected" ? "selected_tab" : ""}`}
        onClick={() => handleTabRoute("rejected")}
      >
        Rejected
      </p>
    </div>
	);
}