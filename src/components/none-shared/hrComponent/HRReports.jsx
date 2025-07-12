import React, { useState } from 'react';
import { FileText, Download, Calendar, Users, TrendingUp, BarChart3, PieChart, Filter } from 'lucide-react';
import { hrService } from '@/api/services/hrService';

const HRReports = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('last30days');
  const [reportType, setReportType] = useState('overview');
  const [loading, setLoading] = useState(false);

  const handleExportReport = async (type) => {
    try {
      setLoading(true);
      let blob;
      let filename;
      
      if (type === 'teachers') {
        blob = await hrService.teachers.exportTeachers();
        filename = `teachers-report-${new Date().toISOString().split('T')[0]}.xlsx`;
      } else if (type === 'parents') {
        blob = await hrService.parents.exportParents();
        filename = `parents-report-${new Date().toISOString().split('T')[0]}.xlsx`;
      } else {
        // For other report types, you would implement specific export endpoints
//         console.warn(`Export for ${type} not implemented yet`);
        return;
      }
      
      hrService.downloadFile(blob, filename);
    } catch (error) {
//       console.error('Error exporting report:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    // Mock data for demonstration
    return {
      overview: {
        totalTeachers: 45,
        totalParents: 123,
        totalStudents: 89,
        newHiresThisMonth: 3,
        attendanceRate: 93.3,
        leaveRequests: 8
      },
      demographics: {
        teachersByGender: { male: 18, female: 27 },
        parentsByRegion: { 
          'Hà Nội': 45, 
          'Hồ Chí Minh': 38, 
          'Đà Nẵng': 22, 
          'Khác': 18 
        }
      },
      trends: {
        monthlyHires: [
          { month: 'Jan', hires: 2 },
          { month: 'Feb', hires: 1 },
          { month: 'Mar', hires: 4 },
          { month: 'Apr', hires: 3 },
          { month: 'May', hires: 2 },
          { month: 'Jun', hires: 3 }
        ]
      }
    };
  };

  const data = generateMockData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <BarChart3 className="w-8 h-8 mr-3" />
              HR Reports & Analytics
            </h1>
            <p className="text-purple-100">Generate and analyze HR data insights</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-purple-100">Last Updated</p>
            <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="overview">Overview</option>
                <option value="teachers">Teachers</option>
                <option value="parents">Parents</option>
                <option value="recruitment">Recruitment</option>
                <option value="attendance">Attendance</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="last3months">Last 3 Months</option>
                <option value="lastyear">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExportReport('teachers')}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Teachers
            </button>
            <button
              onClick={() => handleExportReport('parents')}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Parents
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teachers</p>
              <p className="text-3xl font-bold text-blue-600">{data.overview.totalTeachers}</p>
              <p className="text-sm text-green-600">+{data.overview.newHiresThisMonth} this month</p>
            </div>
            <Users className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Parents</p>
              <p className="text-3xl font-bold text-green-600">{data.overview.totalParents}</p>
              <p className="text-sm text-gray-500">Registered in system</p>
            </div>
            <Users className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-3xl font-bold text-purple-600">{data.overview.attendanceRate}%</p>
              <p className="text-sm text-gray-500">Current month</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teacher Demographics */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-600" />
            Teacher Demographics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Male Teachers</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(data.demographics.teachersByGender.male / data.overview.totalTeachers) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{data.demographics.teachersByGender.male}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Female Teachers</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-pink-600 h-2 rounded-full" 
                    style={{ width: `${(data.demographics.teachersByGender.female / data.overview.totalTeachers) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{data.demographics.teachersByGender.female}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Parent Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-green-600" />
            Parent Distribution by Region
          </h3>
          <div className="space-y-3">
            {Object.entries(data.demographics.parentsByRegion).map(([region, count]) => (
              <div key={region} className="flex items-center justify-between">
                <span className="text-gray-600">{region}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(count / data.overview.totalParents) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Hiring Trends */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
          Monthly Hiring Trends
        </h3>
        <div className="flex items-end space-x-2 h-32">
          {data.trends.monthlyHires.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="bg-purple-600 rounded-t w-full min-h-4"
                style={{ height: `${(item.hires / 4) * 100}%` }}
              ></div>
              <span className="text-xs text-gray-600 mt-2">{item.month}</span>
              <span className="text-xs font-medium text-purple-600">{item.hires}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-orange-600" />
          Action Items & Insights
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-sm font-medium text-yellow-800">Recruitment Needed</p>
            <p className="text-xs text-yellow-700">Consider hiring 2-3 more teachers for the upcoming semester</p>
          </div>
          <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm font-medium text-blue-800">Training Opportunity</p>
            <p className="text-xs text-blue-700">Schedule professional development sessions for new hires</p>
          </div>
          <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
            <p className="text-sm font-medium text-green-800">Good Performance</p>
            <p className="text-xs text-green-700">Attendance rate is above target (93.3% vs 90% target)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRReports;
