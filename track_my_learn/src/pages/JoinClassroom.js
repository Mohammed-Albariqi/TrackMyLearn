import React, { useEffect } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Header from "components/headers/light.js";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "services/firebase";
import JoinClassroomForm from "components/forms/JoinClassroomForm";
export default () => {
  const navigate = useNavigate();
  // Get the id from the URL
  const { id } = useParams();
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
      <JoinClassroomForm id={id} />
    </AnimationRevealPage>
  );
};
