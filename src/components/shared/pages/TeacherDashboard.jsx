import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageTemplate } from "@templates";
import { Button, Badge, Spinner } from "@atoms";
import { StatCard } from "@molecules";
import { 
  Users, 
  Calendar, 
  CheckSquare, 
  MessageSquare, 
  BookOpen,
  Clock,
  UserCheck,
  FileText
} from "lucide-react";
import { isAuthenticated, getCurrentTokenData } from "@services/JWTService.jsx";
import { authService } from "../../../api/services/authService";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [classData, setClassData] = useState({});
  const [students, setStudents] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [upcomingActivities, setUpcomingActivities] = useState([]);

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        if (!isAuthenticated()) {
          navigate('/auth/login', { 
            state: { 
              returnUrl: '/user/teacher/dashboard',
              message: 'Please log in to access teacher dashboard.'
            }
          });
          return;
        }

        // Get current user
        const tokenData = getCurrentTokenData();
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser || tokenData);

        // Mock class data for now
        setClassData({
          name: 'Pre-K Class A',
          totalStudents: 15,
          enrolledStudents: 12,
          ageGroup: '4-5 years'
        });

        setStudents([
          { id: 1, name: 'Emma Johnson', age: 4, status: 'present' },
          { id: 2, name: 'Liam Smith', age: 5, status: 'present' },
          { id: 3, name: 'Sophia Brown', age: 4, status: 'absent' },
          { id: 4, name: 'Noah Davis', age: 5, status: 'present' }
        ]);

        setTodayAttendance([
          { studentId: 1, name: 'Emma Johnson', checkIn: '08:15 AM', status: 'present' },
          { studentId: 2, name: 'Liam Smith', checkIn: '08:30 AM', status: 'present' },
          { studentId: 4, name: 'Noah Davis', checkIn: '08:45 AM', status: 'present' }
        ]);

        setUpcomingActivities([
          { id: 1, title: 'Art Class', time: '10:00 AM', description: 'Painting and drawing' },
          { id: 2, title: 'Story Time', time: '02:00 PM', description: 'Reading adventure stories' },
          { id: 3, title: 'Music & Movement', time: '03:00 PM', description: 'Songs and dancing' }
        ]);

      } catch (error) {
//         console.error('Failed to load teacher dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [navigate]);

  const getAttendanceRate = () => {
    const present = todayAttendance.length;
    const total = students.length;
    return total > 0 ? Math.round((present / total) * 100) : 0;
  };

  if (loading) {
    return (
      <PageTemplate title="Teacher Dashboard">
        <div className="text-center py-8">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading information...</p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title={`Welcome, ${user?.name || 'Teacher'}`}
      subtitle={`Class Management: ${classData.name}`}
      actions={
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            size="md"
            onClick={() => navigate('/user/teacher/attendance')}
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            Attendance
          </Button>
          <Button 
            variant="primary" 
            size="md"
            onClick={() => navigate('/user/teacher/journal')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Class Journal
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={classData.totalStudents}
            description="In Class"
            icon={Users}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Present Today"
            value={todayAttendance.length}
            description={`${getAttendanceRate()}% attendance`}
            icon={UserCheck}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Today's Activities"
            value={upcomingActivities.length}
            description="Scheduled"
            icon={Calendar}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Messages"
            value={0}
            description="New Messages"
            icon={MessageSquare}
            trend={{ value: 0, isPositive: true }}
          />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Attendance and Activities */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Attendance */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Today's Attendance</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/user/teacher/attendance')}
                >
                  Manage Attendance
                </Button>
              </div>
              
              {todayAttendance.length > 0 ? (
                <div className="space-y-3">
                  {todayAttendance.map((record) => (
                    <div key={record.studentId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <UserCheck className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{record.name}</h4>
                          <p className="text-sm text-gray-600">Present at: {record.checkIn}</p>
                        </div>
                      </div>
                      <Badge variant="success">Present</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No attendance records today</p>
              )}
            </div>

            {/* Today's Activities */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Activities</h3>
              {upcomingActivities.length > 0 ? (
                <div className="space-y-3">
                  {upcomingActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No activities today</p>
              )}
            </div>
          </div>

          {/* Right Column - Class Info and Quick Actions */}
          <div className="space-y-6">
            {/* Class Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Class Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Class Name:</span>
                  <span className="font-medium">{classData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age Group:</span>
                  <span className="font-medium">{classData.ageGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{classData.enrolledStudents}/{classData.totalStudents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Today's Attendance:</span>
                  <Badge variant={getAttendanceRate() >= 80 ? "success" : "warning"}>
                    {getAttendanceRate()}%
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/user/teacher/attendance')}
                >
                  <CheckSquare className="w-4 h-4 mr-3" />
                  Take Attendance
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate(`/user/teacher/class/${classData.id}/students`)}
                >
                  <Users className="w-4 h-4 mr-3" />
                  Student List
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/user/teacher/journal')}
                >
                  <BookOpen className="w-4 h-4 mr-3" />
                  Activity Journal
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/user/teacher/messages')}
                >
                  <MessageSquare className="w-4 h-4 mr-3" />
                  Send Notification
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default TeacherDashboard;
