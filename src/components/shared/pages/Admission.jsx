import { Calendar, CheckCircle, FileText, Phone, Users } from "lucide-react";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleEnrollmentNavigation } from "../../../utils/authUtils";
import { Button } from "../atoms";
import { InfoListCard, ProcessStepCard, ProgramCard } from "../molecules";
import { PageTemplate } from "../templates";

const Admission = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedAge, setSelectedAge] = useState("");

  // Handle enrollment navigation with authentication check
  const handleEnrollmentClick = async () => {
    const success = await handleEnrollmentNavigation(navigate, {
      showNotification: (message, type) => {
        enqueueSnackbar(message, { variant: type });
      },
    });

    if (success) {
      //       console.log('Navigated to enrollment successfully');
    }
  };

  const ageGroups = [
    {
      id: "toddler",
      name: "Toddler Program",
      ages: "18 months - 2 years",
      capacity: "8 children per class",
      ratio: "1:4 teacher-child ratio",
      schedule: "Monday - Friday, 7:30 AM - 5:30 PM",
      tuition: "$800/month",
    },
    {
      id: "preschool",
      name: "Preschool Program",
      ages: "3 - 4 years",
      capacity: "12 children per class",
      ratio: "1:6 teacher-child ratio",
      schedule: "Monday - Friday, 7:30 AM - 5:30 PM",
      tuition: "$750/month",
    },
    {
      id: "prekindergarten",
      name: "Pre-K Program",
      ages: "4 - 5 years",
      capacity: "15 children per class",
      ratio: "1:8 teacher-child ratio",
      schedule: "Monday - Friday, 7:30 AM - 5:30 PM",
      tuition: "$700/month",
    },
  ];

  const admissionSteps = [
    {
      step: 1,
      title: "Schedule a Tour",
      description: "Visit our facility and meet our teachers",
      icon: Calendar,
    },
    {
      step: 2,
      title: "Submit Application",
      description: "Complete the enrollment application form",
      icon: FileText,
    },
    {
      step: 3,
      title: "Interview & Assessment",
      description: "Brief meeting with child and family",
      icon: Users,
    },
    {
      step: 4,
      title: "Enrollment Confirmation",
      description: "Secure your spot with deposit",
      icon: CheckCircle,
    },
  ];

  const requirements = [
    "Completed application form",
    "Child's birth certificate",
    "Immunization records",
    "Medical examination form",
    "Emergency contact information",
    "Previous school records (if applicable)",
    "Registration fee ($100)",
    "First month tuition deposit",
  ];

  return (
    <PageTemplate
      title="Admission Information"
      subtitle="Join our nurturing learning community where every child thrives"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Admission", href: "/admission" },
      ]}
      actions={
        <div className="flex gap-4">
          <Button variant="outline" size="md">
            Schedule a Tour
          </Button>{" "}
          <Button variant="primary" size="md" onClick={handleEnrollmentClick}>
            Apply Now
          </Button>
        </div>
      }
    >
      {" "}
      <div className="space-y-8 sm:space-y-12">
        {" "}
        {/* Programs Section */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold theme-aware-text text-center mb-6 sm:mb-8">
            Our Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {ageGroups.map((program) => (
              <ProgramCard
                key={program.id}
                title={program.name}
                ages={program.ages}
                capacity={program.capacity}
                ratio={program.ratio}
                schedule={program.schedule}
                tuition={program.tuition}
                isSelected={selectedAge === program.id}
                onClick={() => setSelectedAge(program.id)}
                actions={[
                  {
                    label: "Apply Now",
                    onClick: handleEnrollmentClick,
                    variant: "primary",
                  },
                ]}
              />
            ))}
          </div>
        </section>{" "}
        {/* Admission Process */}
        <section className="bg-theme-surface p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl">
          <h2 className="text-xl sm:text-2xl font-bold theme-aware-text text-center mb-6 sm:mb-8">
            Admission Process
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {admissionSteps.map((step) => (
              <ProcessStepCard
                key={step.step}
                step={step.step}
                title={step.title}
                description={step.description}
                icon={step.icon}
                variant="primary"
                //                 onClick={() => console.log(`Step ${step.step} clicked`)}
              />
            ))}
          </div>
        </section>
        {/* Requirements and Important Dates */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <InfoListCard
            title="Enrollment Requirements"
            items={requirements}
            variant="success"
            showCheckmarks={true}
          />{" "}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold theme-aware-text mb-4 sm:mb-6">
              Important Dates
            </h2>
            <div className="bg-theme-surface p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg space-y-4 sm:space-y-6">
              <div className="border-l-4 border-theme-primary pl-3 sm:pl-4">
                <h3 className="font-semibold theme-aware-text text-sm sm:text-base">
                  Fall 2025 Enrollment
                </h3>
                <p className="theme-aware-text-secondary text-xs sm:text-sm">
                  Applications Open: January 15, 2025
                </p>
                <p className="theme-aware-text-secondary text-xs sm:text-sm">
                  Priority Deadline: March 1, 2025
                </p>
                <p className="theme-aware-text-secondary text-xs sm:text-sm">
                  Regular Deadline: May 1, 2025
                </p>
              </div>

              <div className="border-l-4 border-theme-secondary pl-3 sm:pl-4">
                <h3 className="font-semibold theme-aware-text text-sm sm:text-base">
                  School Year
                </h3>
                <p className="theme-aware-text-secondary text-xs sm:text-sm">
                  First Day: August 25, 2025
                </p>
                <p className="theme-aware-text-secondary text-xs sm:text-sm">
                  Last Day: May 22, 2026
                </p>
              </div>

              <div className="border-l-4 border-theme-accent pl-3 sm:pl-4">
                <h3 className="font-semibold theme-aware-text text-sm sm:text-base">
                  School Tours
                </h3>
                <p className="theme-aware-text-secondary text-xs sm:text-sm">
                  Every Tuesday & Thursday
                </p>
                <p className="theme-aware-text-secondary text-xs sm:text-sm">
                  10:00 AM - 11:00 AM
                </p>
              </div>
            </div>
          </div>
        </section>{" "}
        {/* Download Forms */}
        {/* Contact CTA */}
        <section className="bg-gradient-primary text-white p-6 sm:p-8 rounded-lg sm:rounded-xl text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            Questions About Enrollment?
          </h2>
          <p className="text-base sm:text-lg mb-4 sm:mb-6 px-2">
            Our admissions team is here to help you through the enrollment
            process.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
            <Button
              variant="secondary"
              size="md"
              className="flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Phone className="w-4 sm:w-5 h-4 sm:h-5" />
              Call: 1900-1234
            </Button>
            <Button
              variant="outline"
              size="md"
              className="border-white text-white hover:bg-white hover:text-theme-primary text-sm sm:text-base"
            >
              Schedule a Tour
            </Button>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
};

export default Admission;
