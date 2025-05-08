import React, { useEffect, useState } from "react";
import { preload_dashboard_apps } from "../constants/constants";
import { ShieldCheck, User, LogOut } from "lucide-react";

// Dummy data for demonstration
const dummyApplications = [...preload_dashboard_apps];

interface DataSet {
  id: string;
  name: string;
  status: "active" | "inactive" | "waiting";
  expiryDate?: string;
  fields: string[];
  purpose: string[];
  accessToken?: string;
}

interface Application {
  id: string;
  name: string;
  dataSets: DataSet[];
  app_created_date?: string;
  app_desc?: string;
}

const ApplicationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("datasets");

  const [applications, setApplications] = useState<Application[]>([
    ...dummyApplications,
  ]);

  // const newapp_val = localStorage.getItem("newapp");
  // console.log("appval : " + newapp_val);

  // if (newapp_val === "newapp") {
  //useEffect(() => {
  //const timer = setTimeout(() => {
  // const newApp: Application = {
  //   id: `app-${Date.now()}`,
  //   name: "TrustAssure",
  //   app_created_date: new Date().toISOString().split("T")[0],
  //   app_desc: "KYC verification based on user information details",
  //   dataSets: [
  //     {
  //       id: `ds-${Date.now()}`,
  //       name: "User Profiles",
  //       status: "active",
  //       fields: [
  //         "FullName",
  //         "DOB",
  //         "Gender",
  //         "Email",
  //         "Phone Number",
  //         "PAN Card Number",
  //         "Aadhar Number",
  //         "Passport Number",
  //         "Address",
  //       ],
  //       purpose: [
  //         "Verification",
  //         "Customer onboarding",
  //         "Audit Trail",
  //         "Learning and Auditing",
  //         "Record Keeping",
  //         "Legal Compliance",
  //         "Security Alert",
  //         "User Authentication",
  //       ],
  //       expiryDate: "15-04-2026 05:35",
  //       accessToken:
  //         "eyBillPol.eyJSb2RestrictedlIjoiQ29uc3VtZRestrictedIiLCJleHAiOjE3NDQzNjEyMDB9.Oa4gUS4Ghw8A1IZRestrictedwIk",
  //     },
  //   ],
  // };

  //setApplications((prevApps) => [newApp, ...prevApps]);
  // }, 0.1 * 60 * 1000); // 2 minutes

  // return () => clearTimeout(timer);
  //}, []);

  //useEffect(() => {
  //const timer = setTimeout(() => {
  // setApplications((prevApps) => {
  //   const updatedApps = [...prevApps];
  //   if (
  //     updatedApps.length > 0 &&
  //     updatedApps[0].dataSets.length > 0 &&
  //     updatedApps[0].dataSets[0].status === "inactive"
  //   ) {
  //     updatedApps[0].dataSets[0] = {
  //       ...updatedApps[0].dataSets[0],
  //       status: "active",
  //       accessToken:
  //         "eyBillPol.eyJSb2RestrictedlIjoiQ29uc3VtZRestrictedIiLCJleHAiOjE3NDQzNjEyMDB9.Oa4gUS4Ghw8A1IZRestrictedwIk",
  //     };
  //   }
  //   localStorage.removeItem("newapp");
  //   return updatedApps;
  // });
  //}, 2 * 60 * 1000); // 2 minutes in milliseconds

  //return () => clearTimeout(timer);
  //}, []);
  // }

  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);
  const [expandedDataSets, setExpandedDataSets] = useState<
    Record<string, boolean>
  >({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expiryFilter, setExpiryFilter] = useState<string>("all");
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleDataSetExpansion = (dataSetId: string) => {
    setExpandedDataSets((prevState) => ({
      ...prevState,
      [dataSetId]: !prevState[dataSetId],
    }));
  };

  const getFilteredDataSets = (dataSets: DataSet[]): DataSet[] => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    return dataSets.filter((ds) => {
      const matchesSearch =
        ds.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        ds.fields.some((field) =>
          field.toLowerCase().includes(lowerCaseSearchTerm)
        ) ||
        ds.purpose.some((purpose) =>
          purpose.toLowerCase().includes(lowerCaseSearchTerm)
        );

      const matchesStatus =
        statusFilter === "all" || ds.status === statusFilter;

      let matchesExpiry = expiryFilter === "all";
      if (expiryFilter === "expired" && ds.expiryDate) {
        const expiryDate = new Date(ds.expiryDate);
        matchesExpiry = expiryDate < now;
      } else if (expiryFilter === "expiring-soon" && ds.expiryDate) {
        const expiryDate = new Date(ds.expiryDate);
        matchesExpiry = expiryDate >= now && expiryDate <= thirtyDaysFromNow;
      } else if (expiryFilter === "valid" && ds.expiryDate) {
        const expiryDate = new Date(ds.expiryDate);
        matchesExpiry = expiryDate > thirtyDaysFromNow;
      }

      return matchesSearch && matchesStatus && matchesExpiry;
    });
  };

  const getTotalDataSetsCount = (): number => {
    return applications.reduce((total, app) => total + app.dataSets.length, 0);
  };

  const getStatusCounts = (): Record<string, number> => {
    return applications.reduce((counts, app) => {
      app.dataSets.forEach((ds) => {
        counts[ds.status] = (counts[ds.status] || 0) + 1;
      });
      return counts;
    }, {} as Record<string, number>);
  };

  if (!applications || applications.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="bg-white p-6 md:p-12 rounded-lg shadow-md text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
            No Applications Found
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't registered any applications yet. Please go back to the
            registration page to get started.
          </p>
          <button
            onClick={() => (window.location.href = "/register")}
            className="bg-blue-600 text-white px-4 md:px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Register an Application
          </button>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();
  const totalDataSets = getTotalDataSetsCount();

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
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

      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
          <h1 className="text-xl md:text-1xl font-bold text-gray-800 mb-4 md:mb-0">
            Application Dashboard
          </h1>
          <button
            onClick={() => (window.location.href = "/register")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors self-start md:self-center"
          >
            Register New App
          </button>
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 md:px-6 py-3 text-base md:text-lg font-medium whitespace-nowrap ${
                activeTab === "datasets"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("datasets")}
            >
              Data Sets
            </button>
            <button
              className={`px-4 md:px-6 py-3 text-base md:text-lg font-medium whitespace-nowrap ${
                activeTab === "applications"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("applications")}
            >
              Applications
            </button>
            <button
              className={`px-4 md:px-6 py-3 text-base md:text-lg font-medium whitespace-nowrap ${
                activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 md:p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="bg-blue-50 p-4 md:p-6 rounded-lg border border-blue-100">
                    <div className="text-blue-600 text-xl md:text-2xl font-bold">
                      {applications.length}
                    </div>
                    <div className="text-gray-600">Registered Applications</div>
                  </div>
                  <div className="bg-green-50 p-4 md:p-6 rounded-lg border border-green-100">
                    <div className="text-green-600 text-xl md:text-2xl font-bold">
                      {totalDataSets}
                    </div>
                    <div className="text-gray-600">Total Data Sets</div>
                  </div>
                  <div className="bg-purple-50 p-4 md:p-6 rounded-lg border border-purple-100">
                    <div className="text-purple-600 text-xl md:text-2xl font-bold">
                      {statusCounts.active || 0}
                    </div>
                    <div className="text-gray-600">Active Data Sets</div>
                  </div>
                </div>

                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-700">
                  Status Distribution
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 md:mb-8">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-500">Active</div>
                        <div className="text-lg font-semibold">
                          {statusCounts.active || 0}
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <div className="h-6 w-6 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-500">Inactive</div>
                        <div className="text-lg font-semibold">
                          {statusCounts.inactive || 0}
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="h-6 w-6 rounded-full bg-gray-500"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-500">Waiting</div>
                        <div className="text-lg font-semibold">
                          {statusCounts.waiting || 0}
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <div className="h-6 w-6 rounded-full bg-yellow-500"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-700">
                  Recent Applications
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Application
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data Sets
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applications.slice(0, 5).map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {app.name}
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-500">
                              {app.dataSets.length}
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            {app.dataSets.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {app.dataSets.some(
                                  (ds) => ds.status === "active"
                                ) && (
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                  </span>
                                )}
                                {app.dataSets.some(
                                  (ds) => ds.status === "inactive"
                                ) && (
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                    Inactive
                                  </span>
                                )}
                                {app.dataSets.some(
                                  (ds) => ds.status === "waiting"
                                ) && (
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Waiting
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500">
                                No data sets
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === "applications" && (
              <div>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search applications..."
                    className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="space-y-4 md:space-y-6">
                  {applications
                    .filter((app) =>
                      app.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((app) => (
                      <div
                        key={app.id}
                        className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-0">
                            {app.name}
                          </h3>
                          <div className="text-sm text-gray-500">
                            ID: {app.id}
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-sm font-medium text-gray-700 mb-2">
                            Data Sets ({app.dataSets.length})
                          </div>
                          {app.dataSets.length === 0 ? (
                            <p className="text-gray-500 italic">
                              No data sets added yet.
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {app.dataSets.map((ds) => (
                                <div
                                  key={ds.id}
                                  className={`p-3 rounded-md border ${
                                    ds.status === "active"
                                      ? "border-green-200 bg-green-50"
                                      : ds.status === "waiting"
                                      ? "border-yellow-200 bg-yellow-50"
                                      : "border-gray-200 bg-gray-50"
                                  }`}
                                >
                                  <div className="font-medium">{ds.name}</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {ds.fields.length} fields •{" "}
                                    {ds.purpose.length} purposes
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <button
                            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
                            onClick={() =>
                              setExpandedAppId(
                                expandedAppId === app.id ? null : app.id
                              )
                            }
                          >
                            {expandedAppId === app.id
                              ? "Hide Details"
                              : "View Details"}
                          </button>
                        </div>
                        {expandedAppId === app.id && (
                          <div className="mt-4 border-t border-gray-200 pt-4">
                            <h4 className="text-base md:text-lg font-semibold text-gray-700 mb-2">
                              Application Details
                            </h4>
                            <div className="text-gray-600 text-sm mb-2">
                              <strong>ID:</strong> {app.id}
                            </div>
                            <div className="text-gray-600 text-sm mb-2">
                              <strong>Created:</strong> {app.app_created_date}
                            </div>
                            <div className="text-gray-600 text-sm">
                              <strong>Description:</strong>{" "}
                              {app.app_desc || "No description available."}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Data Sets Tab */}
            {activeTab === "datasets" && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 gap-4">
                  <input
                    type="text"
                    placeholder="Search data sets..."
                    className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <select
                      className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-white"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="waiting">Waiting</option>
                    </select>

                    <select
                      className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-white"
                      value={expiryFilter}
                      onChange={(e) => setExpiryFilter(e.target.value)}
                    >
                      <option value="all">All Expiry</option>
                      <option value="expired">Expired</option>
                      <option value="expiring-soon">Expiring Soon</option>
                      <option value="valid">Valid</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data Set
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Application
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expiry Date
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applications.flatMap((app) =>
                        getFilteredDataSets(app.dataSets).map((ds) => (
                          <React.Fragment key={`${app.id}-${ds.id}`}>
                            <tr
                              className="hover:bg-gray-50 cursor-pointer"
                              onClick={() => toggleDataSetExpansion(ds.id)}
                            >
                              <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                <div className="text-gray-900">{ds.name}</div>
                              </td>
                              <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">
                                  {app.name}
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    ds.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : ds.status === "waiting"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {ds.status}
                                </span>
                              </td>
                              <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                {ds.expiryDate ? (
                                  <div className="text-gray-500">
                                    {ds.expiryDate}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">
                                    No expiry
                                  </span>
                                )}
                              </td>
                              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900">
                                  {expandedDataSets[ds.id]
                                    ? "Hide Details"
                                    : "View Details"}
                                </button>
                              </td>
                            </tr>

                            {/* Expanded details row */}
                            {expandedDataSets[ds.id] && (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="px-4 md:px-6 py-4 bg-gray-50"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                      <h4 className="font-medium text-gray-700 mb-2">
                                        Fields
                                      </h4>
                                      <div className="flex flex-wrap gap-1">
                                        {ds.fields.map((field) => (
                                          <span
                                            key={field}
                                            className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded"
                                          >
                                            {field}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="font-medium text-gray-700 mb-2">
                                        Purposes
                                      </h4>
                                      <div className="flex flex-wrap gap-1">
                                        {ds.purpose.map((purpose) => (
                                          <span
                                            key={purpose}
                                            className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded"
                                          >
                                            {purpose}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {ds.accessToken && (
                                    <div className="mt-4">
                                      <h4 className="font-medium text-gray-700 mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <span>Access Token</span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText(
                                              ds.accessToken ?? ""
                                            );
                                            setCopiedTokenId(ds.id);
                                            setTimeout(
                                              () => setCopiedTokenId(null),
                                              2000
                                            );
                                          }}
                                          className="text-blue-600 text-sm hover:underline focus:outline-none mt-1 sm:mt-0"
                                        >
                                          {copiedTokenId === ds.id
                                            ? "Copied!"
                                            : "Copy"}
                                        </button>
                                      </h4>
                                      <div className="bg-gray-100 p-2 rounded font-mono text-sm break-all">
                                        {ds.accessToken}
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex justify-end mt-4 gap-2">
                                    <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors">
                                      Edit
                                    </button>
                                    {ds.status !== "active" ? (
                                      <button className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition-colors">
                                        Activate
                                      </button>
                                    ) : (
                                      <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors">
                                        Deactivate
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDashboard;
