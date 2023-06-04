import React from "react";
import GlobalStyles from "styles/GlobalStyles";
import { css } from "styled-components/macro"; //eslint-disable-line

/*
 * This is the entry point component of this project. You can change the below exported default App component to any of
 * the prebuilt landing page components by uncommenting their import and export lines respectively.
 * See one of the landing page components to better understand how to import and render different components (Always
 * make sure if you are building your own page, the root component should be the AnimationRevealPage component. You can
 * disable the animation by using the disabled prop.
 *
 * The App component below is using React router to render the landing page that you see on the live demo website
 * and the component previews.
 *
 */

import ComponentRenderer from "ComponentRenderer.js";
import MainLandingPage from "MainLandingPage.js";
import Login from "pages/Login";
import SignUp from "pages/Signup";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "pages/Dashboard";
import ForgetPassword from "pages/ForgetPassword";
import CreateClassroom from "pages/CreateClassroom";
import JoinClassroom from "pages/JoinClassroom";
import JoinCourse from "pages/JoinCourse";
import CreateCourse from "pages/CreateCourse";
import MeetingEnded from "pages/MeetingEnded";
import ClassroomReport from "pages/ClassroomReport";

export default function App() {
  // If you want to disable the animation just use the disabled `prop` like below on your page's component
  // return <AnimationRevealPage disabled>xxxxxxxxxx</AnimationRevealPage>;

  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route
            path="/components/:type/:subtype/:name"
            element={<ComponentRenderer />}
          />
          <Route
            path="/components/:type/:name"
            element={<ComponentRenderer />}
          />
          <Route path="/" element={<MainLandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-classroom/:id" element={<CreateClassroom />} />
          <Route path="/join-classroom/:id" element={<JoinClassroom />} />
          <Route path="/join-course" element={<JoinCourse />} />
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/report/:id" element={<ClassroomReport />} />
          <Route path="/meeting-ended" element={<MeetingEnded />} />
        </Routes>
      </Router>
    </>
  );
}
