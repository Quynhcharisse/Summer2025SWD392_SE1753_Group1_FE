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
import { PageTemplate } from "@templates";
import { Button, Badge } from "@atoms";

const Admission = () => {
  const [selectedAge, setSelectedAge] = useState('');

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
      ]}
      actions={
        <div className="flex gap-4">
          <Button variant="outline" size="md">
            Schedule a Tour
          </Button>
          <Button variant="primary" size="md">
            Apply Now
          </Button>
        </div>
      }
    >
      <div className="space-y-12">

      {/* Programs Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Programs</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {ageGroups.map((program) => (
              <button 
                key={program.id} 
                className={`text-left w-full bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 ${
                  selectedAge === program.id ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => setSelectedAge(program.id)}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{program.name}</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>{program.ages}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>{program.capacity}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>{program.ratio}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span>{program.schedule}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">{program.tuition}</span>
                  </div>
                </div>
                <button className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Learn More
                </button>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Admission Process</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {admissionSteps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div key={step.step} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Enrollment Requirements</h2>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <ul className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Important Dates</h2>
              <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-semibold text-gray-800">Fall 2025 Enrollment</h3>
                  <p className="text-gray-600">Applications Open: January 15, 2025</p>
                  <p className="text-gray-600">Priority Deadline: March 1, 2025</p>
                  <p className="text-gray-600">Regular Deadline: May 1, 2025</p>
                </div>
                
                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="font-semibold text-gray-800">School Year</h3>
                  <p className="text-gray-600">First Day: August 25, 2025</p>
                  <p className="text-gray-600">Last Day: May 22, 2026</p>
                </div>

                <div className="border-l-4 border-purple-600 pl-4">
                  <h3 className="font-semibold text-gray-800">School Tours</h3>
                  <p className="text-gray-600">Every Tuesday & Thursday</p>
                  <p className="text-gray-600">10:00 AM - 11:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Forms */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Download Forms</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <Download className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Application Form</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Download PDF
              </button>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <Download className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Medical Form</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Download PDF
              </button>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <Download className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Parent Handbook</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Questions About Enrollment?</h2>
          <p className="text-xl mb-8">
            Our admissions team is here to help you through the enrollment process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Call: 1900-1234
            </button>
            <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
              Schedule a Tour
            </button>
          </div>
        </div>      </div>
    </PageTemplate>
  );
};

export default Admission;
