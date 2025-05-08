import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, ChevronDown, Eye, AlertTriangle, User, Shield } from 'lucide-react';

const DataAccessReport = () => {
  const [activeTab, setActiveTab] = useState('report');
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data based on the screenshot
  const accessData = [
    { id: 1, field: 'Username', purpose: 'Customer Onboarding & Verification', date: '2025-04-10', accessedBy: 'Insurance Claim', severity: 'low' },
    { id: 2, field: 'Gender', purpose: 'Product Recommendation', date: '2025-04-08', accessedBy: 'Customer Service', severity: 'low' },
    { id: 3, field: 'DOB', purpose: 'Business Analytics', date: '2025-04-04', accessedBy: 'Insurance Claim', severity: 'medium' },
    { id: 4, field: 'Passport Number', purpose: 'Customer Onboarding & Verification', date: '2025-04-02', accessedBy: 'Fraud Investigation', severity: 'high' },
    { id: 5, field: 'Address', purpose: 'Learning & Training,Audit,Record Keeping,Legal Hold', date: '2025-04-01', accessedBy: 'Fraud Investigation', severity: 'high' },
    { id: 6, field: 'Email', purpose: 'Marketing Communication', date: '2025-03-28', accessedBy: 'Analytics/Reporting', severity: 'medium' },
    { id: 7, field: 'Phone Number', purpose: 'Customer Onboarding & Verification', date: '2025-03-25', accessedBy: 'Analytics/Reporting', severity: 'medium' },
    { id: 8, field: 'Aadhar Number', purpose: 'Compliance', date: '2025-03-20', accessedBy: 'Customer Service', severity: 'high' }
  ];

  // Get filtered data based on search query
  const filteredData = accessData.filter(item => 
    item.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.accessedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get stats for summary cards
  const getHighSeverityCount = () => accessData.filter(item => item.severity === 'high').length;
  const getUniqueAccessors = () => [...new Set(accessData.map(item => item.accessedBy))].length;
  const getMostAccessedField = () => {
    const fields = accessData.map(item => item.field);
    return fields.sort((a, b) => 
      fields.filter(f => f === a).length - fields.filter(f => f === b).length
    ).pop();
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get severity class for visual indicator
  const getSeverityClass = (severity) => {
    switch(severity) {
      case 'high': return 'bg-rose-500';
      case 'medium': return 'bg-amber-400';
      case 'low': return 'bg-emerald-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Top navigation */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-slate-800">Data Privacy Portal</h1>
              <nav className="flex space-x-6">
                <button 
                  className={`px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-2 ${activeTab === 'kyc' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-slate-800'}`}
                  onClick={() => setActiveTab('kyc')}
                >
                  <User size={18} />
                  <span>KYC Form</span>
                </button>
                <button 
                  className={`px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-2 ${activeTab === 'report' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-slate-800'}`}
                  onClick={() => setActiveTab('report')}
                >
                  <Eye size={18} />
                  <span>Data Access Report</span>
                </button>
                <button 
                  className={`px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-2 ${activeTab === 'consent' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-slate-800'}`}
                  onClick={() => setActiveTab('consent')}
                >
                  <Shield size={18} />
                  <span>Consent Management</span>
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 hover:bg-indigo-700 transition-colors shadow-sm">
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Data Access Report</h2>
          <p className="text-slate-500">Monitor and review all access to sensitive data fields</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">High Sensitivity Access</p>
                <p className="text-3xl font-semibold text-slate-800 mt-2">{getHighSeverityCount()}</p>
              </div>
              <div className="bg-rose-100 p-3 rounded-full text-rose-600">
                <AlertTriangle size={22} />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">From previous period</span>
                <span className="font-medium text-rose-600">+12.5%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Unique Departments</p>
                <p className="text-3xl font-semibold text-slate-800 mt-2">{getUniqueAccessors()}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                <User size={22} />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">From previous period</span>
                <span className="font-medium text-emerald-600">No change</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Most Accessed Field</p>
                <p className="text-3xl font-semibold text-slate-800 mt-2">{getMostAccessedField()}</p>
              </div>
              <div className="bg-teal-100 p-3 rounded-full text-teal-600">
                <Eye size={22} />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">From previous period</span>
                <span className="font-medium text-slate-700">Same as previous</span>
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
                placeholder="Search data fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            </div>
            <div className="relative">
              <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm">
                <Filter size={16} />
                <span>Filter</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-slate-500">Time period:</span>
            <div className="relative">
              <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
                <Calendar size={16} />
                <span>{selectedPeriod}</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Data table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Data Field</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Purpose of Access</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Accessed On</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Accessed By</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sensitivity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{item.field}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.purpose}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{formatDate(item.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.accessedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.severity === 'high' ? 'bg-rose-50 text-rose-700' : 
                        item.severity === 'medium' ? 'bg-amber-50 text-amber-700' : 
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getSeverityClass(item.severity)}`}></span>
                        {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-slate-200 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-200 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-600">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredData.length}</span> of{' '}
                  <span className="font-medium">{filteredData.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
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
        </div>
      </div>
    </div>
  );
};

export default DataAccessReport;