import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  Users, 
  CheckCircle,
  Download,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { PageTemplate } from "@templates";
import { Button, Badge } from "@atoms";
import { handleEnrollmentNavigation } from "../../../utils/authUtils";

const Admission = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedAge, setSelectedAge] = useState('');

  // Handle enrollment navigation with authentication check
  const handleEnrollmentClick = async () => {
    const success = await handleEnrollmentNavigation(navigate, {
      showNotification: (message, type) => {
        enqueueSnackbar(message, { variant: type });
      }
    });
    
    if (success) {
//       console.log('Navigated to enrollment successfully');
    }
  };

  const ageGroups = [
    {
      id: 'toddler',
      name: 'Toddler Program',
      ages: '18 months - 2 years',
      capacity: '8 children per class',
      ratio: '1:4 teacher-child ratio',
      schedule: 'Monday - Friday, 7:30 AM - 5:30 PM',
      tuition: '$800/month'
    },
    {
      id: 'preschool',
      name: 'Preschool Program',
      ages: '3 - 4 years',
      capacity: '12 children per class',
      ratio: '1:6 teacher-child ratio',
      schedule: 'Monday - Friday, 7:30 AM - 5:30 PM',
      tuition: '$750/month'
    },
    {
      id: 'prekindergarten',
      name: 'Pre-K Program',
      ages: '4 - 5 years',
      capacity: '15 children per class',
      ratio: '1:8 teacher-child ratio',
      schedule: 'Monday - Friday, 7:30 AM - 5:30 PM',
      tuition: '$700/month'
    }
  ];

  const admissionSteps = [
    {
      step: 1,
      title: 'Schedule a Tour',
      description: 'Visit our facility and meet our teachers',
      icon: Calendar
    },
    {
      step: 2,
      title: 'Submit Application',
      description: 'Complete the enrollment application form',
      icon: FileText
    },
    {
      step: 3,
      title: 'Interview & Assessment',
      description: 'Brief meeting with child and family',
      icon: Users
    },
    {
      step: 4,
      title: 'Enrollment Confirmation',
      description: 'Secure your spot with deposit',
      icon: CheckCircle
    }
  ];

  const requirements = [
    'Completed application form',
    'Child\'s birth certificate',
    'Immunization records',
    'Medical examination form',
    'Emergency contact information',
    'Previous school records (if applicable)',
    'Registration fee ($100)',
    'First month tuition deposit'
  ];

  return (
    <PageTemplate
      title="Admission Information"
      subtitle="Join our nurturing learning community where every child thrives"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Admission", href: "/admission" }
      ]}      actions={
        <div className="flex gap-4">
          <Button variant="outline" size="md">
            Schedule a Tour
          </Button>
          <Button variant="primary" size="md" onClick={handleEnrollmentClick}>
            Apply Now
          </Button>
        </div>
      }
    >
      <div className="space-y-12">
        {/* Programs Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Our Programs</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {ageGroups.map((program) => (
              <div 
                key={program.id} 
                className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 ${
                  selectedAge === program.id ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => setSelectedAge(program.id)}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">{program.name}</h3>
                <div className="space-y-3 text-gray-600 text-sm">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>{program.ages}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>{program.capacity}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>{program.ratio}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{program.schedule}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-600">{program.tuition}</span>
                  </div>
                </div>
                <Button variant="primary" size="sm" className="w-full mt-4">
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Admission Process */}
        <section className="bg-gray-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Admission Process</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {admissionSteps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div key={step.step} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                    <Badge variant="primary" className="absolute -top-2 -right-2">
                      {step.step}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Requirements and Important Dates */}
        <section className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Enrollment Requirements</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <ul className="space-y-3">
                {requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Important Dates</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-semibold text-gray-800">Fall 2025 Enrollment</h3>
                <p className="text-gray-600 text-sm">Applications Open: January 15, 2025</p>
                <p className="text-gray-600 text-sm">Priority Deadline: March 1, 2025</p>
                <p className="text-gray-600 text-sm">Regular Deadline: May 1, 2025</p>
              </div>
              
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-semibold text-gray-800">School Year</h3>
                <p className="text-gray-600 text-sm">First Day: August 25, 2025</p>
                <p className="text-gray-600 text-sm">Last Day: May 22, 2026</p>
              </div>

              <div className="border-l-4 border-purple-600 pl-4">
                <h3 className="font-semibold text-gray-800">School Tours</h3>
                <p className="text-gray-600 text-sm">Every Tuesday & Thursday</p>
                <p className="text-gray-600 text-sm">10:00 AM - 11:00 AM</p>
              </div>
            </div>
          </div>
        </section>

        {/* Download Forms */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Download Forms</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <Download className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Application Form</h3>
              <Button variant="ghost" size="sm">
                Download PDF
              </Button>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <Download className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Medical Form</h3>
              <Button variant="ghost" size="sm">
                Download PDF
              </Button>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <Download className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Parent Handbook</h3>
              <Button variant="ghost" size="sm">
                Download PDF
              </Button>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Questions About Enrollment?</h2>
          <p className="text-lg mb-6">
            Our admissions team is here to help you through the enrollment process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="md" className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Call: 1900-1234
            </Button>
            <Button variant="outline" size="md" className="border-white text-white hover:bg-white hover:text-blue-600">
              Schedule a Tour
            </Button>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
};

export default Admission;
