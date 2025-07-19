import React from "react";
// import dynamic from "next/dynamic";
import AddVideoForm from "./_components/add-video-form";
import AddVideoHeader from "./_components/add-video-header";

// const AddEventForm = dynamic(() => import("./_components/add-video-form"), {
//   ssr: false,
// });

const AddVideosPage = () => {
  return (
    <div>
      <AddVideoHeader />
      <AddVideoForm />
    </div>
  );
};

export default AddVideosPage;
