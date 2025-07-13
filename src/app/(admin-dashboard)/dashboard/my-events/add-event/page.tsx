import React from "react";
import AddEventHeader from "./_components/add-event-header";
import dynamic from "next/dynamic";

const AddEventForm = dynamic(() => import("./_components/add-event-form"), {
  ssr: false,
});

const AddEventPage = () => {
  return (
    <div>
      <AddEventHeader />
      <AddEventForm />
    </div>
  );
};

export default AddEventPage;
