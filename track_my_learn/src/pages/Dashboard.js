import React, { useEffect } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Header from "components/headers/light.js";
import Courses from "components/cards/Courses";
import { useNavigate } from "react-router-dom";
import { auth } from "services/firebase";
export default () => {
  const navigate = useNavigate();

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
      <Courses />
    </AnimationRevealPage>
  );
};
