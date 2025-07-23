import { Badge, Button } from "@atoms";
import { InfoListCard } from "@molecules";
import { PageTemplate } from "@templates";
import { Award, Heart, Mail, MapPin, Phone, Target, Users } from "lucide-react";

const AboutUs = () => {
  const values = [
    {
      icon: Heart,
      title: "Caring & Nurturing",
      description:
        "We provide a warm, loving environment where every child feels safe and valued.",
    },
    {
      icon: Users,
      title: "Community Focus",
      description:
        "Building strong relationships with families and fostering a sense of belonging.",
    },
    {
      icon: Award,
      title: "Excellence in Education",
      description:
        "Committed to providing high-quality early childhood education programs.",
    },
    {
      icon: Target,
      title: "Individual Growth",
      description:
        "Supporting each child's unique development journey and learning style.",
    },
  ];

  const stats = [
    { number: "15+", label: "Years of Experience" },
    { number: "200+", label: "Happy Families" },
    { number: "25+", label: "Qualified Teachers" },
    { number: "4.9", label: "Parent Rating" },
  ];

  const team = [
    {
      name: "Ms. Sarah Johnson",
      role: "Principal & Founder",
      experience: "15 years in early childhood education",
      image: "/api/placeholder/150/150",
    },
    {
      name: "Ms. Emily Chen",
      role: "Lead Teacher",
      experience: "10 years teaching experience",
      image: "/api/placeholder/150/150",
    },
    {
      name: "Mr. David Wilson",
      role: "Child Development Specialist",
      experience: "12 years in child psychology",
      image: "/api/placeholder/150/150",
    },
  ];
  return (
    <PageTemplate
      title="About Sunshine Preschool"
      subtitle="Nurturing young minds and building bright futures since 2009"
      breadcrumbs={[
        { label: "Home", href: "/homepage" },
        { label: "About Us", href: "/homepage/about-us" },
      ]}
      actions={
        <div className="flex gap-4">
          <Button variant="outline" size="md">
            Download Brochure
          </Button>
          <Button variant="primary" size="md">
            Schedule a Tour
          </Button>
        </div>
      }
    >
      <div className="space-y-16">
        {/* Achievement Stats */}
        <section className="bg-blue-600 text-white p-8 rounded-xl">
          {" "}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div
                key={`stat-${stat.label.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>{" "}
        {/* Mission & Vision */}
        <section>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To provide a safe, nurturing, and stimulating environment where
                young children can grow, learn, and develop to their fullest
                potential. We believe every child is unique and deserves
                individualized attention to help them thrive.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Our Vision
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To be the leading preschool in the community, recognized for our
                commitment to excellence in early childhood education,
                innovative teaching methods, and strong partnerships with
                families.
              </p>
            </div>
          </div>
        </section>{" "}
        {/* Values Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            Our Core Values
          </h2>{" "}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={`value-${value.title
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                  className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>
        {/* Team Section */}
        <section className="bg-gray-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            Meet Our Team
          </h2>{" "}
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={`team-${member.name.replace(/\s+/g, "-").toLowerCase()}`}
                className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {member.name}
                </h3>
                <Badge variant="secondary" className="mb-2">
                  {member.role}
                </Badge>
                <p className="text-gray-600 text-sm">{member.experience}</p>
              </div>
            ))}
          </div>
        </section>{" "}
        {/* Facilities Section */}
        <section className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            Our Facilities
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <InfoListCard
              title="Indoor Learning Spaces"
              items={[
                { emoji: "🏫", text: "Modern, well-lit classrooms" },
                { emoji: "📚", text: "Extensive library corner" },
                { emoji: "🎨", text: "Creative arts studio" },
                { emoji: "🍽️", text: "Clean, spacious dining area" },
              ]}
              variant="primary"
            />
            <InfoListCard
              title="Outdoor Play Areas"
              items={[
                { emoji: "🏃", text: "Safe playground equipment" },
                { emoji: "🌳", text: "Shaded garden spaces" },
                { emoji: "⚽", text: "Sports and activity zones" },
                { emoji: "🌺", text: "Learning garden plots" },
              ]}
              variant="success"
            />
          </div>
        </section>
        {/* Contact Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            Get in Touch
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center bg-white p-6 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Call Us
              </h3>
              <p className="text-gray-600">1900-1234</p>
              <p className="text-gray-600 text-sm">
                Monday - Friday: 7AM - 6PM
              </p>
            </div>
            <div className="text-center bg-white p-6 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Email Us
              </h3>
              <p className="text-gray-600">info@sunshinepreschool.com</p>
              <p className="text-gray-600 text-sm">
                admissions@sunshinepreschool.com
              </p>
            </div>
            <div className="text-center bg-white p-6 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Visit Us
              </h3>
              <p className="text-gray-600">123 Education Street</p>
              <p className="text-gray-600 text-sm">Ho Chi Minh City, Vietnam</p>
            </div>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
};

export default AboutUs;
