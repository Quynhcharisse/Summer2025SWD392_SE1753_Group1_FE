import React, { useEffect } from "react";
import clsx from "clsx";
import { PageTemplate } from "@templates";
import { Button, Badge } from "@atoms";
import { InfoListCard } from "@molecules";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/api/services/JWTService";
import { AUTH_ROUTES } from "@/constants/routes";

const Classes = () => {
  const navigate = useNavigate();  useEffect(() => {
    document.title = "Classes - Sunshine Preschool";
    // Check authentication using JWT service
    if (!isAuthenticated()) {
      console.log("User not authenticated, redirecting to login");
      navigate(AUTH_ROUTES.LOGIN);
    }
  }, [navigate]);

  const classes = [
    {
      id: 1,
      name: "Toddler Class (18-24 months)",
      description:
        "Gentle introduction to learning through play, music, and sensory activities.",
      schedule: "Monday - Friday, 8:00 AM - 12:00 PM",
      capacity: "8 students",
      teacher: "Ms. Sarah Johnson",
      color: "blue",
    },
    {
      id: 2,
      name: "Pre-K Class (2-3 years)",
      description:
        "Focus on social skills, basic academic concepts, and creative expression.",
      schedule: "Monday - Friday, 8:00 AM - 3:00 PM",
      capacity: "12 students",
      teacher: "Ms. Emily Chen",
      color: "green",
    },
    {
      id: 3,
      name: "Kindergarten Prep (4-5 years)",
      description:
        "Advanced preparation for kindergarten with structured learning activities.",
      schedule: "Monday - Friday, 8:00 AM - 4:00 PM",
      capacity: "15 students",
      teacher: "Mr. David Wilson",
      color: "purple",
    },
    {
      id: 4,
      name: "After School Program",
      description:
        "Homework help, recreational activities, and supervised play time.",
      schedule: "Monday - Friday, 3:00 PM - 6:00 PM",
      capacity: "20 students",
      teacher: "Ms. Lisa Park",
      color: "orange",
    },
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-600",
      green: "from-green-50 to-green-100 border-green-200 text-green-600",
      purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-600",
      orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-600",
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <PageTemplate
      title="Our Classes"
      subtitle="Age-appropriate programs designed to nurture your child's development through play-based learning"      breadcrumbs={[
        { label: "Home", href: "/homepage" },
        { label: "Classes", href: "/homepage/classes" }
      ]}
      actions={
        <div className="flex gap-4">
          <Button variant="outline" size="md">
            Schedule a Visit
          </Button>
          <Button variant="primary" size="md">
            Enroll Now
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
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  {classItem.name}
                </h3>
                <Badge variant="secondary" className="ml-2">
                  {classItem.capacity}
                </Badge>
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
                    👩‍🏫 Teacher:
                  </span>
                  <span className="text-gray-600">{classItem.teacher}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button 
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  Enroll Now
                </Button>
              </div>
            </div>
          ))}
        </div>        {/* Additional Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 Class Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">            <InfoListCard
              title="What's Included:"
              items={[
                { emoji: "✓", text: "Healthy snacks and lunch", color: "green" },
                { emoji: "✓", text: "Art and craft supplies", color: "green" },
                { emoji: "✓", text: "Educational toys and materials", color: "green" },
                { emoji: "✓", text: "Outdoor play equipment", color: "green" }
              ]}
              variant="clean"
              iconPosition="left"
            />            <InfoListCard
              title="Special Programs:"
              items={[
                { emoji: "🎵", text: "Music and movement classes", color: "blue" },
                { emoji: "📚", text: "Language development activities", color: "blue" },
                { emoji: "🔬", text: "Science exploration", color: "blue" },
                { emoji: "💪", text: "Character building exercises", color: "blue" }
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
