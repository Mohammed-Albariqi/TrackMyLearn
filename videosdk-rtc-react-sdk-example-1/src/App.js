import React, { useEffect, useState } from "react";
import { Constants, MeetingProvider } from "@videosdk.live/react-sdk";
import { LeaveScreen } from "./components/screens/LeaveScreen";
import { JoiningScreen } from "./components/screens/JoiningScreen";
import { MeetingContainer } from "./meeting/MeetingContainer";
import { MeetingAppProvider } from "./MeetingAppContextDef";
import { get, ref, db } from "./services/firebase";
import WaitingToJoinScreen from "./components/screens/WaitingToJoinScreen";

const App = () => {
  const [token, setToken] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [user, setUser] = useState();
  const [courses, setCourses] = useState([]);
  const [participantName, setParticipantName] = useState("");
  const [micOn, setMicOn] = useState(false);
  const [classroom, setClassroom] = useState();
  const [webcamOn, setWebcamOn] = useState(true);
  const [selectedMic, setSelectedMic] = useState({ id: null });
  const [selectedWebcam, setSelectedWebcam] = useState({ id: null });
  const [loading, setLoading] = useState(true);
  const [selectWebcamDeviceId, setSelectWebcamDeviceId] = useState(
    selectedWebcam.id
  );
  const [meetingMode, setMeetingMode] = useState(Constants.modes.CONFERENCE);
  const [selectMicDeviceId, setSelectMicDeviceId] = useState(selectedMic.id);
  const [isMeetingStarted, setMeetingStarted] = useState(false);
  const [isMeetingLeft, setIsMeetingLeft] = useState(false);

  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;

  const getData = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const classroom = urlParams.get("classroom");
    const uid = urlParams.get("uid");
    console.log(urlParams, classroom, uid);
    if (classroom && uid) {
      await get(ref(db, "users/" + uid))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            console.log(data);
            setUser(data);
            // TODO: Add user courses and check if user is authorized to join classroom
            setParticipantName(data.name);
            console.log(`setParticipantName: ${data.name}`);
          }
        })
        .then(async () => {
          await get(ref(db, "classroom/" + classroom)).then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              console.log(data);
              setClassroom(data);
              setMeetingId(data.roomId);
              console.log(`setMeetingId: ${data.roomId}`);
            }
          });
        })
        .then(() => {
          console.log(`courses: ${courses}`);
          console.log(`classroom: ${classroom}`);
          console.log(courses.includes(classroom));
          if (courses.includes(classroom)) {
            console.log(`user ${user.name} is authorized to join ${classroom}`);
          }
          setLoading(false);
          console.log("setLoading: false");
        });
    }
    console.log(meetingId, participantName);
    // Remove data from URL

    setLoading(false);
  };

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
    }
    getData();
  }, [isMobile]);

  return loading ? (
    <WaitingToJoinScreen />
  ) : !meetingId || !participantName ? (
    <div className="flex flex-col items-center justify-center h-screen">
      You are not authorized to access this page.
    </div>
  ) : (
    <>
      {isMeetingStarted ? (
        <MeetingAppProvider
          selectedMic={selectedMic}
          selectedWebcam={selectedWebcam}
          initialMicOn={micOn}
          initialWebcamOn={webcamOn}
        >
          <MeetingProvider
            config={{
              meetingId,
              micEnabled: micOn,
              webcamEnabled: webcamOn,
              name: participantName ? participantName : "TestUser",
              mode: meetingMode,
              multiStream: true,
            }}
            token={token}
            reinitialiseMeetingOnConfigChange={true}
            joinWithoutUserInteraction={true}
          >
            <MeetingContainer
              onMeetingLeave={() => {
                window.location.replace("http://localhost:3000/meeting-ended");
                setMeetingId("Leaved");
                setParticipantName("Leaved");
                setToken("");
                setWebcamOn(false);
                setMicOn(false);
                setMeetingStarted(false);
              }}
              setIsMeetingLeft={setIsMeetingLeft}
              selectedMic={selectedMic}
              selectedWebcam={selectedWebcam}
              selectWebcamDeviceId={selectWebcamDeviceId}
              setSelectWebcamDeviceId={setSelectWebcamDeviceId}
              selectMicDeviceId={selectMicDeviceId}
              setSelectMicDeviceId={setSelectMicDeviceId}
              micEnabled={micOn}
              webcamEnabled={webcamOn}
              classroom={classroom}
              user={user}
            />
          </MeetingProvider>
        </MeetingAppProvider>
      ) : isMeetingLeft ? (
        <LeaveScreen setIsMeetingLeft={setIsMeetingLeft} />
      ) : (
        <JoiningScreen
          participantName={participantName}
          setParticipantName={setParticipantName}
          setMeetingId={setMeetingId}
          setToken={setToken}
          setMicOn={setMicOn}
          micEnabled={micOn}
          classroom={classroom}
          webcamEnabled={webcamOn}
          setSelectedMic={setSelectedMic}
          setSelectedWebcam={setSelectedWebcam}
          setWebcamOn={setWebcamOn}
          onClickStartMeeting={() => {
            setMeetingStarted(true);
          }}
          startMeeting={isMeetingStarted}
          setIsMeetingLeft={setIsMeetingLeft}
          meetingMode={meetingMode}
          setMeetingMode={setMeetingMode}
        />
      )}
    </>
  );
};

export default App;
