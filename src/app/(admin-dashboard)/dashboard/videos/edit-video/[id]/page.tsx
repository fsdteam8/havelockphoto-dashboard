import React from "react";
import EditVideoForm from "../_components/edit-video-form";
import EditVideoHeader from "../_components/edit-video-header";

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <EditVideoHeader videoId={params.id} />
      <EditVideoForm videoId={params.id} />
    </div>
  );
};

export default Page;
