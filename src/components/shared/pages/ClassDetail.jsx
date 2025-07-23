import {
  getClassDetail,
  getClassesOfStudent,
  getClassScheduleList,
  getScheduleActivityList,
} from "@/api/services/classService";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Badge status style theo status
const STATUS_STYLES = {
  active: {
    badge: {
      background: "#f0fff4",
      color: "#23a963",
      border: "1.5px solid #23a963",
    },
    label: "Active",
  },
  in_progress: {
    badge: {
      background: "#bae6fd",
      color: "#0ea5e9",
      border: "1.5px solid #0ea5e9",
    },
    label: "In Progress",
  },
  closed: {
    badge: {
      background: "#f3f4f6",
      color: "#64748b",
      border: "1.5px solid #94a3b8",
    },
    label: "Closed",
  },
};

const getStatusProps = (status) => {
  const key = (status || "active").toLowerCase();
  return STATUS_STYLES[key] || STATUS_STYLES.active;
};

const SCHEDULE_OVERVIEW_BG = "#FFF8E1";
const weekDays = [
  { key: "MONDAY", label: "Monday" },
  { key: "TUESDAY", label: "Tuesday" },
  { key: "WEDNESDAY", label: "Wednesday" },
  { key: "THURSDAY", label: "Thursday" },
  { key: "FRIDAY", label: "Friday" },
];

