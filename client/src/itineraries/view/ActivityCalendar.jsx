import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";

const localizer = momentLocalizer(moment);

export default function ActivityCalendar({ itinerary, setActivityId }) {
  const calendarEvents = itinerary.activities.map((activity) => ({
    title: activity.activity,
    start: new Date(activity.date),
    end: new Date(activity.date),
    resource: {
      id: activity._id,
      locationName: activity.locationName,
      notes: activity.notes,
      date: activity.date,
    },
  }));

  const earliestDate = new Date(
    Math.min(
      ...itinerary.activities.map((activity) =>
        new Date(activity.date).getTime()
      )
    )
  );

  // TODO: Show edit modal on event click

  return (
    <div className="mb-6">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        defaultDate={earliestDate}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={(event) => setActivityId(event.resource.id)}
      />
    </div>
  );
}
