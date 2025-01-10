import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaHome,
  FaFileAlt,
  FaUsers,
  FaCog,
  FaBars, // Hamburger menu icon
} from "react-icons/fa";
import Navbar from "../components/Navbar"; // Assuming Navbar is already created

const ApprovalPage = () => {
  const [selectedFilters, setSelectedFilters] = useState("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const searchBarRef = useRef(null);
  const [selectAll, setSelectAll] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [currentDocumentId, setCurrentDocumentId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const sampleData = [
    { id: 1, name: "Policy Draft", category: "Finance", date: "2025-01-10", status: "PENDING" },
    { id: 2, name: "Education Proposal", category: "Education", date: "2025-01-08", status: "APPROVED" },
    { id: 3, name: "Health Policy Update", category: "Health", date: "2025-01-07", status: "REJECTED" },
    { id: 4, name: "Transport Plan", category: "Transportation", date: "2025-01-09", status: "PENDING" },
  ];

  useEffect(() => {
    const filtered = sampleData.filter(
      (item) =>
        (item.status === selectedFilters || selectAll) &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!selectedCategory || item.category === selectedCategory) &&
        (!startDate || new Date(item.date) >= new Date(startDate)) &&
        (!endDate || new Date(item.date) <= new Date(endDate))
    );
    setFilteredData(filtered);
  }, [selectedFilters, searchQuery, selectAll, selectedCategory, startDate, endDate]);

  const handleAcceptReject = (id, status) => {
    setFilteredData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, status: status } : item
      )
    );
  };

  const handleRemarkSubmit = () => {
    if (remarks && currentDocumentId !== null) {
      setFilteredData((prevData) =>
        prevData.map((item) =>
          item.id === currentDocumentId
            ? { ...item, status: "REMARKS", remark: remarks }
            : item
        )
      );
      setRemarks("");
      setOpenDialog(false);
    }
  };

  const toggleSelectAll = () => {
    setSelectAll((prev) => !prev);
    setSelectedFilters(""); 
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <div className="flex-grow">
        <Navbar role="Personal Assistant - Approval Dashboard" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-2 text-gray-600 rounded-md"
        >
          <FaBars />
        </button>

        {!openDialog && (
          <div ref={searchBarRef} className={`relative w-full max-w-xs mx-auto p-4 ${sidebarOpen ? "z-10" : "z-40"}`}>
            <div className="flex flex-col items-center">
              <FaSearch className="absolute top-8 left-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-md border bg-white border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        <main className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <label className="inline-flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
                className="text-blue-500 border-gray-300 focus:ring-blue-500"
              />
              <span>Select All</span>
            </label>
            {["PENDING", "APPROVED", "REJECTED", "REMARKS"].map((status) => (
              <label key={status} className="inline-flex items-center space-x-2 text-sm">
                <input
                  type="radio"
                  name="statusFilter"
                  value={status}
                  checked={selectedFilters === status && !selectAll}
                  onChange={() => {
                    setSelectAll(false);
                    setSelectedFilters(status);
                  }}
                  className="text-blue-500 border-gray-300 focus:ring-blue-500"
                />
                <span>{status}</span>
              </label>
            ))}
          </div>

          {/* Category and Date Range Picker */}
          <div className="mb-4 flex gap-4">
            <div className="flex-shrink-0">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-fit mt-1 p-2 text-sm border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Transportation">Transportation</option>
              </select>
            </div>

            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700">Date Range</label>
              <div className="flex gap-4">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border bg-white border-gray-300 rounded-md"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border bg-white text-black border-gray-300 rounded-md"
                  min={startDate}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Selected Filters: {selectAll ? "ALL" : selectedFilters}</h3>
            {filteredData.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="text-left border-b">
                  <tr>
                    <th className="py-2">Document Name</th>
                    <th className="py-2">Category</th>
                    <th className="py-2">Date</th>
                    {selectAll && <th className="py-2">Status</th>}
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2">{item.category}</td>
                      <td className="py-2">{item.date}</td>
                      {selectAll && <td className="py-2">{item.status}</td>}
                      <td className="py-2">
                        {item.status === "PENDING" && (
                          <>
                            <button
                              className="text-blue-500 hover:underline mr-2"
                              onClick={() => handleAcceptReject(item.id, "APPROVED")}
                            >
                              Accept
                            </button>
                            <button
                              className="text-red-500 hover:underline"
                              onClick={() => handleAcceptReject(item.id, "REJECTED")}
                            >
                              Reject
                            </button>
                            <button
                              className="text-yellow-500 hover:underline ml-3"
                              onClick={() => {
                                setCurrentDocumentId(item.id);
                                setOpenDialog(true);
                              }}
                            >
                              Add Remark
                            </button>
                          </>
                        )}
                        {item.status === "REMARKS" && (
                          <span className="text-yellow-500">Remarked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No documents found for selected filters.</p>
            )}
          </div>
        </main>
      </div>

      {openDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Add Remark</h3>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2 border bg-white resize-none border-gray-300 rounded-md mb-4"
              rows="4"
              placeholder="Enter remarks..."
            />
            <div className="flex justify-end space-x-4">
              <button
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </button>
              <button
                className="py-2 px-4 bg-blue-500 text-white rounded-md"
                onClick={handleRemarkSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalPage;