const ClassDetail = () => {
  const { childId } = useParams();
  const [classList, setClassList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [classDetails, setClassDetails] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getClassesOfStudent(childId).then((res) => {
      const arr = res.data.data || [];
      setClassList(arr);
      if (arr.length) setSelectedClassId(arr[0].id);
    });
  }, [childId]);

  useEffect(() => {
    if (!selectedClassId) return;
    setLoading(true);
    Promise.all([
      getClassDetail(selectedClassId),
      getClassScheduleList(selectedClassId),
    ])
      .then(([classRes, scheduleRes]) => {
        setClassDetails(classRes.data?.data || classRes.data);
        const sc = Array.isArray(scheduleRes.data)
          ? scheduleRes.data
          : scheduleRes.data?.data || [];
        setSchedules(sc);
        if (sc.length) setSelectedSchedule(sc[0]);
        else setSelectedSchedule(null);
      })
      .finally(() => setLoading(false));
  }, [selectedClassId]);

  useEffect(() => {
    if (!selectedSchedule) return setActivities([]);
    getScheduleActivityList(selectedSchedule.id).then((res) => {
      setActivities(Array.isArray(res.data) ? res.data : res.data?.data || []);
    });
  }, [selectedSchedule]);

  // Map dayOfWeek -> date
  const dayOfWeekToDate = {};
  activities.forEach((day) => {
    dayOfWeekToDate[day.dayOfWeek] = day.date;
  });

  // Time slots
  const getTimeSlots = () => {
    const timeSlots = new Set();
    activities.forEach((dayData) => {
      dayData.activities?.forEach((activity) => {
        timeSlots.add(`${activity.startTime} - ${activity.endTime}`);
      });
    });
    return Array.from(timeSlots).sort();
  };
  const timeSlots = getTimeSlots();

  const getActivityForDayAndTime = (dayOfWeek, startTime, endTime) => {
    const dayData = activities.find((d) => d.dayOfWeek === dayOfWeek);
    if (!dayData) return null;
    return dayData.activities?.find(
      (a) => a.startTime === startTime && a.endTime === endTime
    );
  };

  // Style badge status
  const statusProps = getStatusProps(classDetails?.status);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-7 bg-[#f8fafc] min-h-[85vh]">
      {/* Header + Select */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-0">
          Class Detail
        </h1>
        <select
          className="border-2 border-blue-400 bg-white rounded-xl px-4 py-2 text-lg font-semibold shadow-md min-w-[250px] focus:outline-blue-400"
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
        >
          {classList.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Class Info */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : classDetails ? (
        <>
          <div
            className="rounded-2xl mb-8 shadow-md px-6 py-5"
            style={{
              border: "2px solid #222", // Viền đen
              background: "#fff", // Nền trắng
              borderRadius: 20,
              marginBottom: 36,
            }}
          >
            <div className="flex flex-wrap justify-between items-center mb-2">
              <div>
                <h2 className="text-2xl font-bold mb-1 inline-block mr-6">
                  Class: {classDetails.name}
                </h2>
                <span
                  className="inline-block font-semibold text-base rounded-lg px-3 py-1 ml-1"
                  style={statusProps.badge}
                >
                  {statusProps.label}
                </span>
              </div>
            </div>
            <div className="text-lg font-normal">
              <div>
                Grade: <b>{classDetails.grade}</b>
              </div>
              <div>
                Year: <b>{classDetails.year}</b>
              </div>
              <div>Teacher Name: {classDetails.teacherName}</div>
              <div>
                Teacher Email:{" "}
                <a
                  href={`mailto:${classDetails.teacherEmail}`}
                  className="underline"
                >
                  {classDetails.teacherEmail}
                </a>
              </div>
              <div>Teacher Phone: {classDetails.teacherPhoneNumber || "-"}</div>
              <div>
                Students: <b>{classDetails.numberStudents}</b>
              </div>
              <div>
                Start Date:{" "}
                <b>{dayjs(classDetails.startDate).format("MMM DD, YYYY")}</b>
              </div>
              <div>
                End Date:{" "}
                <b>{dayjs(classDetails.endDate).format("MMM DD, YYYY")}</b>
              </div>
              <div>
                Syllabus: <b>{classDetails.syllabusName}</b>
              </div>
            </div>
          </div>

          {/* Lessons in Syllabus */}
          <div
            className="mt-2 mb-8 rounded-2xl shadow px-6 py-5"
            style={{
              background: "#e9f3fe",
              border: "2px solid #222",
              borderRadius: 20,
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold text-blue-800">
                Lessons in Syllabus
              </h3>
              <div className="text-blue-800 text-lg">
                {classDetails.lessonList?.length || 0} lessons •{" "}
                {classDetails.lessonList?.reduce(
                  (acc, l) => acc + (l.duration || 0),
                  0
                )}{" "}
                total hours
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(classDetails.lessonList || []).map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-white rounded-xl px-4 py-3 flex flex-col shadow-sm"
                  // KHÔNG border ở đây
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-blue-700 text-lg">
                      {lesson.topic}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">
                      ID: {lesson.id}
                    </span>
                  </div>
                  <div className="text-gray-600">{lesson.description}</div>
                  <div className="flex gap-4 mt-3">
                    <div className="bg-blue-50 rounded px-2 py-1 text-sm">
                      <b>Duration:</b> {lesson.duration} hours
                    </div>
                    <div className="bg-blue-50 rounded px-2 py-1 text-sm">
                      <b>Objective:</b> {lesson.objective}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Section */}
          <div
            className="rounded-2xl shadow-md mb-8"
            style={{
              border: "2px solid #222",
              borderTop: "4px solid #FFB300",
              background: "#fff",
              padding: 0,
              borderRadius: 20,
            }}
          >
            {/* Schedule Overview */}
            <div
              className="rounded-t-2xl"
              style={{
                background: SCHEDULE_OVERVIEW_BG,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                padding: "20px 32px 16px 32px",
                borderBottom: "1px solid #eee",
              }}
            >
              <div className="flex justify-between items-center flex-wrap gap-y-2">
                <div className="font-bold text-lg text-[#6d4c1d]">
                  Schedule Overview
                </div>
                <div className="text-[#6d4c1d] font-semibold text-base">
                  Available Weeks: <b>{schedules.length}</b>{" "}
                  <span className="mx-2">|</span>
                  Selected Week:{" "}
                  <b>{selectedSchedule ? selectedSchedule.name : "N/A"}</b>{" "}
                  <span className="mx-2">|</span>
                  Total Activities:{" "}
                  {activities.reduce(
                    (acc, d) => acc + (d.activities?.length || 0),
                    0
                  )}
                </div>
              </div>
            </div>

            {/* Chọn tuần */}
            <div className="px-8 py-5">
              <div className="flex items-center gap-4 mb-3">
                <label
                  className="font-medium text-gray-700"
                  htmlFor="schedule-select"
                >
                  Select Week:
                </label>
                <select
                  id="schedule-select"
                  className="border rounded px-3 py-2 text-base focus:outline-blue-400"
                  value={selectedSchedule?.id || ""}
                  onChange={(e) => {
                    const sc = schedules.find(
                      (s) => s.id === Number(e.target.value)
                    );
                    setSelectedSchedule(sc);
                  }}
                >
                  {schedules.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Activities Table */}
              <div className="bg-white rounded-2xl overflow-x-auto border border-none">
                {timeSlots.length > 0 ? (
                  <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                      <tr>
                        <th className="border px-4 py-3 bg-gray-100 font-bold">
                          Time Slot
                        </th>
                        {weekDays.map((day) => (
                          <th
                            key={day.key}
                            className="border px-4 py-3 bg-gray-100"
                          >
                            <div className="font-semibold">{day.label}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {dayOfWeekToDate[day.key]
                                ? dayjs(dayOfWeekToDate[day.key]).format(
                                    "MMM DD"
                                  )
                                : ""}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map((slot) => {
                        const [startTime, endTime] = slot.split(" - ");
                        return (
                          <tr key={slot}>
                            <td className="border px-4 py-2 bg-gray-50 font-medium">
                              {slot}
                            </td>
                            {weekDays.map((day) => {
                              const activity = getActivityForDayAndTime(
                                day.key,
                                startTime,
                                endTime
                              );
                              return (
                                <td
                                  key={day.key}
                                  className="border px-4 py-2 align-top"
                                >
                                  {activity ? (
                                    <div>
                                      <div className="font-bold text-blue-700">
                                        {activity.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Syllabus: {activity.syllabusName}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="italic text-gray-400">
                                      No activity
                                    </span>
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
                  <div className="text-center text-gray-400 py-6">
                    No activities found for{" "}
                    {selectedSchedule?.name || "this week"}.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="py-8 text-center text-gray-500">No class selected.</div>
      )}
    </div>
  );
};

export default ClassDetail;
