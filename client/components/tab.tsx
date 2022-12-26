type Props = {
   type: string;
   setType: (type: string) => void;
}

export const Tab = ({type, setType} : Props)=> {
    const handleTabRoute=(tab: string)=>{
     setType(tab);
    }
	return (
    <div className="flex justify-around py-8 w-[400px] mx-auto">
      <p
        className={`tab ${type === "pending" ? "selected_tab" : ""}`}
        onClick={() => handleTabRoute("pending")}
      >
        History
      </p>
      <p
        className={`tab ${type === "active" ? "selected_tab" : ""}`}
        onClick={() => handleTabRoute("active")}
      >
        Ongoing
      </p>
      <p
        className={`tab ${type === "rejected" ? "selected_tab" : ""}`}
        onClick={() => handleTabRoute("rejected")}
      >
        Rejected
      </p>
    </div>
	);
}

export default Tab;