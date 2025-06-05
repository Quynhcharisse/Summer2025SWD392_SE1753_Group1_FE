# Atomic Design Components Documentation

This document provides usage examples and guidelines for all the atomic design components in the preschool application.

## Molecules

### ActionCard

A reusable card component for displaying actions with icons, titles, descriptions, and action buttons.

```jsx
import { ActionCard } from '@molecules';
import { Calendar, Users, BookOpen } from 'lucide-react';

// Basic usage
<ActionCard
  title="Schedule a Tour"
  description="Visit our facilities and meet our teachers"
  icon={Calendar}
  actions={[
    {
      label: "Book Now",
      onClick: () => console.log("Booking tour"),
      variant: "primary"
    },
    {
      label: "Learn More",
      onClick: () => console.log("Learning more"),
      variant: "outline"
    }
  ]}
/>

// With different variants
<ActionCard
  title="Emergency Contact"
  description="Important safety information"
  icon={Users}
  variant="warning"
  actions={[
    {
      label: "Call Now",
      onClick: () => console.log("Calling"),
      variant: "primary"
    }
  ]}
/>
```

**Props:**
- `title` (string, required): Card title
- `description` (string): Card description
- `icon` (component): Icon component
- `actions` (array): Array of action objects
- `variant` (string): 'default', 'primary', 'success', 'warning', 'danger'
- `className` (string): Additional CSS classes

### StatCard

A component for displaying statistics with trends and icons.

```jsx
import { StatCard } from '@molecules';
import { Users, TrendingUp } from 'lucide-react';

// Basic stat card
<StatCard
  title="Total Students"
  value="245"
  description="Enrolled this semester"
  icon={Users}
/>

// With trend indicator
<StatCard
  title="Monthly Growth"
  value="12%"
  description="Student enrollment"
  icon={TrendingUp}
  trend={{
    type: "positive",
    value: "+3%",
    label: "from last month"
  }}
  variant="success"
/>

// Dark variant
<StatCard
  title="Teachers"
  value="18"
  description="Qualified educators"
  variant="dark"
/>
```

**Props:**
- `title` (string, required): Stat title
- `value` (string|number, required): Stat value
- `description` (string): Additional description
- `icon` (component): Icon component
- `trend` (object): Trend information with type, value, and label
- `variant` (string): 'default', 'primary', 'success', 'warning', 'dark'

### ContactCard

A card component for displaying contact information with action buttons.

```jsx
import { ContactCard } from '@molecules';
import { Phone, Mail, MapPin } from 'lucide-react';

<ContactCard
  title="Main Office"
  description="Our primary contact for all inquiries"
  icon={Phone}
  contactInfo={[
    "Phone: (555) 123-4567",
    "Email: info@sunshinepreschool.com",
    "Hours: 7:30 AM - 6:00 PM"
  ]}
  actions={[
    {
      label: "Call",
      onClick: () => console.log("Calling"),
      icon: Phone,
      variant: "primary"
    },
    {
      label: "Email",
      onClick: () => console.log("Emailing"),
      icon: Mail,
      variant: "outline"
    }
  ]}
/>
```

**Props:**
- `title` (string, required): Contact title
- `description` (string): Contact description
- `icon` (component): Icon component
- `contactInfo` (array): Array of contact information strings
- `actions` (array): Array of action objects with optional icons
- `variant` (string): 'default', 'primary', 'success', 'warning'

### EventCard

A specialized card for displaying event information with dates, times, and locations.

```jsx
import { EventCard } from '@molecules';

const event = {
  title: "Summer Festival",
  description: "Join us for a fun-filled summer festival",
  date: "June 15, 2025",
  time: "10:00 AM - 2:00 PM",
  location: "School Playground",
  category: "Festival",
  color: "blue",
  featured: true
};

// Featured event card
<EventCard
  event={event}
  variant="featured"
  onAction={(event) => console.log("Action clicked", event)}
  actionLabel="Register Now"
/>

// Compact event card
<EventCard
  event={event}
  variant="compact"
  onAction={(event) => console.log("RSVP", event)}
  actionLabel="RSVP"
  showDescription={false}
/>
```

**Props:**
- `event` (object, required): Event object with title, description, date, time, location, etc.
- `variant` (string): 'default', 'featured', 'compact'
- `onAction` (function): Callback when action button is clicked
- `actionLabel` (string): Label for action button
- `showCategory` (boolean): Whether to show category badge
- `showDescription` (boolean): Whether to show description
- `showLocation` (boolean): Whether to show location

### FeatureCard

A versatile card component for showcasing features, services, or benefits.

