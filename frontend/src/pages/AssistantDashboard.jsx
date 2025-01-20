import React, { useState, useEffect } from "react";
import { FaSearch, FaBars } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const AssistantDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [currentDocumentId, setCurrentDocumentId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newDocDialogOpen, setNewDocDialogOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocDepartment, setNewDocDepartment] = useState("");
  const [newDocFile, setNewDocFile] = useState(null);
  const [newDocDesc, setNewDocDesc] = useState("");

  const sampleData = [
    { id: 1, name: "Policy Draft", category: "Finance", date: "2025-01-10", status: "PENDING" },
    { id: 2, name: "Education Proposal", category: "Education", date: "2025-01-08", status: "APPROVED" },
    { id: 3, name: "Health Policy Update", category: "Health", date: "2025-01-07", status: "REJECTED" },
    { id: 4, name: "Transport Plan", category: "Transportation", date: "2025-01-09", status: "PENDING" },
  ];

  useEffect(() => {
    const filtered = sampleData.filter(
      (item) =>
        (item.status === selectedTab || selectedTab === "ALL") &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!selectedCategory || item.category === selectedCategory) &&
        (!startDate || new Date(item.date) >= new Date(startDate)) &&
        (!endDate || new Date(item.date) <= new Date(endDate))
    );
    setFilteredData(filtered);
  }, [selectedTab, searchQuery, selectedCategory, startDate, endDate]);

  const handleAcceptReject = (id, status) => {
    setFilteredData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, status } : item))
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

  const handleNewDocSubmit = () => {
    // Handle new document submission logic here
    setNewDocDialogOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <Navbar role="Personal Assistant - Approval Dashboard" />
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden p-2 text-gray-600 rounded-md"
      >
        <FaBars />
      </button>

      <main className="p-6 flex-grow">
        <div className="flex flex-wrap gap-4 mb-6 border-b">
          {["ALL", "PENDING", "APPROVED", "REJECTED", "REMARKS"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 ${selectedTab === tab
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 hover:text-blue-500"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-xs mx-auto mb-6">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-md border bg-white border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <div className="flex-shrink-0">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full md:w-auto mt-1 p-2 text-sm border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">All Categories</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Transportation">Transportation</option>
            </select>
          </div>

          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700">
              Date Range
            </label>
            <div className="flex flex-col md:flex-row gap-4">
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

      

        <div className="flex flex-col md:flex-row gap-2">
          <div className="bg-white p-4 w-full md:w-2/3 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Filtered Documents</h3>
            {filteredData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-left border-b">
                    <tr>
                      <th className="py-2 px-4">Document Name</th>
                      <th className="py-2 px-4">Category</th>
                      <th className="py-2 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4">{item.name}</td>
                        <td className="py-2 px-4">{item.category}</td>
                        <td className="py-2 px-4">{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No documents found for selected filters.</p>
            )}
          </div>
        </div>
      </main>

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

      <Dialog open={newDocDialogOpen} onClose={() => setNewDocDialogOpen(false)}>
        <DialogTitle>Prepare New Document</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Document Title"
            type="text"
            fullWidth
            value={newDocTitle}
            onChange={(e) => setNewDocTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Department"
            type="text"
            fullWidth
            value={newDocDepartment}
            onChange={(e) => setNewDocDepartment(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setNewDocFile(e.target.files[0])}
            className="my-4"
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newDocDesc}
            onChange={(e) => setNewDocDesc(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewDocDialogOpen(false)} color="primary">
            Cancel
          </Button>


          <Button onClick={handleNewDocSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
   
    </div>
  );
};

export default AssistantDashboard;