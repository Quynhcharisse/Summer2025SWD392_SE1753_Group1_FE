import React, { useEffect } from "react";
import { PageTemplate } from "@templates";
import { Button } from "@atoms";
import { NewsletterSignup, EventCard } from "@molecules";

const Events = () => {
  useEffect(() => {
    document.title = "Events - Sunshine Preschool";
  }, []);
  const events = [
    {
      id: 1,
      date: "June 15, 2025",
      time: "10:00 AM - 2:00 PM",
      title: "Summer Festival",
      description: "Join us for a fun-filled summer festival with games, music, and activities for the whole family.",
      location: "School Playground",
      category: "Festival",
      color: "blue",
      featured: true
    },
    {
      id: 2,
      date: "June 22, 2025",
      time: "2:00 PM - 4:00 PM",
      title: "Parent-Teacher Conference",
      description: "Meet with your child's teacher to discuss progress and development.",
      location: "Classrooms",
      category: "Academic",
      color: "green"
    },
    {
      id: 3,
      date: "July 4, 2025",
      time: "9:00 AM - 11:00 AM",
      title: "Art Exhibition",
      description: "Showcase of our students' creative artwork and crafts projects.",
      location: "Art Room",
      category: "Arts",
      color: "purple"
    },
    {
      id: 4,
      date: "July 12, 2025",
      time: "3:00 PM - 5:00 PM",
      title: "Sports Day",
      description: "Athletic competitions and team sports for all age groups.",
      location: "Sports Field",
      category: "Sports",
      color: "orange"
    },
    {
      id: 5,
      date: "July 20, 2025",
      time: "10:00 AM - 12:00 PM",
      title: "Reading Week",
      description: "Special reading activities and storytelling sessions.",
      location: "Library",
      category: "Academic",
      color: "pink"
    },
    {
      id: 6,
      date: "August 5, 2025",
      time: "6:00 PM - 8:00 PM",
      title: "Graduation Ceremony",
      description: "Celebrating our graduating students moving to primary school.",
      location: "Main Hall",
      category: "Ceremony",
      color: "yellow",
      featured: true
    }  ];

  return (
    <PageTemplate
      title="Upcoming Events"
      subtitle="Join us for exciting activities and important school events throughout the year"      breadcrumbs={[
        { label: "Home", href: "/homepage" },
        { label: "Events", href: "/homepage/events" }
      ]}
      actions={
        <div className="flex gap-4">
          <Button variant="outline" size="md">
            View Calendar
          </Button>
          <Button variant="primary" size="md">
            Subscribe to Updates
          </Button>
        </div>
      }
    >      <div className="space-y-6 sm:space-y-8">
        {/* Featured Events */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Featured Events</h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
            {events.filter(event => event.featured).map((event) => (
              <EventCard
                key={event.id}
                event={{
                  id: event.id,
                  title: event.title,
                  description: event.description,
                  date: event.date,
                  time: event.time,
                  location: event.location,
                  category: event.category,
                  color: event.color
                }}
                variant="featured"
                onAction={() => console.log('Learn more about event:', event.id)}
                actionText="Learn More"
              />
            ))}
          </div>
        </section>

        {/* All Events */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">All Events</h2>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={{
                  id: event.id,
                  title: event.title,
                  description: event.description,
                  date: event.date,
                  time: event.time,
                  location: event.location,
                  category: event.category,
                  color: event.color,
                  featured: event.featured
                }}
                variant="compact"
                onAction={() => console.log('RSVP for event:', event.id)}
                actionText="RSVP"
              />
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <NewsletterSignup
          title="Never Miss an Event!"
          description="Subscribe to our newsletter to receive updates about upcoming events, important announcements, and school activities."
          variant="primary"
          layout="horizontal"
          onSubmit={async (email) => {
            console.log('Newsletter subscription:', email);
            // Here you would normally call your newsletter API
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
          }}
          className="max-w-xl sm:max-w-2xl mx-auto"
        />
        
        <div className="text-center mt-3 sm:mt-4">
          <Button variant="outline" size="md" className="text-sm sm:text-base">
            Download Calendar
          </Button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Events;
