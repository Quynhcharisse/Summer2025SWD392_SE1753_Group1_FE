import {
  formatPeriodRange,
  formatRegistrationDates,
  getCurrentEnrollmentPeriod,
  getNextEnrollmentPeriod,
  getRegistrationStatus,
} from "@/utils/enrollmentPeriods";
import { Badge, Button } from "@atoms";
import { InfoListCard } from "@molecules";
import { PageTemplate } from "@templates";
import clsx from "clsx";
import { useEffect } from "react";

const Classes = () => {
  // Get current and next enrollment periods
  const currentPeriod = getCurrentEnrollmentPeriod();
  const nextPeriod = getNextEnrollmentPeriod();
  const currentRegistrationStatus = getRegistrationStatus(currentPeriod);
  const currentRegistrationDates = formatRegistrationDates(currentPeriod);
  const nextRegistrationDates = formatRegistrationDates(nextPeriod);
  useEffect(() => {
    document.title = "Classes - Sunshine Preschool";
  }, []);
  const classes = [];
  const getColorClasses = (color) => {
    const colorMap = {
      blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-600",
      green: "from-green-50 to-green-100 border-green-200 text-green-600",
      purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-600",
      orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-600",
    };
    return colorMap[color] || colorMap.blue;
  };
  const getRegistrationStatusBadge = (status) => {
    const statusConfig = {
      open: { variant: "success", text: "Registration Open" },
      waiting: { variant: "warning", text: "Waiting List" },
      closed: { variant: "danger", text: "Registration Closed" },
    };
    return statusConfig[status] || statusConfig.closed;
  };

  const getEnrollButtonText = (status) => {
    switch (status) {
      case "open":
        return "Enroll Now";
      case "waiting":
        return "Join Waiting List";
      case "closed":
        return "Notify Next Period";
      default:
        return "Registration Closed";
    }
  };

  const isEnrollmentActive = (status) => {
    return status === "open" || status === "waiting";
  };

  return (
    <PageTemplate
      title="Our Classes"
      subtitle="4-month enrollment periods with age-appropriate programs designed to nurture your child's development through play-based learning"
      breadcrumbs={[
        { label: "Home", href: "/homepage" },
        { label: "Classes", href: "/homepage/classes" },
      ]}
      actions={
        <div className="flex gap-4">
          <Button variant="outline" size="md">
            Schedule a Visit
          </Button>
          <Button variant="primary" size="md">
            View Enrollment
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Classes Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {classes.map((classItem) => (
            <div
              key={classItem.id}
              className={clsx(
                "bg-gradient-to-br rounded-lg p-6 border",
                getColorClasses(classItem.color)
              )}
            >
              {" "}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  {classItem.name}
                </h3>{" "}
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="info" size="sm">
                    {classItem.capacity}
                  </Badge>
                  <Badge
                    variant={
                      getRegistrationStatusBadge(classItem.registrationStatus)
                        .variant
                    }
                    size="sm"
                  >
                    {
                      getRegistrationStatusBadge(classItem.registrationStatus)
                        .text
                    }
                  </Badge>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{classItem.description}</p>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-20">
                    📅 Schedule:
                  </span>
                  <span className="text-gray-600">{classItem.schedule}</span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-20">
                    📚 Period:
                  </span>
                  <span className="text-gray-600">
                    {classItem.enrollmentPeriod}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-20">
                    👩‍🏫 Teacher:
                  </span>
                  <span className="text-gray-600">{classItem.teacher}</span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-20">
                    ⏰ Deadline:
                  </span>
                  <span className="text-gray-600">
                    {classItem.registrationDeadline}
                  </span>
                </div>

                {classItem.registrationStatus === "closed" && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-20">
                      🔄 Next Period:
                    </span>
                    <span className="text-gray-600">
                      {classItem.nextPeriod}
                    </span>
                  </div>
                )}
              </div>{" "}
              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant={
                    isEnrollmentActive(classItem.registrationStatus)
                      ? "primary"
                      : "outline"
                  }
                  size="md"
                  className="w-full"
                  disabled={
                    !isEnrollmentActive(classItem.registrationStatus) &&
                    classItem.registrationStatus !== "closed"
                  }
                >
                  {getEnrollButtonText(classItem.registrationStatus)}
                </Button>

                {classItem.registrationStatus === "closed" && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Get notified when registration opens for{" "}
                    {classItem.nextPeriod}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>{" "}
        {/* Enrollment Periods Information */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📅 Enrollment Periods
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                Current Period
              </h3>
              <p className="text-gray-600 mb-1">
                {formatPeriodRange(currentPeriod)}
              </p>
              <p
                className={clsx(
                  "text-sm font-medium",
                  currentRegistrationStatus === "open"
                    ? "text-green-600"
                    : currentRegistrationStatus === "closed"
                    ? "text-red-600"
                    : "text-blue-600"
                )}
              >
                {currentRegistrationStatus === "open" &&
                  `Registration Open until: ${currentRegistrationDates.end}`}
                {currentRegistrationStatus === "closed" &&
                  `Registration Closed on: ${currentRegistrationDates.end}`}
                {currentRegistrationStatus === "upcoming" &&
                  `Registration Opens: ${currentRegistrationDates.start}`}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Next Period</h3>
              <p className="text-gray-600 mb-1">
                {formatPeriodRange(nextPeriod)}
              </p>
              <p className="text-sm text-blue-600 font-medium">
                Registration Opens: {nextRegistrationDates.start}
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-800 mb-2">
              📋 Important Notes:
            </h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Each enrollment period is 4 months long</li>
              <li>• Registration opens 2 months before each period starts</li>
              <li>
                • Early registration is recommended due to limited capacity
              </li>
              <li>• Waiting lists are available when classes are full</li>
              <li>• No refunds after the first week of each period</li>
            </ul>
          </div>
        </div>
        {/* Additional Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 Class Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {" "}
            <InfoListCard
              title="What's Included:"
              items={[
                {
                  emoji: "✓",
                  text: "Healthy snacks and lunch",
                  color: "green",
                },
                { emoji: "✓", text: "Art and craft supplies", color: "green" },
                {
                  emoji: "✓",
                  text: "Educational toys and materials",
                  color: "green",
                },
                { emoji: "✓", text: "Outdoor play equipment", color: "green" },
              ]}
              variant="clean"
              iconPosition="left"
            />{" "}
            <InfoListCard
              title="Special Programs:"
              items={[
                {
                  emoji: "🎵",
                  text: "Music and movement classes",
                  color: "blue",
                },
                {
                  emoji: "📚",
                  text: "Language development activities",
                  color: "blue",
                },
                { emoji: "🔬", text: "Science exploration", color: "blue" },
                {
                  emoji: "💪",
                  text: "Character building exercises",
                  color: "blue",
                },
              ]}
              variant="clean"
              iconPosition="left"
            />
          </div>
        </div>
        {/* Call to Action */}
        <section className="bg-blue-50 p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Have questions about our classes? We'd love to help!
          </h2>
          <p className="text-gray-600 mb-6">
            Schedule a visit to see our classrooms and meet our teachers
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" size="md">
              Schedule Tour
            </Button>
            <Button variant="outline" size="md">
              Contact Us
            </Button>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
};

export default Classes;