```jsx
import { FeatureCard } from '@molecules';
import { BookOpen, Users, Award } from 'lucide-react';

// Basic feature card
<FeatureCard
  icon={BookOpen}
  title="Advanced Curriculum"
  description="Our comprehensive curriculum prepares children for success"
  action={{
    text: "Learn More",
    onClick: () => console.log("Learning more"),
    variant: "primary"
  }}
/>

// Horizontal layout
<FeatureCard
  icon={Users}
  title="Small Class Sizes"
  description="Maximum 12 students per class for personalized attention"
  iconPosition="left"
  size="lg"
  variant="outlined"
  badge={{
    text: "Premium",
    variant: "success"
  }}
/>

// Minimal card
<FeatureCard
  icon={Award}
  title="Certified Teachers"
  description="All our educators are certified and experienced"
  iconPosition="top"
  size="sm"
  variant="filled"
  onClick={(data) => console.log("Card clicked", data)}
/>
```

**Props:**
- `icon` (component): Icon component
- `title` (string, required): Feature title
- `description` (string): Feature description
- `badge` (object): Badge configuration with text and variant
- `action` (object): Action button configuration
- `variant` (string): 'default', 'outlined', 'filled'
- `size` (string): 'sm', 'md', 'lg'
- `iconPosition` (string): 'top', 'left', 'right'
- `iconColor` (string): 'primary', 'secondary', 'success', 'warning', 'danger'
- `onClick` (function): Card click handler

## Organisms

### ErrorBoundary

A React error boundary component for catching and handling JavaScript errors.

```jsx
import { ErrorBoundary } from '@organisms';

// Wrap components that might throw errors
<ErrorBoundary
  title="Oops! Something went wrong"
  message="We encountered an unexpected error. Please try again."
  variant="default"
  showErrorDetails={true}
  onError={(error, errorInfo) => {
    console.error('Error caught:', error, errorInfo);
    // Send to error reporting service
  }}
>
  <YourComponent />
</ErrorBoundary>

// Minimal error boundary
<ErrorBoundary variant="minimal">
  <YourComponent />
</ErrorBoundary>
```

**Props:**
- `children` (node, required): Components to wrap
- `title` (string): Error title
- `message` (string): Error message
- `variant` (string): 'default', 'minimal', 'full'
- `showErrorDetails` (boolean): Show technical details in development
- `showRetryButton` (boolean): Show retry button
- `showRefreshButton` (boolean): Show refresh page button
- `showHomeButton` (boolean): Show go home button
- `onError` (function): Error callback

## Templates

### PageTemplate

A consistent page layout template with header, breadcrumbs, and actions.

```jsx
import { PageTemplate } from '@templates';
import { Button } from '@atoms';

<PageTemplate
  title="Our Classes"
  subtitle="Age-appropriate programs for your child's development"
  breadcrumbs={[
    { label: "Home", href: "/" },
    { label: "Classes", href: "/classes" }
  ]}
  actions={
    <div className="flex gap-4">
      <Button variant="outline" size="md">
        Schedule Visit
      </Button>
      <Button variant="primary" size="md">
        Enroll Now
      </Button>
    </div>
  }
>
  {/* Page content */}
</PageTemplate>
```

## Best Practices

### Component Usage Guidelines

1. **Consistency**: Use the same components across similar contexts
2. **Props Validation**: All components include comprehensive PropTypes
3. **Accessibility**: Components include proper ARIA labels and keyboard support
4. **Responsive Design**: All components are mobile-friendly
5. **Error Handling**: Wrap components with ErrorBoundary where appropriate

### Styling Guidelines

1. **Variants**: Use appropriate variants for different contexts
2. **Spacing**: Use consistent spacing with Tailwind utilities
3. **Colors**: Follow the established color scheme
4. **Typography**: Use consistent typography scales

### Performance Tips

1. **Lazy Loading**: Import components only when needed
2. **Memoization**: Use React.memo for expensive components
3. **Prop Optimization**: Avoid creating new objects in render

## Integration Examples

### Page Structure with Atomic Design

```jsx
import { PageTemplate } from '@templates';
import { ActionCard, StatCard, EventCard } from '@molecules';
import { Button, Badge } from '@atoms';
import { ErrorBoundary } from '@organisms';

const HomePage = () => {
  return (
    <ErrorBoundary>
      <PageTemplate
        title="Welcome to Sunshine Preschool"
        subtitle="Where learning begins with joy"
        actions={
          <Button variant="primary">
            Schedule Tour
          </Button>
        }
      >
        <div className="space-y-8">
          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-6">
            <StatCard title="Students" value="245" variant="primary" />
            <StatCard title="Teachers" value="18" variant="success" />
            <StatCard title="Years" value="15" variant="warning" />
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard
              title="Academic Excellence"
              description="Comprehensive curriculum for all ages"
              actions={[{ label: "Learn More", variant: "primary" }]}
            />
            {/* More cards... */}
          </div>

          {/* Events Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onAction={handleEventAction}
              />
            ))}
          </div>
        </div>
      </PageTemplate>
    </ErrorBoundary>
  );
};
```

This documentation provides comprehensive guidance for using all the atomic design components effectively in the preschool application.
