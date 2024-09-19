import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TalukaMaster = () => {
  const [talukas, setTalukas] = useState([]);
  const [formState, setFormState] = useState({
    stateName: "",
    district: "",
    talukaName: "",
    status: "Inactive", // Set status to Inactive by default
  });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTalukas();
  }, []);

  // Fetch Talukas from API
  const fetchTalukas = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/talukas");
      setTalukas(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  // Add or Update Taluka
  const handleAddOrUpdateTaluka = async () => {
    if (!formState.stateName || !formState.district || !formState.talukaName) {
      toast.error("All fields are required!");
      return;
    }

    try {
      let response;

      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/talukas/${isEditing}`, formState);
        toast.success("Taluka updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/talukas", formState);
        toast.success("Taluka added successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        fetchTalukas();
        resetForm();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddOrUpdateTaluka();
  };

  const handleEditTaluka = (id) => {
    const taluka = talukas.find((t) => t.id === id);
    setFormState({
      stateName: taluka.stateName,
      district: taluka.district,
      talukaName: taluka.talukaName,
      status: taluka.status,
    });
    setIsEditing(id);
  };

  // Delete Taluka
  const handleDeleteTaluka = async (id) => {
    if (window.confirm("Are you sure you want to delete this taluka?")) {
      try {
        await axios.delete(`http://localhost:8080/api/talukas/${id}`);
        setTalukas(talukas.filter((t) => t.id !== id));
        toast.success("Taluka deleted successfully!");
      } catch (error) {
        handleError(error);
      }
    }
  };

  // Toggle Taluka Status
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await axios.put(`http://localhost:8080/api/talukas/${id}/status`, { status: newStatus });
      fetchTalukas();
      toast.success(`Taluka status updated to ${newStatus} successfully!`);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTalukas = talukas.filter((t) =>
    t.talukaName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const resetForm = () => {
    setFormState({
      stateName: "",
      district: "",
      talukaName: "",
      status: "Inactive",
    });
    setIsEditing(null);
  };

  const handleError = (error) => {
    console.error("Error:", error);
    if (error.response) {
      toast.error(`Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`);
    } else if (error.request) {
      toast.error("No response received from the server. Please try again.");
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />

      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative overflow-hidden whitespace-nowrap">
          <marquee className="text-2xl font-bold">Taluka Master</marquee>
        </div>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Search District"
              value={searchTerm}
              onChange={handleSearch}
              className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 w-full sm:w-auto"
            />
          )}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
            title="Search"
          >
            <FaSearch />
          </button>
          <button
            onClick={() => {
              setSearchTerm("");
              setShowSearch(false);
            }}
            className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
            title="Reset"
          >
            <FaSyncAlt />
          </button>
        </div>
      </div>

      {/* Add/Update Taluka Form */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold hover:text-black cursor-pointer">
            {isEditing ? "Edit Taluka" : "Add Taluka"}
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex flex-col">
                <label className="mb-1 font-medium">State</label>
                <input
                  type="text"
                  value={formState.stateName}
                  onChange={(e) => setFormState({ ...formState, stateName: e.target.value })}
                  className="p-2 border rounded hover:scale-105 transition duration-300"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium">District</label>
                <input
                  type="text"
                  value={formState.district}
                  onChange={(e) => setFormState({ ...formState, district: e.target.value })}
                  className="p-2 border rounded hover:scale-105 transition duration-300"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Taluka Name</label>
                <input
                  type="text"
                  value={formState.talukaName}
                  onChange={(e) => setFormState({ ...formState, talukaName: e.target.value })}
                  className="p-2 border rounded hover:scale-105 transition duration-300"
                  required
                />
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                {isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

       {/* Taluka List Table */}
       <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
        <div className="px-6 py-4">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-6 py-3 text-center hover:text-black cursor-pointer">Sr No</th>
                <th className="px-6 py-3 text-center hover:text-black cursor-pointer">Taluka Name</th>
                <th className="px-6 py-3 text-center hover:text-black cursor-pointer">Status</th>
                <th className="px-6 py-3 text-center hover:text-black cursor-pointer">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTalukas.map((taluka) => (
                <tr key={taluka.id} className="border-b">
                  <td className="px-6 py-3 text-center">{taluka.id}</td>
                  <td className="px-6 py-3 text-center">{taluka.talukaName}</td>
                  <td className="px-6 py-3 text-center">
                    <span
                      className={`font-bold ${taluka.status === "Active" ? "text-green-500" : "text-red-500"}`}
                    >
                      {taluka.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <span
                        onClick={() => handleToggleStatus(taluka.id, taluka.status)}
                        className="cursor-pointer"
                        title={`Mark as ${taluka.status === "Active" ? "Inactive" : "Active"}`}
                      >
                        {taluka.status === "Active" ? (
                          <FaTimes className="text-red-500" />
                        ) : (
                          <FaCheck className="text-green-500" />
                        )}
                      </span>
                      <span
                        onClick={() => handleEditTaluka(taluka.id)}
                        className="cursor-pointer text-blue-500"
                        title="Edit"
                      >
                        <FaEdit />
                      </span>
                      <span
                        onClick={() => handleDeleteTaluka(taluka.id)}
                        className="cursor-pointer text-red-500"
                        title="Delete"
                      >
                        <FaTrash />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TalukaMaster;