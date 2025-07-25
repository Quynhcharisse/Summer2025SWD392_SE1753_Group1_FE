import {
  assignAvailableStudentsAuto,
  assignStudentsToClass,
  createClass,
  deleteClass,
  getAssignedStudentsOfClass,
  getAvailableChildren,
  getClassesByYearAndGrade,
  getLessonsBySyllabus,
  getNumberOfAvailableChildren,
  getSchoolYears,
  getSyllabusByGrade,
  unassignStudentsFromClass,
} from "@api/services/classService";
import Button from "@atoms/Button";
import Input from "@atoms/Input";
import InputSelect from "@atoms/InputSelect";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Plus, View } from "lucide-react";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GRADES = [
  { value: "Seed", label: "Seed" },
  { value: "Bud", label: "Bud" },
  { value: "Leaf", label: "Leaf" },
];
const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
const TIME_SLOTS = [
  "07:00-08:00",
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
];

export default function EducationClassManage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isCreatingClass, setIsCreatingClass] = useState(false);

  // State for class list view
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for create class form
  const [isCreating, setIsCreating] = useState(false);
  const [syllabusList, setSyllabusList] = useState([]);
  const [selectedSyllabus, setSelectedSyllabus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [activities, setActivities] = useState(() => {
    const obj = {};
    DAYS.forEach((day) => {
      const slots = Array(TIME_SLOTS.length).fill(null);

      // Set default lunch time (11:00-12:00)
      const lunchTimeIndex = TIME_SLOTS.findIndex(
        (slot) => slot === "11:00-12:00"
      );
      if (lunchTimeIndex !== -1) {
        slots[lunchTimeIndex] = {
          type: "activity",
          value: "Lunch Time",
        };
      }

      // Set default nap time (12:00-13:00)
      const napTimeIndex = TIME_SLOTS.findIndex(
        (slot) => slot === "12:00-13:00"
      );
      if (napTimeIndex !== -1) {
        slots[napTimeIndex] = {
          type: "activity",
          value: "Nap Time",
        };
      }

      obj[day] = slots;
    });
    return obj;
  });

  // Popup state
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupDay, setPopupDay] = useState("");
  const [popupSlotIdx, setPopupSlotIdx] = useState(-1);
  const [popupType, setPopupType] = useState("lesson");
  const [popupLesson, setPopupLesson] = useState("");
  const [popupActivity, setPopupActivity] = useState("");
  const [lessonList, setLessonList] = useState([]);

  // State for tracking which class is being deleted
  const [deletingClassId, setDeletingClassId] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [pendingDeleteClass, setPendingDeleteClass] = useState(null); // {id, name}

  // State for assign students modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assigningClassId, setAssigningClassId] = useState(null);
  const [unassignedStudents, setUnassignedStudents] = useState([]); // [{id, name}]
  const [assignedStudents, setAssignedStudents] = useState([]); // [{id, name}]
  const [selectedUnassigned, setSelectedUnassigned] = useState([]);
  const [selectedAssigned, setSelectedAssigned] = useState([]);
  const [lessonDurations, setLessonDurations] = useState({});
  // State for number of unassigned students
  const [numUnassigned, setNumUnassigned] = useState(0);

  // State for confirmation modal when class size exceeds 20
  const [confirmModal, setConfirmModal] = useState(false);
  const [pendingAssignIds, setPendingAssignIds] = useState([]);

  // State for confirmation modal when unassigning students
  const [confirmUnassignModal, setConfirmUnassignModal] = useState(false);
  const [pendingUnassignIds, setPendingUnassignIds] = useState([]);

  // State for auto assign confirmation modal
  const [confirmAutoAssignModal, setConfirmAutoAssignModal] = useState(false);

  // Check if year is current
  const isCurrentYear = (year) => {
    if (!year) return false;
    const currentYear = new Date().getFullYear().toString();
    const yearStr = year.toString();
    return yearStr.includes(currentYear);
  };

  useEffect(() => {
    //     console.log("Fetching school years...");
    getSchoolYears()
      .then((res) => {
        //         console.log("School years response:", res.data);
        const years = (res.data.data || []).map((y) => ({
          value: y,
          label: y,
        }));
        setYears(years);
        if (years.length > 0) {
          const currentYear = new Date().getFullYear().toString();
          // Tìm năm học nào chứa năm hiện tại (VD: "2025" trong "2025–2026")
          const found = years.find((y) =>
            y.value.replace(/\s/g, "").includes(currentYear)
          );
          setSelectedYear(found ? found.value : years[0].value);
        }
      })
      .catch((error) => {
        //         console.error("Error fetching school years:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedGrade) {
      getSyllabusByGrade(selectedGrade)
        .then((res) => {
          const syllabuses = (res.data.data || []).map((s) => ({
            value: s.id,
            label: s.subject,
          }));
          setSyllabusList(syllabuses);
          if (syllabuses.length > 0) {
            setSelectedSyllabus(syllabuses[0].value);
          }
        })
        .catch((error) => {
          // console.error("Error fetching syllabus:", error);
        });
    }
  }, [selectedGrade]);

  // Reset lessons and timetable when syllabus changes in create mode
  useEffect(() => {
    if (isCreating) {
      setLessonDurations({});
      setLessonList([]);
      // Reset timetable activities to default lunch/nap
      setActivities(() => {
        const obj = {};
        DAYS.forEach((day) => {
          const slots = Array(TIME_SLOTS.length).fill(null);
          const lunchTimeIndex = TIME_SLOTS.findIndex(
            (slot) => slot === "11:00-12:00"
          );
          if (lunchTimeIndex !== -1) {
            slots[lunchTimeIndex] = { type: "activity", value: "Lunch Time" };
          }
          const napTimeIndex = TIME_SLOTS.findIndex(
            (slot) => slot === "12:00-13:00"
          );
          if (napTimeIndex !== -1) {
            slots[napTimeIndex] = { type: "activity", value: "Nap Time" };
          }
          obj[day] = slots;
        });
        return obj;
      });
    }
  }, [selectedSyllabus]);
  const getStartYear = (yearStr) => {
    if (!yearStr) return "";
    // Tách bởi - hoặc –
    return yearStr.replace(/\s/g, "").split(/[-–]/)[0];
  };
  useEffect(() => {
    if (selectedYear && selectedGrade) {
      setLoading(true);
      getClassesByYearAndGrade(getStartYear(selectedYear), selectedGrade)
        .then((res) => {
          //           console.log("Classes response:", res.data);
          setClasses(res.data.data || []);
        })
        .catch((error) => {
          //           console.error("Error fetching classes:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedYear, selectedGrade]);

  useEffect(() => {
    if (popupOpen && popupType === "lesson" && selectedSyllabus) {
      getLessonsBySyllabus(selectedSyllabus)
        .then((res) => {
          console.log("Lessons response:", res.data);
          const lessons = res.data.data || [];

          // Initialize lesson durations if not already set
          setLessonDurations((prevDurations) => {
            const newDurations = { ...prevDurations };
            lessons.forEach((lesson) => {
              if (!(lesson.id in newDurations)) {
                newDurations[lesson.id] = lesson.duration;
              }
            });
            return newDurations;
          });

          // Only show lessons with duration > 0
          setLessonList(
            lessons
              .filter((l) => (lessonDurations[l.id] ?? l.duration) > 0)
              .map((l) => {
                const remainingDuration = lessonDurations[l.id] ?? l.duration;
                return {
                  value: l.id,
                  label: `${l.topic} (${remainingDuration} remaining)`,
                  topic: l.topic,
                  duration: remainingDuration,
                  originalDuration: l.duration,
                  description: l.description,
                  toolsRequired: l.toolsRequired,
                  objective: l.objective,
                };
              })
          );
        })
        .catch((error) => {
          console.error("Error fetching lessons:", error);
        });
    }
  }, [popupOpen, popupType, selectedSyllabus, lessonDurations]);

  // Fetch number of unassigned students when year or grade changes
  useEffect(() => {
    if (selectedYear && selectedGrade) {
      getNumberOfAvailableChildren(getStartYear(selectedYear), selectedGrade)
        .then((res) => {
          setNumUnassigned(res.data.data ?? 0);
        })
        .catch(() => setNumUnassigned(0));
    } else {
      setNumUnassigned(0);
    }
  }, [selectedYear, selectedGrade]);

  const handleCellClick = (day, slotIdx) => {
    const existingActivity = activities[day][slotIdx];

    // If there's an existing lesson, restore its duration when replacing/removing
    if (existingActivity && existingActivity.type === "lesson") {
      setLessonDurations((prev) => {
        const newDurations = { ...prev };
        newDurations[existingActivity.value] =
          (newDurations[existingActivity.value] ?? 0) + 1;
        return newDurations;
      });
    }

    setPopupDay(day);
    setPopupSlotIdx(slotIdx);
    setPopupType("lesson");
    setPopupLesson("");
    setPopupActivity("");
    setPopupOpen(true);
  };
  console.log("lessonList", lessonList);

  const handlePopupSave = () => {
    if (popupType === "lesson" && popupLesson) {
      // Find the lesson info
      const selectedLessonInfo = lessonList.find(
        (l) => String(l.value) === String(popupLesson)
      );

      // Check if lesson has duration remaining
      const currentDuration =
        lessonDurations[popupLesson] ??
        selectedLessonInfo?.originalDuration ??
        0;
      if (currentDuration <= 0) {
        enqueueSnackbar("This lesson has no remaining duration!", {
          variant: "warning",
        });
        return;
      }

      // Decrement the duration for the selected lesson
      setLessonDurations((prev) => {
        const newDurations = { ...prev };
        newDurations[popupLesson] = Math.max(
          0,
          (newDurations[popupLesson] ??
            selectedLessonInfo?.originalDuration ??
            0) - 1
        );
        return newDurations;
      });

      // Update activities
      setActivities((prev) => {
        const updated = { ...prev };
        updated[popupDay] = [...updated[popupDay]];

        // Check if there's an existing lesson in this slot and restore its duration
        const existingActivity = updated[popupDay][popupSlotIdx];
        if (
          existingActivity &&
          existingActivity.type === "lesson" &&
          existingActivity.value !== popupLesson
        ) {
          setLessonDurations((prevDurations) => {
            const restored = { ...prevDurations };
            restored[existingActivity.value] =
              (restored[existingActivity.value] ?? 0) + 1;
            return restored;
          });
        }

        updated[popupDay][popupSlotIdx] = {
          type: "lesson",
          value: popupLesson,
          topic: selectedLessonInfo?.topic || popupLesson,
        };
        return updated;
      });

      enqueueSnackbar(`Added lesson: ${selectedLessonInfo?.topic}`, {
        variant: "success",
      });
    } else if (popupType === "activity" && popupActivity) {
      // Handle activity case
      setActivities((prev) => {
        const updated = { ...prev };
        updated[popupDay] = [...updated[popupDay]];

        // Check if there's an existing lesson in this slot and restore its duration
        const existingActivity = updated[popupDay][popupSlotIdx];
        if (existingActivity && existingActivity.type === "lesson") {
          setLessonDurations((prevDurations) => {
            const restored = { ...prevDurations };
            restored[existingActivity.value] =
              (restored[existingActivity.value] ?? 0) + 1;
            return restored;
          });
        }

        updated[popupDay][popupSlotIdx] = {
          type: "activity",
          value: popupActivity,
        };
        return updated;
      });

      enqueueSnackbar(`Added activity: ${popupActivity}`, {
        variant: "success",
      });
    }

    setPopupOpen(false);
  };

  const handlePopupClose = () => setPopupOpen(false);

  // Navigate to class detail page
  const handleViewClass = (classId) => {
    navigate(`/user/education/class/view/${classId}`);
  };

  // Delete class function
  const handleDeleteClass = (classId, className) => {
    setPendingDeleteClass({ id: classId, name: className });
    setDeleteConfirmModal(true);
  };

  const confirmDeleteClass = async () => {
    if (!pendingDeleteClass) return;
    setDeletingClassId(pendingDeleteClass.id);
    setDeleteConfirmModal(false);
    try {
      await deleteClass(pendingDeleteClass.id);
      // Refresh class list after delete
      const classListResponse = await getClassesByYearAndGrade(
        getStartYear(selectedYear),
        selectedGrade
      );
      getNumberOfAvailableChildren(getStartYear(selectedYear), selectedGrade)
        .then((res) => {
          setNumUnassigned(res.data.data ?? 0);
        })
        .catch(() => setNumUnassigned(0));
      setClasses(classListResponse.data.data || []);
      enqueueSnackbar(
        `Deleted class ${pendingDeleteClass.name} successfully!`,
        {
          variant: "success",
        }
      );
    } catch (error) {
      const msg =
        error?.response?.data?.message ===
        "Only classes with status 'ACTIVE' can be deleted"
          ? "Only classes with status 'ACTIVE' can be deleted"
          : "Delete failed!";
      enqueueSnackbar(msg, { variant: "error" });
    } finally {
      setDeletingClassId(null);
      setPendingDeleteClass(null);
    }
  };

  const cancelDeleteClass = () => {
    setDeleteConfirmModal(false);
    setPendingDeleteClass(null);
  };

  const buildActivitiesNameByDay = () => {
    const arr = [];
    DAYS.forEach((day) => {
      TIME_SLOTS.forEach((slot, idx) => {
        const act = activities[day][idx];
        if (act && act.value) {
          const [start, end] = slot.split("-");
          let name = act.value;
          if (act.type === "lesson") name = `LE_${act.topic || act.value}`;
          arr.push(`${day}-${name}-${start}-${end}`);
        }
      });
    });
    return arr;
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setIsCreatingClass(true);
    try {
      // Validate form
      if (!selectedYear || !selectedGrade || !selectedSyllabus || !startDate) {
        enqueueSnackbar(`Please fill in all required information!`, {
          variant: "error",
        });
        setIsCreatingClass(false);
        return;
      }

      // Validate that start date is a Monday
      const selectedStartDate = new Date(startDate);
      if (selectedStartDate.getDay() !== 1) {
        enqueueSnackbar(`Start date must be a Monday!`, {
          variant: "error",
        });
        setIsCreatingClass(false);
        return;
      }

      // Build activities list
      const activitiesNameByDay = buildActivitiesNameByDay();

      // Prepare payload
      const payload = {
        year: getStartYear(selectedYear),
        startDate,
        syllabusId: selectedSyllabus,
        gradeName: selectedGrade.toLowerCase(),
        activitiesNameByDay,
      };

      // Call API to create class
      const response = await createClass(payload);

      // Success handling
      enqueueSnackbar(`Created classes successfully!`, {
        variant: "success",
      });

      setIsCreating(false);

      // Refresh class list
      const classListResponse = await getClassesByYearAndGrade(
        getStartYear(selectedYear),
        selectedGrade
      );
      setClasses(classListResponse.data.data || []);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          "An error occurred while creating the class!",
        { variant: "error" }
      );
    } finally {
      // Refresh number of unassigned students
      await refreshNumUnassigned();
      setIsCreatingClass(false);
    }
  };

  // Dummy fetch students (replace with real API)
  const fetchStudentsForClass = async (classId) => {
    try {
      // Fetch unassigned students (by year & grade)
      const availableRes = await getAvailableChildren(
        getStartYear(selectedYear),
        selectedGrade,
        0,
        100
      );
      setUnassignedStudents(
        (availableRes.data.data?.data || []).map((s) => ({
          id: s.id,
          name: s.name,
        }))
      );
      // Fetch assigned students
      const assignedRes = await getAssignedStudentsOfClass(classId);
      setAssignedStudents(
        (assignedRes.data.data || []).map((s) => ({ id: s.id, name: s.name }))
      );
    } catch (err) {
      enqueueSnackbar("Failed to fetch students!", { variant: "error" });
      setUnassignedStudents([]);
      setAssignedStudents([]);
    }
  };

  const handleAssignStudents = (classId) => {
    setAssigningClassId(classId);
    setAssignModalOpen(true);
    fetchStudentsForClass(classId);
    setSelectedUnassigned([]);
    setSelectedAssigned([]);
  };

  const handleCloseAssignModal = () => {
    setAssignModalOpen(false);
    setAssigningClassId(null);
    setUnassignedStudents([]);
    setAssignedStudents([]);
    setSelectedUnassigned([]);
    setSelectedAssigned([]);
  };

  // Move selected students to assigned
  const handleAssign = async () => {
    if (!assigningClassId || selectedUnassigned.length === 0) return;

    // Use the actual number of assigned students from the modal
    const currentAssignedCount = assignedStudents.length;
    const selectedCount = selectedUnassigned.length;
    const willHaveStudents = currentAssignedCount + selectedCount;

    // Show confirmation if class will have more than 20 students
    if (willHaveStudents > 20) {
      setPendingAssignIds([...selectedUnassigned]);
      setConfirmModal(true);
      return;
    }

    // Otherwise proceed normally
    await assignStudentsThroughAPI(selectedUnassigned);
  };

  // Function to actually call the API after confirmation
  const assignStudentsThroughAPI = async (studentIds) => {
    try {
      await assignStudentsToClass(assigningClassId, studentIds);
      enqueueSnackbar("Assigned students successfully!", {
        variant: "success",
      });
      fetchStudentsForClass(assigningClassId);
      setSelectedUnassigned([]);
      refreshNumUnassigned();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to assign students!";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  // Handle confirmation from modal
  const handleConfirmAssign = async () => {
    setConfirmModal(false);
    await assignStudentsThroughAPI(pendingAssignIds);
    setPendingAssignIds([]);
  };

  // Cancel assignment
  const handleCancelAssign = () => {
    setConfirmModal(false);
    setPendingAssignIds([]);
  };

  // Remove selected students from assigned
  const handleRemove = async () => {
    if (!assigningClassId || selectedAssigned.length === 0) return;

    // Show confirmation dialog
    setPendingUnassignIds([...selectedAssigned]);
    setConfirmUnassignModal(true);
  };

  // Function to actually unassign students through API after confirmation
  const unassignStudentsThroughAPI = async (studentIds) => {
    try {
      await unassignStudentsFromClass(assigningClassId, studentIds);
      enqueueSnackbar("Unassigned students successfully!", {
        variant: "success",
      });
      fetchStudentsForClass(assigningClassId);
      setSelectedAssigned([]);
      refreshNumUnassigned();
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to unassign students!";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  // Handle confirmation from unassign modal
  const handleConfirmUnassign = async () => {
    setConfirmUnassignModal(false);
    await unassignStudentsThroughAPI(pendingUnassignIds);
    setPendingUnassignIds([]);
  };

  // Cancel unassignment
  const handleCancelUnassign = () => {
    setConfirmUnassignModal(false);
    setPendingUnassignIds([]);
  };

  // After deleting or assigning/unassigning students, also refresh number of unassigned students
  const refreshNumUnassigned = async () => {
    if (selectedYear && selectedGrade) {
      try {
        //         console.log("Refreshing number of unassigned students...");
        const res = await getNumberOfAvailableChildren(
          getStartYear(selectedYear),
          selectedGrade
        );
        //         console.log("Number of unassigned students updated:", res.data.data);
        setNumUnassigned(res.data.data ?? 0);
      } catch (error) {
        //         console.error(
        //           "Failed to refresh number of unassigned students:",
        //           error
        //         );
        // Keep current value if there's an error
      }
    }
  };

  // Auto assign all available students to classes
  const handleAutoAssign = () => {
    if (!selectedYear || !selectedGrade) {
      enqueueSnackbar("Please select year and grade first", {
        variant: "error",
      });
      return;
    }

    if (numUnassigned <= 0) {
      enqueueSnackbar("There are no unassigned students to assign", {
        variant: "info",
      });
      return;
    }

    // Show confirmation modal
    setConfirmAutoAssignModal(true);
  };

  // Handle confirmation from auto assign modal
  const handleConfirmAutoAssign = async () => {
    setConfirmAutoAssignModal(false);

    try {
      setLoading(true);
      await assignAvailableStudentsAuto(
        getStartYear(selectedYear),
        selectedGrade
      );

      // Refresh classes to show updated student counts
      const classListResponse = await getClassesByYearAndGrade(
        getStartYear(selectedYear),
        selectedGrade
      );
      setClasses(classListResponse.data.data || []);

      // Refresh unassigned students count
      await refreshNumUnassigned();

      enqueueSnackbar(`Successfully auto-assigned students to classes`, {
        variant: "success",
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to automatically assign students";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Function to reset lesson durations when creating a new class
  const resetLessonDurations = () => {
    setLessonDurations({});
    setLessonList([]);
  };

  // Function to clear a specific cell
  const handleClearCell = (day, slotIdx) => {
    const existingActivity = activities[day][slotIdx];

    // If there's an existing lesson, restore its duration
    if (existingActivity && existingActivity.type === "lesson") {
      setLessonDurations((prev) => {
        const newDurations = { ...prev };
        newDurations[existingActivity.value] =
          (newDurations[existingActivity.value] ?? 0) + 1;
        return newDurations;
      });
      enqueueSnackbar(`Removed lesson: ${existingActivity.topic}`, {
        variant: "info",
      });
    } else if (existingActivity && existingActivity.type === "activity") {
      enqueueSnackbar(`Removed activity: ${existingActivity.value}`, {
        variant: "info",
      });
    }

    setActivities((prev) => {
      const updated = { ...prev };
      updated[day] = [...updated[day]];
      updated[day][slotIdx] = null;
      return updated;
    });
  };

  // Cancel auto assignment
  const handleCancelAutoAssign = () => {
    setConfirmAutoAssignModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-theme-primary">
        Class Management by School Year
      </h2>

      {/* Class list view */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Select year</h3>
          <InputSelect
            options={years}
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setIsCreating(false); // Reset create class state when changing year
            }}
            placeholder="Select year"
            size="md"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Select Grade</h3>
          <InputSelect
            options={GRADES}
            value={selectedGrade}
            onChange={(e) => {
              setSelectedGrade(e.target.value);
              setIsCreating(false); // Reset create class state when changing grade
            }}
            placeholder="Select Grade"
            size="md"
          />
        </div>
      </div>

      {/* Class list table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-md font-semibold">
            Number of unassigned students: {numUnassigned}
          </h1>
          {numUnassigned > 0 && isCurrentYear(selectedYear) && (
            <Button
              variant="primary"
              className="h-8"
              onClick={handleAutoAssign}
              disabled={!selectedYear || !selectedGrade || loading}
            >
              Auto Assign All Students
            </Button>
          )}
        </div>
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <div>
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-center">Class Name</th>
                  <th className="py-2 px-4 text-center">Grade</th>
                  <th className="py-2 px-4 text-center">Teacher</th>
                  <th className="py-2 px-4 text-center">Number of Students</th>
                  <th className="py-2 px-4 text-center">Start Date</th>
                  <th className="py-2 px-4 text-center">End Date</th>
                  <th className="py-2 px-4 text-center">Status</th>
                  <th className="py-2 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-gray-500">
                      No classes available
                    </td>
                  </tr>
                ) : (
                  classes.map((cls) => (
                    <tr key={cls.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 text-center">
                        {cls.name || `Class ${cls.id}`}
                      </td>
                      <td className="py-2 px-4 text-center">{cls.grade}</td>
                      <td className="py-2 px-4 text-center">
                        {cls.teacherName || "Unassigned"}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {cls.numberStudents || 0}
                      </td>
                      <td className="py-2 px-4 text-center">{cls.startDate}</td>
                      <td className="py-2 px-4 text-center">
                        {cls.endDate || "N/A"}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {(() => {
                          let statusClass = "bg-gray-100 text-gray-800";
                          if (cls.status === "active") {
                            statusClass = "bg-green-100 text-green-800";
                          } else if (cls.status === "inactive") {
                            statusClass = "bg-red-100 text-red-800";
                          }
                          return (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}
                            >
                              {cls.status || "N/A"}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="flex justify-center items-center">
                        <div className="flex h-10">
                          <Button
                            variant="secondary"
                            className="mr-2 h-8"
                            onClick={() => handleViewClass(cls.id)}
                          >
                            <View />
                          </Button>

                          <Button
                            variant="danger"
                            className="h-8"
                            onClick={() => handleDeleteClass(cls.id, cls.name)}
                            disabled={
                              cls.status !== "active" ||
                              deletingClassId === cls.id
                            }
                          >
                            {deletingClassId === cls.id
                              ? "Deleting..."
                              : "Delete"}
                          </Button>

                          <Button
                            variant="primary"
                            className="ml-2 h-8"
                            onClick={() => handleAssignStudents(cls.id)}
                            disabled={cls.status !== "active"}
                          >
                            <Plus />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create new class button - only show for current year */}
      {isCurrentYear(selectedYear) && numUnassigned > 0 && !isCreating && (
        <div className="text-right mb-8">
          <Button
            onClick={() => {
              // Reset lesson durations when starting to create a new class
              resetLessonDurations();

              // Initialize the activities with default lunch and nap times
              setActivities(() => {
                const obj = {};
                DAYS.forEach((day) => {
                  const slots = Array(TIME_SLOTS.length).fill(null);

                  // Set default lunch time (11:00-12:00)
                  const lunchTimeIndex = TIME_SLOTS.findIndex(
                    (slot) => slot === "11:00-12:00"
                  );
                  if (lunchTimeIndex !== -1) {
                    slots[lunchTimeIndex] = {
                      type: "activity",
                      value: "Lunch Time",
                    };
                  }

                  // Set default nap time (12:00-13:00)
                  const napTimeIndex = TIME_SLOTS.findIndex(
                    (slot) => slot === "12:00-13:00"
                  );
                  if (napTimeIndex !== -1) {
                    slots[napTimeIndex] = {
                      type: "activity",
                      value: "Nap Time",
                    };
                  }

                  obj[day] = slots;
                });
                return obj;
              });
              setIsCreating(true);
            }}
            variant="primary"
            size="md"
          >
            Create new class
          </Button>
        </div>
      )}

      {/* Create new class form */}
      {isCreating && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-bold mb-4">Create New Class</h3>
          <form onSubmit={handleCreateClass} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Syllabus <span className="text-red-600">*</span>
                </label>
                <InputSelect
                  options={syllabusList}
                  value={selectedSyllabus}
                  onChange={(e) => setSelectedSyllabus(e.target.value)}
                  placeholder="Select syllabus"
                  size="md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date (Must be Monday){" "}
                  <span className="text-red-600">*</span>
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                  }}
                  size="md"
                  required
                />
                {!startDate && (
                  <p className="text-sm text-red-600 mt-1">
                    Start date is required
                  </p>
                )}
                {startDate &&
                  (() => {
                    const date = new Date(startDate);
                    const dayOfWeek = date.getDay();
                    if (dayOfWeek === 1) {
                      return (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ Start date is Monday
                        </p>
                      );
                    } else {
                      return (
                        <p className="text-sm text-red-600 mt-1">
                          Start date must be a Monday!
                        </p>
                      );
                    }
                  })()}
              </div>
            </div>

            {/* Timetable */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Timetable</h4>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-4 text-left">Time Slot</th>
                      {DAYS.map((day) => (
                        <th key={day} className="py-2 px-4 text-center">
                          {day.charAt(0) + day.slice(1).toLowerCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TIME_SLOTS.map((slot, slotIdx) => (
                      <tr key={slot} className="border-b">
                        <td className="py-2 px-4 font-medium">{slot}</td>
                        {DAYS.map((day) => (
                          <td
                            key={day}
                            className="py-2 px-4 text-center relative group"
                          >
                            <div
                              className="cursor-pointer hover:bg-blue-50 p-2 rounded min-h-[40px] flex items-center justify-center"
                              onClick={() => handleCellClick(day, slotIdx)}
                            >
                              {activities[day][slotIdx]?.type === "lesson" ? (
                                <span className="text-blue-700 font-bold">
                                  {activities[day][slotIdx].topic}
                                </span>
                              ) : activities[day][slotIdx]?.type ===
                                "activity" ? (
                                <span className="text-green-700 font-bold">
                                  {activities[day][slotIdx].value}
                                </span>
                              ) : (
                                <span className="text-gray-400">+</span>
                              )}
                            </div>

                            {/* Clear button - only show when there's content */}
                            {activities[day][slotIdx] && (
                              <button
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClearCell(day, slotIdx);
                                }}
                                title="Clear this slot"
                              >
                                ×
                              </button>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isCreatingClass}
              >
                {isCreatingClass ? "Creating..." : "Create class"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Activity selection popup */}
      <Dialog
        open={popupOpen}
        onClose={handlePopupClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <div className="font-bold">Select Activity</div>
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4">
            <div>
              <FormLabel component="legend">Activity Type</FormLabel>
              <RadioGroup
                row
                value={popupType}
                onChange={(e) => setPopupType(e.target.value)}
              >
                <FormControlLabel
                  value="lesson"
                  control={<Radio />}
                  label="Lesson"
                />
                <FormControlLabel
                  value="activity"
                  control={<Radio />}
                  label="Activity"
                />
              </RadioGroup>
            </div>

            {popupType === "lesson" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select lesson
                </label>
                <InputSelect
                  options={lessonList}
                  value={popupLesson}
                  onChange={(e) => setPopupLesson(e.target.value)}
                  placeholder="Select lesson"
                  size="md"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity name
                </label>
                <Input
                  value={popupActivity}
                  onChange={(e) => setPopupActivity(e.target.value)}
                  placeholder="Enter activity name"
                  size="md"
                />
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePopupClose} variant="secondary">
            Cancel
          </Button>
          <Button
            onClick={handlePopupSave}
            variant="primary"
            disabled={popupType === "lesson" ? !popupLesson : !popupActivity}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Students Modal */}
      <Dialog
        open={assignModalOpen}
        onClose={handleCloseAssignModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Assign Students to Class</DialogTitle>
        <DialogContent>
          <div className="flex gap-8 py-4">
            {/* Unassigned students */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">
                  Unassigned Students ({unassignedStudents.length})
                </div>
                <div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      const allStudentIds = unassignedStudents.map((s) => s.id);
                      const willExceedLimit =
                        assignedStudents.length + allStudentIds.length > 20;

                      if (willExceedLimit) {
                        enqueueSnackbar(
                          `Warning: Selecting all ${allStudentIds.length} students will exceed the 20 student limit`,
                          { variant: "warning" }
                        );
                      }

                      setSelectedUnassigned(
                        selectedUnassigned.length === allStudentIds.length
                          ? []
                          : allStudentIds
                      );
                    }}
                  >
                    {selectedUnassigned.length === unassignedStudents.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
              </div>
              <ul className="border rounded min-h-[200px] max-h-[300px] overflow-auto">
                {unassignedStudents.length === 0 && (
                  <li className="p-2 text-gray-400">No students</li>
                )}
                {unassignedStudents.map((s) => (
                  <li key={s.id}>
                    <label className="flex items-center p-2 cursor-pointer hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={selectedUnassigned.includes(s.id)}
                        onChange={() =>
                          setSelectedUnassigned((prev) =>
                            prev.includes(s.id)
                              ? prev.filter((id) => id !== s.id)
                              : [...prev, s.id]
                          )
                        }
                      />
                      <span className="ml-2">{s.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            {/* Assign/Remove buttons */}
            <div className="flex flex-col justify-center items-center gap-4">
              <Button
                onClick={handleAssign}
                disabled={selectedUnassigned.length === 0}
              >
                Assign &rarr;
              </Button>

              <Button
                onClick={handleRemove}
                disabled={selectedAssigned.length === 0}
              >
                &larr; Remove
              </Button>
            </div>

            {/* Assigned students */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">
                  Assigned Students ({assignedStudents.length})
                </div>
                <div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      const allStudentIds = assignedStudents.map((s) => s.id);
                      setSelectedAssigned(
                        selectedAssigned.length === allStudentIds.length
                          ? []
                          : allStudentIds
                      );
                    }}
                  >
                    {selectedAssigned.length === assignedStudents.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
              </div>
              <ul className="border rounded min-h-[200px] max-h-[300px] overflow-auto">
                {assignedStudents.length === 0 && (
                  <li className="p-2 text-gray-400">No students</li>
                )}
                {assignedStudents.map((s) => (
                  <li key={s.id}>
                    <label className="flex items-center p-2 cursor-pointer hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={selectedAssigned.includes(s.id)}
                        onChange={() =>
                          setSelectedAssigned((prev) =>
                            prev.includes(s.id)
                              ? prev.filter((id) => id !== s.id)
                              : [...prev, s.id]
                          )
                        }
                      />
                      <span className="ml-2">{s.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignModal} variant="secondary">
            Close
          </Button>
          {/* TODO: Add Save button to persist changes to backend */}
        </DialogActions>
      </Dialog>

      {/* Confirmation Modal for exceeding class size */}
      <Dialog
        open={confirmModal}
        onClose={handleCancelAssign}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Student Assignment</DialogTitle>
        <DialogContent>
          <div className="my-4">
            <p className="mb-4">
              Classes normally have a maximum of 20 students.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-2">
              <p>
                <span className="font-semibold">You are adding:</span>{" "}
                {pendingAssignIds.length} students
              </p>
              <p>
                <span className="font-semibold">Current class size:</span>{" "}
                {assignedStudents.length} students
              </p>
              <p>
                <span className="font-semibold">Resulting class size:</span>{" "}
                {assignedStudents.length + pendingAssignIds.length} students
              </p>
              <p className="text-red-600 font-semibold mt-2">
                This exceeds the recommended limit by{" "}
                {assignedStudents.length + pendingAssignIds.length - 20}{" "}
                students.
              </p>
            </div>
            <p>Do you want to continue?</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAssign} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAssign} variant="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Modal for unassigning students */}
      <Dialog
        open={confirmUnassignModal}
        onClose={handleCancelUnassign}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Student Removal</DialogTitle>
        <DialogContent>
          <div className="my-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
              <p>
                <span className="font-semibold">You are removing:</span>{" "}
                {pendingUnassignIds.length} students from this class
              </p>
              <p>
                <span className="font-semibold">Current class size:</span>{" "}
                {assignedStudents.length} students
              </p>
              <p>
                <span className="font-semibold">Resulting class size:</span>{" "}
                {assignedStudents.length - pendingUnassignIds.length} students
              </p>
            </div>
            <p>Do you want to continue?</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUnassign} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmUnassign} variant="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Modal for deleting a class */}
      <Dialog
        open={deleteConfirmModal}
        onClose={cancelDeleteClass}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete Class</DialogTitle>
        <DialogContent>
          <div className="my-4">
            <p className="mb-2">
              Are you sure you want to delete class{" "}
              <span className="font-semibold text-red-600">
                {pendingDeleteClass?.name}
              </span>
              ?
            </p>
            <p className="text-red-600">This action cannot be undone.</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteClass} variant="secondary">
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteClass}
            variant="danger"
            disabled={deletingClassId === pendingDeleteClass?.id}
          >
            {deletingClassId === pendingDeleteClass?.id
              ? "Deleting..."
              : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Modal for auto-assigning students */}
      <Dialog
        open={confirmAutoAssignModal}
        onClose={handleCancelAutoAssign}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Auto-Assign Students</DialogTitle>
        <DialogContent>
          <div className="my-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
              <p>
                <span className="font-semibold">
                  You are about to automatically assign:
                </span>{" "}
                {numUnassigned} students to available classes
              </p>
              <p className="mt-2">
                Note: Students will only be assigned to active classes with
                available slots (up to 20 students per class).
              </p>
              <p className="mt-2 text-yellow-700">
                If there are more students than available slots, not all
                students will be assigned.{" "}
              </p>
            </div>
            <p>Do you want to proceed with automatic assignment?</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAutoAssign} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAutoAssign} variant="primary">
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
