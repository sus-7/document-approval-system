import React, { useState } from "react";
import { BsPlus, BsPersonCircle } from "react-icons/bs";
import Navbar from "./Navbar";

const ApprovalPage = () => {
  const [selectedTab, setSelectedTab] = useState("APPROVED");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white to-blue-100">
      {/* Navbar */}
      <Navbar role="Approver" />

      {/* Main Content */}
      <div className="flex items-center mt-3 h-auto justify-center flex-grow">
        <div className="w-[90%] max-w-[80vh] bg-white shadow-lg border border-gray-200 rounded-lg h-[90vh]">
          {/* Tabs */}
          <div className="tabs flex justify-around items-center text-sm text-gray-700 mt-2 border-b border-gray-200">
            {[
              "APPROVED",
              "REJECTED",
              "REMARK",
              "PENDING"
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 font-medium rounded-md ${
                  selectedTab === tab
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="content p-4">
            {selectedTab === "APPROVED" && <div>Approved Content</div>}
            {selectedTab === "REJECTED" && <div>Rejected Content</div>}
            {selectedTab === "REMARK" && <div>Remark Content</div>}
            {selectedTab === "PENDING" && <div>Pending Content</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalPage;
