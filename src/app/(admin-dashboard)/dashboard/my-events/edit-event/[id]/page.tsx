import React from "react";
import EditEventHeader from "../_components/edit-event-header";
import EditEventForm from "../_components/edit-event-form";

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <EditEventHeader eventId={params.id} />
      <EditEventForm eventId={params.id} />
    </div>
  );
};

export default Page;
