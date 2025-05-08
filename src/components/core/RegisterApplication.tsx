import React, { useState } from "react";
import { register_app_default_data_sets } from "../constants/constants";
import { available_purposes_to_register } from "../constants/constants";
import { available_fields_to_register } from "../constants/constants";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { ShieldCheck, LogOut, User } from "lucide-react";

interface DataSet {
  id?: number;
  name: string;
  fields: string[];
  purpose: string[];
  status: "active" | "inactive" | "waiting";
  accessToken: string;
  expiryDate: string;
}

interface Application {
  id: number;
  name: string;
  description: string;
  dataSets: DataSet[];
}

const RegisterApplication: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [newAppName, setNewAppName] = useState<string>("");
  const [newAppDescription, setNewAppDescription] = useState<string>("");
  const [newDataSet, setNewDataSet] = useState<DataSet>({
    name: "User Profile Data",
    fields: ["name", "email"],
    purpose: ["Authentication"],
    status: "inactive",
    accessToken: "",
    expiryDate: "",
  });
  const [showFieldsDropdown, setShowFieldsDropdown] = useState<boolean>(false);
  const [showPurposeDropdown, setShowPurposeDropdown] =
    useState<boolean>(false);
  const [showDataSetDropdown, setShowDataSetDropdown] =
    useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const defaultDataSets = [...register_app_default_data_sets];
  const availableFields = [...available_fields_to_register];
  const availablePurposes = [...available_purposes_to_register];

  const handleAppRegister = () => {
    const trimmedName = newAppName.trim();
    if (!trimmedName) return;

    const duplicate = applications.find((app) => app.name === trimmedName);
    if (duplicate) {
      alert("Application with this name already exists.");
      return;
    }

    const newApp = {
      id: Date.now(),
      name: trimmedName,
      description: newAppDescription.trim(),
      dataSets: [],
    };

    setNewAppDescription("");

    setApplications([...applications, newApp]);
    setNewAppName("");
    setSelectedAppId(newApp.id);
  };

  const handleCancelRegistration = () => {
    setSelectedAppId(null);
    setNewAppName("");
    setNewDataSet({
      name: "User Profile Data",
      fields: ["name", "email"],
      purpose: ["Authentication"],
      status: "inactive",
      accessToken: "",
      expiryDate: "",
    });
  };

  const handleNavigateToDashboard = () => {
    // Replace with real routing logic if using react-router
    localStorage.setItem("newapp", "newapp");
    toast.success("Redirecting to dashboard...");
    window.location.href = "/dashboard"; // Simulated redirect
  };

  const handleAddDataSet = () => {
    // Basic validation
    if (
      !newDataSet.name.trim() ||
      !selectedAppId ||
      newDataSet.fields.length === 0
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Find the selected application
    const selectedApp = applications.find((app) => app.id === selectedAppId);
    if (!selectedApp) return;

    // Check for duplicate data set names
    const duplicateDataSet = selectedApp.dataSets.find(
      (ds) =>
        ds.name.trim().toLowerCase() === newDataSet.name.trim().toLowerCase()
    );

    if (duplicateDataSet) {
      alert(
        `A data set with the name "${newDataSet.name}" already exists for this application.`
      );
      return;
    }

    // Check for duplicate data sets based on fields and purpose similarity
    const similarDataSet = selectedApp.dataSets.find((ds) => {
      // Check if fields are the same (regardless of order)
      const fieldsMatch =
        ds.fields.length === newDataSet.fields.length &&
        ds.fields.every((field) => newDataSet.fields.includes(field));

      // Check if purposes are the same (regardless of order)
      const purposesMatch =
        ds.purpose.length === newDataSet.purpose.length &&
        ds.purpose.every((purpose) => newDataSet.purpose.includes(purpose));

      // Consider it duplicate if both fields and purposes match
      return fieldsMatch && purposesMatch;
    });

    if (similarDataSet) {
      alert(
        "A data set with identical fields and purposes already exists for this application."
      );
      return;
    }

    const updatedApps = applications.map((app) => {
      if (app.id === selectedAppId) {
        return {
          ...app,
          dataSets: [
            ...app.dataSets,
            {
              ...newDataSet,
              id: Date.now(),
            },
          ],
        };
      }
      return app;
    });

    setApplications(updatedApps);
    setNewDataSet({
      name: "User Profile Data",
      fields: ["name", "email"],
      purpose: ["Authentication"],
      status: "inactive",
      accessToken: "",
      expiryDate: "",
    });
  };

  const selectDataSet = (index: number) => {
    const selectedDataSet = defaultDataSets[index];
    setNewDataSet({
      ...newDataSet,
      name: selectedDataSet.name,
      fields: [...selectedDataSet.fields],
      purpose: [...selectedDataSet.purpose],
    });
    setShowDataSetDropdown(false);
  };

  const toggleField = (field: string) => {
    const updatedFields = newDataSet.fields.includes(field)
      ? newDataSet.fields.filter((f) => f !== field)
      : [...newDataSet.fields, field];

    setNewDataSet({
      ...newDataSet,
      fields: updatedFields,
    });
  };

  const togglePurpose = (purpose: string) => {
    const updatedPurposes = newDataSet.purpose.includes(purpose)
      ? newDataSet.purpose.filter((p) => p !== purpose)
      : [...newDataSet.purpose, purpose];

    setNewDataSet({
      ...newDataSet,
      purpose: updatedPurposes,
    });
  };

  const selectedApp = applications.find((app) => app.id === selectedAppId);

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-8">
      {/* Top navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <ShieldCheck size={24} className="text-indigo-600" />
              <h1 className="text-xl font-bold text-slate-800">
                TrustAssure KYC Portal
              </h1>
            </div>
            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-full focus:outline-none"
              >
                <User size={24} className="text-gray-700" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-50">
                  <button
                    onClick={() => {
                      window.location.href = "/login"; // Replace with your logout logic
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Header with aligned title and button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-gray-800">
            Application Data Manager
          </h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleNavigateToDashboard}
          >
            Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - App Registration */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Register Application
            </h2>

            <div className="flex flex-col gap-3 mb-6">
              <input
                className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-300 focus:outline-none"
                placeholder="Application Name"
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
              />
              <textarea
                className="border rounded-md px-3 py-2 w-full h-24 resize-none focus:ring-2 focus:ring-blue-300 focus:outline-none"
                placeholder="Application Description"
                value={newAppDescription}
                onChange={(e) => setNewAppDescription(e.target.value)}
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                onClick={handleAppRegister}
              >
                Register
              </button>
            </div>

            <h3 className="text-lg font-medium mb-3 text-gray-700">
              Your Applications
            </h3>
            <div className="max-h-80 overflow-y-auto">
              {applications.length === 0 ? (
                <p className="text-gray-500 italic">
                  No applications registered yet.
                </p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <li
                      key={app.id}
                      onClick={() => setSelectedAppId(app.id)}
                      className={`py-2 px-3 cursor-pointer hover:bg-gray-100 ${
                        selectedAppId === app.id
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : ""
                      }`}
                    >
                      <div className="font-medium">{app.name}</div>
                      <div className="text-xs text-gray-500">
                        {app.dataSets.length} data sets
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Middle/Right Columns - Data Set Management */}
          {selectedApp ? (
            <>
              {/* Middle Column - Add Data Set Form */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Add Data Set for:{" "}
                  <span className="text-blue-600">{selectedApp.name}</span>
                </h3>

                <div className="space-y-4">
                  {/* Data Set Template Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Set Type
                    </label>
                    <div
                      className="w-full border rounded-md px-3 py-2 bg-white flex justify-between items-center cursor-pointer"
                      onClick={() =>
                        setShowDataSetDropdown(!showDataSetDropdown)
                      }
                    >
                      <span className="font-medium">{newDataSet.name}</span>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>

                    {showDataSetDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {defaultDataSets.map((ds, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                            onClick={() => selectDataSet(index)}
                          >
                            {ds.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fields Multi-select Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fields
                    </label>
                    <div
                      className="w-full border rounded-md px-3 py-2 min-h-10 bg-white cursor-pointer flex items-center"
                      onClick={() => setShowFieldsDropdown(!showFieldsDropdown)}
                    >
                      {newDataSet.fields.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {newDataSet.fields.map((field) => (
                            <span
                              key={field}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">Select fields</span>
                      )}
                    </div>

                    {showFieldsDropdown && (
                      <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                        <div className="p-2 border-b sticky top-0 bg-white">
                          <div className="text-sm font-medium text-gray-700">
                            Select Fields
                          </div>
                        </div>
                        {availableFields.map((field) => (
                          <div
                            key={field}
                            className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                            onClick={() => toggleField(field)}
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 mr-2"
                              checked={newDataSet.fields.includes(field)}
                              readOnly
                            />
                            <span>{field}</span>
                          </div>
                        ))}
                        <div className="p-2 border-t sticky bottom-0 bg-white">
                          <button
                            className="w-full bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                            onClick={() => setShowFieldsDropdown(false)}
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Purpose Multi-select Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purpose
                    </label>
                    <div
                      className="w-full border rounded-md px-3 py-2 min-h-10 bg-white cursor-pointer flex items-center"
                      onClick={() =>
                        setShowPurposeDropdown(!showPurposeDropdown)
                      }
                    >
                      {newDataSet.purpose.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {newDataSet.purpose.map((purpose) => (
                            <span
                              key={purpose}
                              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                            >
                              {purpose}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">Select purposes</span>
                      )}
                    </div>

                    {showPurposeDropdown && (
                      <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                        <div className="p-2 border-b sticky top-0 bg-white">
                          <div className="text-sm font-medium text-gray-700">
                            Select Purposes
                          </div>
                        </div>
                        {availablePurposes.map((purpose) => (
                          <div
                            key={purpose}
                            className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                            onClick={() => togglePurpose(purpose)}
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 mr-2"
                              checked={newDataSet.purpose.includes(purpose)}
                              readOnly
                            />
                            <span>{purpose}</span>
                          </div>
                        ))}
                        <div className="p-2 border-t sticky bottom-0 bg-white">
                          <button
                            className="w-full bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                            onClick={() => setShowPurposeDropdown(false)}
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                      min={new Date().toISOString().split("T")[0]}
                      value={newDataSet.expiryDate}
                      onChange={(e) =>
                        setNewDataSet({
                          ...newDataSet,
                          expiryDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors mt-4"
                    onClick={handleAddDataSet}
                  >
                    Add Data Set
                  </button>

                  {/* Cancel Button */}
                  <button
                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
                    onClick={handleCancelRegistration}
                  >
                    Cancel Registration
                  </button>
                </div>
              </div>

              {/* Right Column - Data Sets List */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Existing Data Sets{" "}
                  <span className="text-sm font-normal text-gray-500">
                    ({selectedApp.dataSets.length})
                  </span>
                </h3>

                <div className="max-h-96 overflow-y-auto mb-6">
                  {selectedApp.dataSets.length === 0 ? (
                    <p className="text-gray-500 italic">
                      No data sets added yet.
                    </p>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {selectedApp.dataSets.map((ds) => (
                        <li key={ds.id} className="py-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{ds.name}</span>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                ds.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : ds.status === "waiting"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {ds.status}
                            </span>
                          </div>

                          <div className="mt-2 text-sm text-gray-600">
                            <div className="mb-1">
                              <span className="font-medium">Fields:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {ds.fields && ds.fields.map ? (
                                  ds.fields.map((field) => (
                                    <span
                                      key={field}
                                      className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded"
                                    >
                                      {field}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-500">
                                    None specified
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="mb-1">
                              <span className="font-medium">Purpose:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {ds.purpose && ds.purpose.map ? (
                                  ds.purpose.map((purpose) => (
                                    <span
                                      key={purpose}
                                      className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded"
                                    >
                                      {purpose}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-500">
                                    None specified
                                  </span>
                                )}
                              </div>
                            </div>

                            {ds.expiryDate && (
                              <div className="mt-2">
                                <span className="font-medium">Expires:</span>{" "}
                                {ds.expiryDate}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Dashboard button */}
                <div className="mt-6">
                  <button
                    className={`w-full py-2 rounded-md transition-colors ${
                      selectedApp.dataSets.length > 0
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={handleNavigateToDashboard}
                    disabled={selectedApp.dataSets.length === 0}
                  >
                    Request & Go Dashboard
                  </button>
                  {selectedApp.dataSets.length === 0 && (
                    <p className="text-xs text-gray-500 text-center mt-1">
                      Add at least one data set to continue
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-gray-400 text-6xl mb-4">👈</div>
                <h3 className="text-xl font-medium text-gray-700">
                  Select an application
                </h3>
                <p className="text-gray-500 mt-2">
                  Please select an application from the list or register a new
                  one to manage its data sets.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default RegisterApplication;
