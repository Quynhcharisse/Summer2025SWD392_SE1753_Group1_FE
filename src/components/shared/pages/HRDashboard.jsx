import {
  ChevronRight,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HRDashboard = () => {
  const navigate = useNavigate();

  const handleQuickAction = (path) => {
    navigate(path);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-2">HR Dashboard</h1>
        <p className="text-blue-100">
          Human Resources management and activities
        </p>
      </div>

      {/* Stats Cards */}

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => handleQuickAction("/user/hr/teachers")}
              className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">
                    Teacher Management
                  </p>
                  <p className="text-sm text-blue-600">
                    View and manage teacher records
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            <button
              onClick={() => handleQuickAction("/user/hr/parents")}
              className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-900">
                    Parent Management
                  </p>
                  <p className="text-sm text-green-600">
                    View and export parent information
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            <button
              onClick={() => handleQuickAction("/user/hr/recruitment")}
              className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-purple-900">Recruitment</p>
                  <p className="text-sm text-purple-600">
                    Post job openings and review applications
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
