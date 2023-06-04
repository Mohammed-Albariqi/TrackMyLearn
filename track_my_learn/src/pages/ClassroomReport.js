import React, { useEffect } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Header from "components/headers/light.js";
import ClassroomReportForm from "components/forms/ClassroomReportForm";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "services/firebase";
export default () => {
  const navigate = useNavigate();
  // Get the id from the URL
  const location = useLocation();
  const card = location.state;
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <AnimationRevealPage>
      <Header roundedHeaderButton={true} />
      <ClassroomReportForm class={card} />
    </AnimationRevealPage>
  );
};
