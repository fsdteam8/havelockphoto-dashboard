import React from "react";
import AddEventHeader from "./_components/add-event-header";
// import dynamic from "next/dynamic";
import EventForm from "../_components/event-form";

// const AddEventForm = dynamic(() => import("./_components/add-event-form"), {
//   ssr: false,
// });

const AddEventPage = () => {
  return (
    <div>
      <AddEventHeader />
      <EventForm mode="create" />
    </div>
  );
};

export default AddEventPage;
