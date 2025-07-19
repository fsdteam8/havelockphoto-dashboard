import React from "react";
import MyEventsHeader from "./_components/my-events-header";
// import MyEventsContainer from "./_components/my-event-container";
import EventForm from "./_components/event-form";

const MyEvents = () => {
  return (
    <div>
      <MyEventsHeader />
      <EventForm mode={"create"} />
    </div>
  );
};

export default MyEvents;
