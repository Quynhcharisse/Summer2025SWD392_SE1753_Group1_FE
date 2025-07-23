import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@atoms";
import dayjs from "dayjs";
import {
  getClassDetail,
  getClassScheduleList,
  getScheduleActivityList,
  deleteActivitiesByDayAndSchedule,
  getAssignedStudentsOfClass,
  exportStudentsOfClass,
} from "../../../api/services/classService";
import { useSnackbar } from "notistack";

const ViewClassByEducation = () => {
  const { id: classId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [classDetails, setClassDetails] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [exportingStudents, setExportingStudents] = useState(false);

  // Helper function to handle errors
  const handleFetchError = (error) => {
    //     console.error("Error fetching data:", error);

    if (error.response?.status === 403) {
      enqueueSnackbar(
        "Access denied. You may not have permission to view this class.",
        { variant: "error" }
      );
    } else if (error.response?.status === 404) {
      enqueueSnackbar("Class not found. Please check the class ID.", {
        variant: "error",
      });
    } else {
      enqueueSnackbar("Failed to load class data", { variant: "error" });
    }
  };

  // Fetch activities for selected schedule
  const fetchActivitiesForSchedule = async (scheduleId) => {
    if (!scheduleId) return;

    setActivitiesLoading(true);
    try {
      const activityResponse = await getScheduleActivityList(scheduleId);

      const activityData = Array.isArray(activityResponse.data)
        ? activityResponse.data
        : activityResponse.data?.data ||
          activityResponse.data?.activities ||
          [];

      //       console.log(

      setActivities(activityData);
    } catch (error) {
      //       console.error(

      setActivities([]);
      handleFetchError(error);
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Main fetch function for class details and schedules
  const fetchClassData = async () => {
    setLoading(true);
    try {
      //       console.log("Fetching class data for classId:", classId);

      const [classResponse, scheduleResponse] = await Promise.all([
        getClassDetail(classId),
        getClassScheduleList(classId),
      ]);

      //       console.log("Class detail response:", classResponse);
      //       console.log("Schedule response:", scheduleResponse);
      //       console.log("Setting classDetails to:", classResponse.data);

      // Extract the actual data from the response
      const actualClassData = classResponse.data?.data || classResponse.data;
      //       console.log("Actual class data:", actualClassData);
      setClassDetails(actualClassData);

      const schedulesData = Array.isArray(scheduleResponse.data)
        ? scheduleResponse.data
        : scheduleResponse.data?.data || scheduleResponse.data?.schedules || [];

      //       console.log("Processed schedules data:", schedulesData);
      setSchedules(schedulesData);

      // Auto-select first schedule if available and fetch its activities
      if (schedulesData.length > 0) {
        const firstSchedule = schedulesData[0];
        setSelectedSchedule(firstSchedule);
        await fetchActivitiesForSchedule(firstSchedule.id);
      } else {
        // Clear activities if no schedules
        setSelectedSchedule(null);
        setActivities([]);
      }

      enqueueSnackbar("Class data refreshed successfully", {
        variant: "success",
      });
    } catch (error) {
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle schedule selection change
  const handleScheduleChange = async (scheduleId) => {
    const schedule = schedules.find((s) => s.id === parseInt(scheduleId));
    setSelectedSchedule(schedule);
    await fetchActivitiesForSchedule(scheduleId);
  };

  // Handle delete activities
  const handleDeleteActivities = async (date) => {
    if (!selectedSchedule) return;

    try {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      //       console.log(

      await deleteActivitiesByDayAndSchedule(
        selectedSchedule.id,
        formattedDate
      );

      // Refresh activities for the current schedule
      await fetchActivitiesForSchedule(selectedSchedule.id);

      enqueueSnackbar("Activities deleted successfully", {
        variant: "success",
      });
    } catch (error) {
      //       console.error("Error deleting activities:", error);

      if (error.response?.status === 403) {
        enqueueSnackbar(
          "Access denied. You may not have permission to delete activities.",
          { variant: "error" }
        );
      } else if (error.response?.status === 404) {
        enqueueSnackbar("Activities not found or already deleted.", {
          variant: "warning",
        });
      } else {
        enqueueSnackbar("Failed to delete activities", { variant: "error" });
      }
    }
  };

  // Fetch students list for the class
  const fetchStudentsList = async () => {
    setStudentsLoading(true);
    try {
      //       console.log("Fetching students for classId:", classId);
      const response = await getAssignedStudentsOfClass(classId);
      //       console.log("Students response:", response);

      const studentsData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      //       console.log("Processed students data:", studentsData);
      setStudents(studentsData);

      enqueueSnackbar(`Loaded ${studentsData.length} students successfully`, {
        variant: "success",
      });
    } catch (error) {
      //       console.error("Error fetching students:", error);
      setStudents([]);
      handleFetchError(error);
    } finally {
      setStudentsLoading(false);
    }
  };

  // Handle export students
  const handleExportStudents = async () => {
    setExportingStudents(true);
    try {
      //       console.log("Exporting students for classId:", classId);
      const response = await exportStudentsOfClass(classId);

      // Create blob and download file
      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Get filename from response headers or use default
      const contentDisposition = response.headers["content-disposition"];
      let filename = `class_${
        classDetails?.name || classId
      }_students_${dayjs().format("YYYY-MM-DD")}.xlsx`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch?.[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      enqueueSnackbar("Students list exported successfully", {
        variant: "success",
      });
    } catch (error) {
      //       console.error("Error exporting students:", error);

      if (error.response?.status === 403) {
        enqueueSnackbar(
          "Access denied. You may not have permission to export student data.",
          { variant: "error" }
        );
      } else if (error.response?.status === 404) {
        enqueueSnackbar("No students found to export.", {
          variant: "warning",
        });
      } else {
        enqueueSnackbar("Failed to export students list", { variant: "error" });
      }
    } finally {
      setExportingStudents(false);
    }
  };

  // Handle view students (toggle and fetch if needed)
  const handleViewStudents = async () => {
    if (!showStudents) {
      // If not showing and no students loaded, fetch them
      if (students.length === 0) {
        await fetchStudentsList();
      }
    }
    setShowStudents(!showStudents);
  };

  // Get unique time slots from activities
  const getTimeSlots = () => {
    const timeSlots = new Set();

    activities.forEach((dayData) => {
      dayData.activities?.forEach((activity) => {
        const timeSlot = `${activity.startTime} - ${activity.endTime}`;
        timeSlots.add(timeSlot);
      });
    });

    return Array.from(timeSlots).sort((a, b) => {
      const timeA = a.split(" - ")[0];
      const timeB = b.split(" - ")[0];
      return timeA.localeCompare(timeB);
    });
  };

  // Get activity for specific day and time slot
  const getActivityForDayAndTime = (dayOfWeek, startTime, endTime) => {
    const dayData = activities.find((day) => day.dayOfWeek === dayOfWeek);
    if (!dayData) return null;

    return (
      dayData.activities?.find(
        (activity) =>
          activity.startTime === startTime && activity.endTime === endTime
      ) || null
    );
  };

  useEffect(() => {
    if (classId) {
      fetchClassData();
    } else {
      //       console.error("No classId provided");
      enqueueSnackbar("No class ID provided", { variant: "error" });
      setLoading(false);
    }
  }, [classId, enqueueSnackbar]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading class data...</p>
          <p className="text-xs text-gray-400 mt-2">Class ID: {classId}</p>
        </div>
      </div>
    );
  }

  if (!classDetails) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Unable to load class details.</p>
          <p className="text-sm text-gray-400 mt-2">Class ID: {classId}</p>
          <p className="text-sm text-gray-400">
            Please check your permissions or try again later.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              fetchClassData();
            }}
            className="mt-2"
            disabled={loading}
          >
            {loading ? "Loading..." : "Retry Load All Data"}
          </Button>
        </div>
      </div>
    );
  }

  const weekDays = [
    { key: "MONDAY", label: "Monday" },
    { key: "TUESDAY", label: "Tuesday" },
    { key: "WEDNESDAY", label: "Wednesday" },
    { key: "THURSDAY", label: "Thursday" },
    { key: "FRIDAY", label: "Friday" },
  ];

  const timeSlots = getTimeSlots();
  const isRefreshing = loading || activitiesLoading;
  const refreshButtonText = isRefreshing ? "Refreshing..." : "Refresh All Data";

  return (
    <div className="p-4">
      {/* Debug Panel - Remove in production */}

      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Class: {classDetails?.name}</h1>
          <div className="mt-2 text-sm text-gray-600">
            <p className="mb-1">
              Grade:{" "}
              <span className="font-medium">
                {classDetails?.grade || "N/A"}
              </span>
            </p>
            <p className="mb-1">
              Year:{" "}
              <span className="font-medium">{classDetails?.year || "N/A"}</span>
            </p>
            <p className="mb-1">
              Status:{" "}
              <span
                className={`font-medium capitalize ${
                  classDetails?.status === "active"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {classDetails?.status || "N/A"}
              </span>
            </p>
            <p className="mb-1">
              Teacher:{" "}
              <span className="font-medium">
                {classDetails?.teacherName || "N/A"}
              </span>
            </p>
            <p className="mb-1">
              Teacher Email:{" "}
              <span className="font-medium">
                {classDetails?.teacherEmail || "N/A"}
              </span>
            </p>
            <p className="mb-1">
              Teacher Phone:{" "}
              <span className="font-medium">
                {classDetails?.teacherPhoneNumber || "N/A"}
              </span>
            </p>
            <p className="mb-1">
              Students:{" "}
              <span className="font-medium">
                {classDetails?.numberStudents || 0}
              </span>
            </p>
            <p className="mb-1">
              Start Date:{" "}
              <span className="font-medium">
                {classDetails?.startDate
                  ? dayjs(classDetails.startDate).format("MMM DD, YYYY")
                  : "N/A"}
              </span>
            </p>
            <p className="mb-1">
              End Date:{" "}
              <span className="font-medium">
                {classDetails?.endDate
                  ? dayjs(classDetails.endDate).format("MMM DD, YYYY")
                  : "N/A"}
              </span>
            </p>
            <p className="mb-1">
              Syllabus:{" "}
              <span className="font-medium">
                {classDetails?.syllabusName || "N/A"}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleViewStudents}
            disabled={studentsLoading}
          >
            {studentsLoading
              ? "Loading..."
              : showStudents
              ? "Hide Students"
              : "Show Assigned Students"}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportStudents}
            disabled={exportingStudents || !classDetails}
          >
            {exportingStudents ? "Exporting..." : "Export Students"}
          </Button>
        </div>
      </div>

      {/* Students Section */}
      {showStudents && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-purple-800">
              Assigned Students
            </h3>
            <div className="text-sm text-purple-600 flex items-center gap-4">
              <span className="font-medium">
                {students.length} students enrolled
              </span>
              <Button
                variant="secondary"
                size="xs"
                onClick={fetchStudentsList}
                disabled={studentsLoading}
              >
                {studentsLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>

          {studentsLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto mb-2"></div>
                <p className="text-purple-600">Loading students...</p>
              </div>
            </div>
          ) : students.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-purple-700 text-lg">
                      {student.name}
                    </h4>
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                      ID: {student.id}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium text-gray-700">Gender:</span>
                      <span className="ml-1 text-gray-600 capitalize">
                        {student.gender}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium text-gray-700">
                        Birth Date:
                      </span>
                      <span className="ml-1 text-gray-600">
                        {dayjs(student.dateOfBirth).format("MMM DD, YYYY")}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium text-gray-700">Age:</span>
                      <span className="ml-1 text-gray-600">
                        {dayjs().diff(dayjs(student.dateOfBirth), "year")} years
                        old
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium text-gray-700">
                        Place of Birth:
                      </span>
                      <span className="ml-1 text-gray-600">
                        {student.placeOfBirth}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border">
              <p className="text-gray-500 text-lg">
                No students assigned to this class yet.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Contact your administrator to assign students to this class.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Lessons Section */}
      {classDetails.lessonList && classDetails.lessonList.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-blue-800">
              Lessons in Syllabus
            </h3>
            <div className="text-sm text-blue-600">
              <span className="font-medium">
                {classDetails.lessonList.length} lessons
              </span>
              <span className="mx-2">•</span>
              <span className="font-medium">
                {classDetails.lessonList.reduce(
                  (total, lesson) => total + lesson.duration,
                  0
                )}{" "}
                total hours
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classDetails.lessonList.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white p-4 rounded-lg border shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-blue-700 text-lg">
                    {lesson.topic}
                  </h4>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    ID: {lesson.id}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {lesson.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="ml-1 text-gray-600">
                      {lesson.duration} hours
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-medium text-gray-700">
                      Objective:
                    </span>
                    <span className="ml-1 text-gray-600">
                      {lesson.objective}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Overview */}
      {schedules.length > 0 && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Schedule Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-green-700">
                Available Weeks:{" "}
              </span>
              <span className="text-green-600">{schedules.length}</span>
            </div>
            <div>
              <span className="font-medium text-green-700">
                Selected Week:{" "}
              </span>
              <span className="text-green-600">
                {selectedSchedule?.name || "None"}
              </span>
            </div>
            <div>
              <span className="font-medium text-green-700">
                Total Activities:{" "}
              </span>
              <span className="text-green-600">
                {activities.reduce(
                  (total, dayData) => total + (dayData.activities?.length || 0),
                  0
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Activities Schedule Table */}
      <div className="flex items-center justify-end gap-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="schedule-select"
            className="text-sm font-medium text-gray-700"
          >
            Select Week:
          </label>
          <select
            id="schedule-select"
            value={selectedSchedule?.id || ""}
            onChange={(e) => handleScheduleChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={schedules.length === 0}
          >
            <option value="">Select a week</option>
            {schedules.map((schedule) => (
              <option key={schedule.id} value={schedule.id}>
                {schedule.name}
              </option>
            ))}
          </select>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            //             console.log('Refresh button clicked');
            fetchClassData();
          }}
          disabled={isRefreshing}
        >
          {refreshButtonText}
        </Button>
      </div>
      {selectedSchedule ? (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          {activitiesLoading ? (
            <div className="flex justify-center items-center h-32 bg-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading activities...</p>
              </div>
            </div>
          ) : timeSlots.length > 0 ? (
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-3 bg-gray-50 text-left">
                    <div className="font-semibold">Time Slot</div>
                  </th>
                  {weekDays.map((day) => {
                    const dayData = activities.find(
                      (d) => d.dayOfWeek === day.key
                    );
                    return (
                      <th
                        key={day.key}
                        className="border border-gray-300 p-3 bg-gray-50"
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">{day.label}</span>
                          {dayData && (
                            <>
                              <span className="text-xs text-gray-500 mt-1">
                                {dayjs(dayData.date).format("MMM DD")}
                              </span>
                              <Button
                                variant="danger"
                                size="sm"
                                className="mt-2 text-xs"
                                onClick={() =>
                                  handleDeleteActivities(dayData.date)
                                }
                              >
                                Delete Day Activities
                              </Button>
                            </>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot) => {
                  const [startTime, endTime] = timeSlot.split(" - ");
                  return (
                    <tr key={timeSlot} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3 font-medium bg-gray-50">
                        {timeSlot}
                      </td>
                      {weekDays.map((day) => {
                        const activity = getActivityForDayAndTime(
                          day.key,
                          startTime,
                          endTime
                        );
                        return (
                          <td
                            key={`${timeSlot}-${day.key}`}
                            className="border border-gray-300 p-3 align-top"
                          >
                            {activity ? (
                              <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                                <div className="font-medium text-blue-800">
                                  {activity.name}
                                </div>
                                <div className="text-xs text-blue-600 mt-1">
                                  Syllabus: {activity.syllabusName}
                                </div>
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400 italic text-center">
                                No activity
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border">
              <p className="text-gray-500 text-lg">
                No activities found for {selectedSchedule.name}.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Activities may not be scheduled for this week yet.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            {schedules.length === 0
              ? "No schedules found for this class."
              : "Please select a week to view activities."}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {schedules.length === 0
              ? "Contact your administrator to add schedules."
              : "Use the dropdown above to choose a week."}
          </p>
        </div>
      )}

      {/* Students Section */}
    </div>
  );
};
export default ViewClassByEducation;
