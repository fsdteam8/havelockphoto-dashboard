import React from "react";
import EditEventHeader from "./_components/edit-event-header";
import dynamic from "next/dynamic";
const EditEventForm = dynamic(() => import("./_components/edit-event-form"), {
  ssr: false,
})

const EditEventPage = () => {
  return (
    <div>
      <EditEventHeader />
      <EditEventForm />
    </div>
  );
};

export default EditEventPage;
