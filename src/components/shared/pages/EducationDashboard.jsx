import React from 'react';
import { BookOpen, Users, TrendingUp, Calendar, FileText, Award, Clock, Target } from 'lucide-react';

const EducationDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Education Dashboard</h1>
        <p className="text-green-100">Quản lý chương trình giáo dục và học tập</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng số lớp</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-xs text-green-600">Hoạt động tốt</p>
            </div>
            <Users className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chương trình học</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-xs text-blue-600">Đang triển khai</p>
            </div>
            <BookOpen className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tiến độ học tập</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
              <p className="text-xs text-yellow-600">Trên mục tiêu</p>
            </div>
            <Target className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đánh giá tháng</p>
              <p className="text-2xl font-bold text-gray-900">95</p>
              <p className="text-xs text-purple-600">Điểm trung bình</p>
            </div>
            <Award className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-green-600" />
            Hành động nhanh
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <p className="font-medium text-green-900">Cập nhật chương trình học</p>
              <p className="text-sm text-green-600">Chỉnh sửa và phê duyệt curriculum</p>
            </button>
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <p className="font-medium text-blue-900">Xem báo cáo học tập</p>
              <p className="text-sm text-blue-600">Phân tích tiến độ các lớp học</p>
            </button>
            <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <p className="font-medium text-purple-900">Quản lý đánh giá</p>
              <p className="text-sm text-purple-600">Thiết lập tiêu chí đánh giá học sinh</p>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-gray-600" />
            Hoạt động gần đây
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Cập nhật chương trình Toán học</p>
                <p className="text-xs text-gray-500">1 giờ trước</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Báo cáo tiến độ lớp Mầm 1A</p>
                <p className="text-xs text-gray-500">3 giờ trước</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Phê duyệt tài liệu học tập mới</p>
                <p className="text-xs text-gray-500">5 giờ trước</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Đánh giá định kỳ học sinh</p>
                <p className="text-xs text-gray-500">1 ngày trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Overview */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-green-600" />
          Tổng quan chương trình học
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-red-900">Toán học</h4>
              <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">12 lớp</span>
            </div>
            <p className="text-sm text-red-700">Phát triển tư duy logic và số học cơ bản</p>
            <div className="mt-3 bg-red-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{width: '85%'}}></div>
            </div>
            <p className="text-xs text-red-600 mt-1">Tiến độ: 85%</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-blue-900">Ngôn ngữ</h4>
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">12 lớp</span>
            </div>
            <p className="text-sm text-blue-700">Phát triển kỹ năng giao tiếp và đọc viết</p>
            <div className="mt-3 bg-blue-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{width: '92%'}}></div>
            </div>
            <p className="text-xs text-blue-600 mt-1">Tiến độ: 92%</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-green-900">Khoa học</h4>
              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">8 lớp</span>
            </div>
            <p className="text-sm text-green-700">Khám phá thế giới xung quanh</p>
            <div className="mt-3 bg-green-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{width: '78%'}}></div>
            </div>
            <p className="text-xs text-green-600 mt-1">Tiến độ: 78%</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-yellow-900">Nghệ thuật</h4>
              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">10 lớp</span>
            </div>
            <p className="text-sm text-yellow-700">Phát triển khả năng sáng tạo</p>
            <div className="mt-3 bg-yellow-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{width: '88%'}}></div>
            </div>
            <p className="text-xs text-yellow-600 mt-1">Tiến độ: 88%</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-purple-900">Thể chất</h4>
              <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">12 lớp</span>
            </div>
            <p className="text-sm text-purple-700">Phát triển thể lực và vận động</p>
            <div className="mt-3 bg-purple-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{width: '95%'}}></div>
            </div>
            <p className="text-xs text-purple-600 mt-1">Tiến độ: 95%</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-teal-900">Xã hội</h4>
              <span className="text-xs bg-teal-200 text-teal-800 px-2 py-1 rounded-full">8 lớp</span>
            </div>
            <p className="text-sm text-teal-700">Kỹ năng giao tiếp xã hội</p>
            <div className="mt-3 bg-teal-200 rounded-full h-2">
              <div className="bg-teal-500 h-2 rounded-full" style={{width: '82%'}}></div>
            </div>
            <p className="text-xs text-teal-600 mt-1">Tiến độ: 82%</p>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Sự kiện sắp tới
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Họp đánh giá chương trình</p>
              <p className="text-sm text-gray-600">Thứ 3, 9:00 AM - Phòng họp giáo dục</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Quan trọng
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Hội thảo phương pháp giảng dạy</p>
              <p className="text-sm text-gray-600">Thứ 5, 2:00 PM - Hội trường</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Đào tạo
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Kiểm tra chất lượng giáo dục</p>
              <p className="text-sm text-gray-600">Chủ nhật, 8:00 AM - Tất cả lớp</p>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              Đánh giá
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationDashboard;
