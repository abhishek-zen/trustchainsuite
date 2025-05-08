import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
// Import static JSON data
import applicationData from "../../backend/data/application.json";
import {
  Search,
  Filter,
  Calendar,
  ChevronDown,
  Shield,
  Edit,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

const ExpandableText = ({ text, limit = 3, type = "field" }) => {
  // Convert text to string if it's an array, or handle it if it's already a string
  const textAsString = Array.isArray(text) ? text.join(", ") : String(text || "");
  const parts = textAsString.split(",").filter(Boolean); // Split and remove empty parts
  const [expanded, setExpanded] = useState(false);

  const toggle = () => setExpanded(!expanded);
  const visibleItems = expanded ? parts : parts.slice(0, limit);
  const remaining = parts.length - limit;

  return (
    <>
      {visibleItems.map((item, i) => (
        <span
          key={i}
          className={`inline-block ${
            type === "field"
              ? "bg-slate-100 text-slate-700"
              : "bg-indigo-100 text-indigo-700"
          } text-xs px-2 py-1 rounded-full mr-1 mb-1`}
        >
          {item.trim()}
        </span>
      ))}
      {parts.length > limit && (
        <button
          onClick={toggle}
          className="text-xs text-indigo-600 ml-1 hover:underline focus:outline-none"
        >
          {expanded ? "Show less" : `+${remaining} more`}
        </button>
      )}
    </>
  );
};

const ConsentMatrixDialog = ({
  open,
  onClose,
  onSave,
  editRow,
  setEditRow,
}) => {
  if (!editRow) return null;

  const fields = editRow.fields?.split(",").map((f) => f.trim()) || [];
  const purposes = editRow.purpose?.split(",").map((p) => p.trim()) || [];

  const handleFieldPurposeToggle = (rowIdx, colIdx) => {
    setEditRow((prev) => ({
      ...prev,
      [`fp_${rowIdx}_${colIdx}`]: !prev[`fp_${rowIdx}_${colIdx}`],
    }));
  };

  const handleColumnSelectAll = (colIdx, isChecked) => {
    const updated = { ...editRow };
    fields.forEach((_, rowIdx) => {
      updated[`fp_${rowIdx}_${colIdx}`] = isChecked;
    });
    setEditRow(updated);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      } transition-opacity bg-slate-900/50`}
    >
      <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-6xl max-h-[90vh] flex flex-col">
        <div className="bg-indigo-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Consent Entry</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-indigo-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-auto p-6 flex-grow">
          <h4 className="text-slate-800 font-medium mb-4">
            Field-Level Consent Matrix
          </h4>

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    <th className="py-3 px-4 text-left font-medium border-b border-slate-200">
                      Field
                    </th>
                    {purposes.map((purpose, colIdx) => (
                      <th
                        key={colIdx}
                        className="py-3 px-4 text-center font-medium border-b border-slate-200"
                      >
                        {purpose}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className="hover:bg-slate-50 transition-all"
                    >
                      <td className="py-3 px-4 text-slate-800 border-b border-slate-100">
                        {field}
                      </td>
                      {purposes.map((_, colIdx) => (
                        <td
                          key={`fp-${rowIdx}-${colIdx}`}
                          className="py-3 px-4 text-center border-b border-slate-100"
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                            checked={editRow[`fp_${rowIdx}_${colIdx}`] || false}
                            onChange={() =>
                              handleFieldPurposeToggle(rowIdx, colIdx)
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-medium">
                    <td className="py-3 px-4 text-slate-800">Select All</td>
                    {purposes.map((_, colIdx) => (
                      <td
                        key={`selectAll-${colIdx}`}
                        className="py-3 px-4 text-center"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                          checked={fields.every(
                            (_, rowIdx) => editRow[`fp_${rowIdx}_${colIdx}`]
                          )}
                          onChange={(e) =>
                            handleColumnSelectAll(colIdx, e.target.checked)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const ConsentManagement = () => {
  const [data, setData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [timePeriod, setTimePeriod] = useState("Last 30 days");
  const [editRow, setEditRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stats
  const [activeCount, setActiveCount] = useState(0);
  const [revokedCount, setRevokedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [excelData, setExcelData] = useState([] as any[]);
  const [user, setUser] = useState(null as { username: string; role: string } | null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userDetails");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const roleColumnMap = {
    "Data Protection Officer": ["DPO", "CISO"],
    "Chief Data Officer": ["CDO", "CISO"],
    "Chief Information Security Officer (CISO)": ["CDO", "DPO"],
  };

  useEffect(() => {
    // Use static JSON data instead of API call
    const json = applicationData;
    // Process the static data the same way we would process API response data
        const headerMap = {
          app: "Application Name",
          dataset: "Dataset Name",
          classification: "Data Class",
          fields: "Fields",
          access: "Access Type",
          role: "Function Role",
          purpose: "Purpose of Access",
          token: "Access Token",
          expiry: "Expiry Date",
          cdo: "CDO",
          ciso: "CISO",
          dpo: "DPO",
          status: "Status",
          cdouser: "CDOUSER",
          cisouser: "CISOUSER",
          dpouser: "DPOUSER",
        };

        const parsed = json.map((row) => {
          const entry: {
            [key: string]: any;
            fields?: string;
            status?: string;
            expiry?: string | number;
            daysRemaining?: number;
          } = {};
          
          for (const key in headerMap) {
            const col = headerMap[key];
            entry[key] =
              typeof row[col] === "string" ? row[col].trim() : row[col];
          }
          
          // Handle fields property which could be string or array
          if (Array.isArray(entry.fields)) {
            // If it's an array, join it as a string
            entry.fields = entry.fields.join(", ");
          } else if (typeof entry.fields === "string") {
            // If it's a string, remove braces
            entry.fields = entry.fields.replace(/[{}]/g, "");
          }
          
          entry.status = entry.status || "Pending";

          // Format the date
          entry.expiry =
            typeof entry.expiry === "number"
              ? format(
                  new Date(Math.round((entry.expiry - 25569) * 86400 * 1000)),
                  "MMM dd, yyyy"
                )
              : entry.expiry;

          // Calculate days remaining
          if (entry.expiry) {
            const expiryDate = new Date(entry.expiry.toString());
            const today = new Date();
            const diffTime = expiryDate.getTime() - today.getTime();
            entry.daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }

          return entry;
        });

        setData(parsed);
        setActiveCount(
          parsed.filter((item) => item.status === "Approved").length
        );
        setRevokedCount(
          parsed.filter((item) => item.status === "Revoked").length
        );
        setPendingCount(
          parsed.filter((item) => item.status === "Pending").length
        );
        setLoading(false);
      // No need for catch block with static data
      setLoading(false);
  }, []);

  const handleEdit = (row) => setEditRow(row);
  const handleClose = () => setEditRow(null);
  const handleSave = () => {
    const updated = data.map((d) => (d.token === editRow.token ? editRow : d));
    setData(updated);
    handleClose();
  };

  const handleApprove = (row) => {
    const updated = data.map((d) => {
      if (d.token === row.token) {
        return { ...d, status: "Approved" };
      }
      return d;
    });
    setData(updated);
    setActiveCount((prevCount) => prevCount + 1);
    setPendingCount((prevCount) => prevCount - 1);
  };

  const handleRevoke = (row) => {
    const updated = data.map((d) => {
      if (d.token === row.token) {
        return { ...d, status: "Revoked" };
      }
      return d;
    });
    setData(updated);
    setRevokedCount((prevCount) => prevCount + 1);

    // Decrease the appropriate counter
    if (row.status === "Approved") {
      setActiveCount((prevCount) => prevCount - 1);
    } else if (row.status === "Pending") {
      setPendingCount((prevCount) => prevCount - 1);
    }
  };

  const filteredData = data.filter(
    (d) =>
      (filterStatus === "All" || d.status === filterStatus) &&
      (searchText === "" ||
        d.app?.toLowerCase().includes(searchText.toLowerCase()) ||
        d.dataset?.toLowerCase().includes(searchText.toLowerCase()) ||
        d.fields?.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Top navigation (would be in parent component) */}

      {/* Main content */}
      <div className="px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Consent Dashboard
          </h2>
          <p className="text-slate-500">
            Monitor and manage all data access consents across applications
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">
                  Active Consents
                </p>
                <p className="text-3xl font-semibold text-slate-800 mt-2">
                  {activeCount}
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                <CheckCircle size={22} />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">From previous period</span>
                <span className="font-medium text-emerald-600">+12.5%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">
                  Revoked Consents
                </p>
                <p className="text-3xl font-semibold text-slate-800 mt-2">
                  {revokedCount}
                </p>
              </div>
              <div className="bg-rose-100 p-3 rounded-full text-rose-600">
                <AlertTriangle size={22} />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">From previous period</span>
                <span className="font-medium text-slate-700">No change</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">
                  Pending Approvals
                </p>
                <p className="text-3xl font-semibold text-slate-800 mt-2">
                  {pendingCount}
                </p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                <Clock size={22} />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">From previous period</span>
                <span className="font-medium text-slate-700">
                  Same as previous
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                placeholder="Search applications, datasets..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Search
                size={16}
                className="absolute left-3 top-3 text-slate-400"
              />
            </div>
            <div className="relative">
              <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm">
                <Filter size={16} />
                <span>Status: {filterStatus}</span>
                <ChevronDown size={16} />
              </button>
              <div className="absolute mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 hidden">
                {["All", "Approved", "Pending", "Rejected", "Revoked"].map(
                  (status) => (
                    <button
                      key={status}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setFilterStatus(status)}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-slate-500">Time period:</span>
            <div className="relative">
              <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
                <Calendar size={16} />
                <span>{timePeriod}</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Data table */}
        {loading ? (
          <div className="flex items-center justify-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Application
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Dataset
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Classification
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Fields
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Purpose
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Expiry
                    </th>
                    {/* Conditionally Render Columns */}
                    {user?.role === "Chief Data Officer" && (
                      <>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          DPO
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          CISO
                        </th>
                      </>
                    )}
                    {user?.role === "Data Protection Officer" && (
                      <>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          CDO
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          CISO
                        </th>
                      </>
                    )}
                    {user?.role === "Chief Information Security Officer" && (
                      <>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          CDO
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          DPO
                        </th>
                      </>
                    )}

                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-all">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                        {row.app}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {row.dataset}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {row.classification}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <ExpandableText
                          text={row.fields}
                          limit={3}
                          type="field"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <ExpandableText
                          text={row.purpose}
                          limit={2}
                          type="purpose"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <div className="flex flex-col">
                          <span>{row.expiry}</span>
                          {row.daysRemaining > 0 && (
                            <span
                              className={`text-xs ${
                                row.daysRemaining < 30
                                  ? "text-amber-600"
                                  : "text-emerald-600"
                              }`}
                            >
                              {row.daysRemaining} days remaining
                            </span>
                          )}
                        </div>
                      </td>

                      {user?.role === "Data Protection Officer" && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                row.cdo === "Approved"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : row.cdo === "Pending For Approval"
                                  ? "bg-amber-50 text-amber-700"
                                  : row.cdo === "Revoked"
                                  ? "bg-rose-50 text-rose-700"
                                  : row.cdo === "Rejected"
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-slate-50 text-slate-700"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  row.cdo === "Approved"
                                    ? "bg-emerald-500"
                                    : row.cdo === "Pending For Approval"
                                    ? "bg-amber-500"
                                    : row.cdo === "Revoked"
                                    ? "bg-rose-500"
                                    : row.cdo === "Rejected"
                                    ? "bg-rose-50 text-rose-700"
                                    : "bg-slate-500"
                                }`}
                              ></span>
                              {row.cdo}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                row.ciso === "Approved"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : row.ciso === "Pending For Approval"
                                  ? "bg-amber-50 text-amber-700"
                                  : row.ciso === "Revoked"
                                  ? "bg-rose-50 text-rose-700"
                                  : row.ciso === "Rejected"
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-slate-50 text-slate-700"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  row.ciso === "Approved"
                                    ? "bg-emerald-500"
                                    : row.ciso === "Pending For Approval"
                                    ? "bg-amber-500"
                                    : row.ciso === "Revoked"
                                    ? "bg-rose-500"
                                    : row.ciso === "Rejected"
                                    ? "bg-rose-500"
                                    : "bg-slate-500"
                                }`}
                              ></span>
                              {row.ciso}
                            </span>
                          </td>
                        </>
                      )}
                      {user?.role === "Chief Data Officer" && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                row.dpo === "Approved"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : row.dpo === "Pending For Approval"
                                  ? "bg-amber-50 text-amber-700"
                                  : row.dpo === "Revoked"
                                  ? "bg-rose-50 text-rose-700"
                                  : row.dpo === "Rejected"
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-slate-50 text-slate-700"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  row.dpo === "Approved"
                                    ? "bg-emerald-500"
                                    : row.dpo === "Pending For Approval"
                                    ? "bg-amber-500"
                                    : row.dpo === "Revoked"
                                    ? "bg-rose-500"
                                    : row.dpo === "Rejected"
                                    ? "bg-rose-50 text-rose-700"
                                    : "bg-slate-500"
                                }`}
                              ></span>
                              {row.dpo}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                row.ciso === "Approved"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : row.ciso === "Pending For Approval"
                                  ? "bg-amber-50 text-amber-700"
                                  : row.ciso === "Revoked"
                                  ? "bg-rose-50 text-rose-700"
                                  : row.ciso === "Rejected"
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-slate-50 text-slate-700"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  row.ciso === "Approved"
                                    ? "bg-emerald-500"
                                    : row.ciso === "Pending For Approval"
                                    ? "bg-amber-500"
                                    : row.ciso === "Revoked"
                                    ? "bg-rose-500"
                                    : row.ciso === "Rejected"
                                    ? "bg-rose-500"
                                    : "bg-slate-500"
                                }`}
                              ></span>
                              {row.ciso}
                            </span>
                          </td>
                        </>
                      )}
                      {user?.role === "Chief Information Security Officer" && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                row.cdo === "Approved"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : row.cdo === "Pending For Approval"
                                  ? "bg-amber-50 text-amber-700"
                                  : row.cdo === "Revoked"
                                  ? "bg-rose-50 text-rose-700"
                                  : row.cdo === "Rejected"
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-slate-50 text-slate-700"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  row.cdo === "Approved"
                                    ? "bg-emerald-500"
                                    : row.cdo === "Pending For Approval"
                                    ? "bg-amber-500"
                                    : row.cdo === "Revoked"
                                    ? "bg-rose-500"
                                    : row.cdo === "Rejected"
                                    ? "bg-rose-50 text-rose-700"
                                    : "bg-slate-500"
                                }`}
                              ></span>
                              {row.cdo}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                row.dpo === "Approved"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : row.dpo === "Pending For Approval"
                                  ? "bg-amber-50 text-amber-700"
                                  : row.dpo === "Revoked"
                                  ? "bg-rose-50 text-rose-700"
                                  : row.dpo === "Rejected"
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-slate-50 text-slate-700"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  row.dpo === "Approved"
                                    ? "bg-emerald-500"
                                    : row.dpo === "Pending For Approval"
                                    ? "bg-amber-500"
                                    : row.dpo === "Revoked"
                                    ? "bg-rose-500"
                                    : row.dpo === "Rejected"
                                    ? "bg-rose-50 text-rose-700"
                                    : "bg-slate-500"
                                }`}
                              ></span>
                              {row.dpo}
                            </span>
                          </td>
                        </>
                      )}

                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            row.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700"
                              : row.status === "Pending For Approval"
                              ? "bg-amber-50 text-amber-700"
                              : row.status === "Revoked"
                              ? "bg-rose-50 text-rose-700"
                              : "bg-slate-50 text-slate-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              row.status === "Approved"
                                ? "bg-emerald-500"
                                : row.status === "Pending For Approval"
                                ? "bg-amber-500"
                                : row.status === "Rejected"
                                ? "bg-rose-500"
                                : "bg-slate-500"
                            }`}
                          ></span>
                          {row.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEdit(row)}
                            className="text-indigo-600 hover:text-indigo-800"
                            disabled={
                              user?.username !== row.cdouser &&
                              user?.username !== row.cisouser &&
                              user?.username !== row.dpouser
                            } // ❗ change logic as needed
                          >
                            <Edit size={16} />
                          </button>

                          {row.status === "Pending" ? (
                            <button
                              onClick={() => handleApprove(row)}
                              className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-md hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={
                                user?.username !== row.cdouser &&
                                user?.username !== row.cisouser &&
                                user?.username !== row.dpouser
                              } // 👈 Add your logic
                            >
                              Approve
                            </button>
                          ) : row.status === "Approved" ? (
                            <button
                              onClick={() => handleRevoke(row)}
                              className="px-3 py-1 bg-rose-50 text-rose-700 text-xs rounded-md hover:bg-rose-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={
                                user?.username !== row.cdouser &&
                                user?.username !== row.cisouser &&
                                user?.username !== row.dpouser
                              } // 👈 Add your logic
                            >
                              Revoke
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100">
              <div>
                <p className="text-sm text-slate-600">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{filteredData.length}</span> of{" "}
                  <span className="font-medium">{filteredData.length}</span>{" "}
                  entries
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-200 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                    <span className="sr-only">Previous</span>
                    &laquo;
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-slate-200 bg-white text-sm font-medium text-indigo-600 hover:bg-slate-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-200 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                    <span className="sr-only">Next</span>
                    &raquo;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialog for editing consent */}
      <ConsentMatrixDialog
        open={!!editRow}
        editRow={editRow}
        setEditRow={setEditRow}
        onClose={handleClose}
        onSave={handleSave}
      />
    </div>
  );
};

export default ConsentManagement;
