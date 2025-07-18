import React, { useEffect } from "react";
import dayjs from "dayjs";
import { PageTemplate } from "@templates";
import { Button } from "@atoms";
import { NewsletterSignup, EventCard } from "@molecules";
import { useEventActive, useEventDetail, useEventTeachers, useRegisteredEvents } from "@hooks/useEvent";
import { Alert, CircularProgress, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CalendarIcon from "@icons/CalendarIcon";
import { getCurrentTokenData } from "@services/JWTService.jsx";

// Helper to format date/time using dayjs 24h
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = dayjs(dateStr);
  return d.isValid() ? d.format('DD/MM/YYYY') : '';
};

const formatTimeRange = (start, end) => {
  const s = start ? dayjs(start) : null;
  const e = end ? dayjs(end) : null;
  if (!s || !s.isValid()) return '';
  if (!e || !e.isValid()) return s.format('HH:mm');
  return `${s.format('HH:mm')} - ${e.format('HH:mm')}`;
};

const Events = () => {
  useEffect(() => {
    document.title = "Events - Sunshine Preschool";
  }, []);

  const { data: eventActiveResponse, isLoading, isError, error } = useEventActive();
  const events = eventActiveResponse?.data?.data || [];

  const navigate = useNavigate();
  const handleOpenDetail = (id) => {
    navigate(`/homepage/events/${id}`);
  };

  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const [openRegisteredDialog, setOpenRegisteredDialog] = React.useState(false);
  // Sửa: Không tự động fetch registered events khi mount
  const { data: registeredEventsData, isLoading: isLoadingRegistered, refetch: refetchRegisteredEvents } = useRegisteredEvents({
    enabled: false,
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  const handleOpenRegisteredDialog = () => {
    if (!isLoggedIn) {
      navigate("/auth/login");
      return;
    }
    // Kiểm tra role, nếu không phải parent thì cảnh báo
    const tokenData = getCurrentTokenData();
    if (!tokenData || tokenData.role?.toLowerCase() !== "parent") {
      setSnackbar({
        open: true,
        message: "Chỉ phụ huynh (parent) mới sử dụng được chức năng này!",
        severity: "warning",
      });
      return;
    }
    refetchRegisteredEvents();
    setOpenRegisteredDialog(true);
  };

  if (isLoading) {
    return (
      <PageTemplate>
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      </PageTemplate>
    );
  }

  if (isError) {
    return (
      <PageTemplate>
        <Alert severity="error">
          {error?.response?.status === 403 
            ? 'You do not have permission to access this resource. Please log in with appropriate permissions.'
            : `Error loading events: ${error?.message || 'Please try again later.'}`
          }
        </Alert>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title="Upcoming Events"
      subtitle="Join us for exciting activities and important school events throughout the year"
      breadcrumbs={[
        { label: "Home", href: "/homepage" },
        { label: "Events", href: "/homepage/events" }
      ]}
      actions={
        <div className="flex gap-4">
          <Button variant="outline" size="md" startIcon={<CalendarIcon />} onClick={handleOpenRegisteredDialog}>
            View Registered Events
          </Button>
        </div>
      }
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Featured Events */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Featured Events</h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
            {events.filter(event => event.featured).map((event) => (
              <EventCard
                key={event.id}
                event={{
                  id: event.id,
                  title: event.name,
                  description: event.description,
                  date: formatDate(event.startTime),
                  time: formatTimeRange(event.startTime, event.endTime),
                  location: event.location,
                  category: event.category || "Event",
                  color: event.color || "blue",
                  attachmentImg: event.attachmentImg,
                  featured: event.featured
                }}
                variant="featured"
                onAction={() => handleOpenDetail(event.id)}
                actionLabel="Learn More"
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
                  title: event.name,
                  description: event.description,
                  time: event.endTime ? `${event.startTime} - ${event.endTime}` : undefined,
                  location: event.location,
                  category: event.category || "Event",
                  color: event.color || "blue",
                  attachmentImg: event.attachmentImg,
                  featured: event.featured,
                  deadline: event.registrationDeadline,
                }}
                variant="compact"
                onAction={() => handleOpenDetail(event.id)}
                actionLabel="Learn More"
              />
            ))}
          </div>
        </section>

        {/* Dialog hiển thị các sự kiện đã đăng ký */}
        <Dialog open={openRegisteredDialog} onClose={() => setOpenRegisteredDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Events Registered for Your Children</DialogTitle>
          <DialogContent dividers>
            {isLoadingRegistered ? (
              <div className="py-6 text-center"><CircularProgress /></div>
            ) : registeredEventsData?.data?.data?.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {registeredEventsData.data.data.map((event, idx) => (
                  <EventCard
                    key={idx}
                    event={{
                      title: event.eventName || event.name,
                      description: event.description,
                      date: `Registered At: ${dayjs(event.registeredAt).format('DD/MM/YYYY HH:mm')}`,
                      time: event.endTime ? `${event.startTime} - ${event.endTime}` : undefined,
                      location: event.location,
                      category: 'Event',
                      attachmentImg: event.attachmentImg,
                      deadline: event.registrationDeadline
                    }}
                    variant="compact"
                    actionLabel="View"
                    onAction={() => {
                      setOpenRegisteredDialog(false);
                      if (event.eventId || event.id) {
                        handleOpenDetail(event.eventId || event.id);
                      }
                    }}
                    disabled={!(event.eventId || event.id)}
                    childrenNames={`Children Name: ${event.childName}`}
                  />
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-gray-500">No registered events found.</div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRegisteredDialog(false)} variant="outline">Close</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%', whiteSpace: 'pre-line' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </PageTemplate>
  );
};

export default Events;
