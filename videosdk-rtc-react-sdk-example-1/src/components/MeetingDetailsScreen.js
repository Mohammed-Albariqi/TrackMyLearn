import { CheckIcon, ClipboardIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";

export function MeetingDetailsScreen({
  onClickJoin,
  _handleOnCreateMeeting,
  participantName,
  setParticipantName,
  classroom,
  videoTrack,
  setVideoTrack,
  onClickStartMeeting,
}) {
  const [meetingId, setMeetingId] = useState("");
  const [meetingIdError, setMeetingIdError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isJoinMeetingClicked, setIsJoinMeetingClicked] = useState(false);

  useEffect(() => {
    setMeetingId(classroom.roomId);
  }, []);
  return (
    <div
      className={`flex flex-1 flex-col justify-center w-full md:p-[6px] sm:p-1 p-1.5`}
    >
      {/* {iscreateMeetingClicked ? (
        <div className="border border-solid border-gray-400 rounded-xl px-4 py-3  flex items-center justify-center">
          <p className="text-white text-base">
            {`Meeting code : ${meetingId}`}
          </p>
          <button
            className="ml-2"
            onClick={() => {
              navigator.clipboard.writeText(meetingId);
              setIsCopied(true);
              setTimeout(() => {
                setIsCopied(false);
              }, 3000);
            }}
          >
            {isCopied ? (
              <CheckIcon className="h-5 w-5 text-green-400" />
            ) : (
              <ClipboardIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      ) : (     */}
      {isJoinMeetingClicked ? (
        <>
          <input
            defaultValue={classroom.roomId}
            disabled
            placeholder={"Enter meeting Id"}
            className="px-4 py-3 bg-gray-650 rounded-xl text-white w-full text-center"
          />
          {meetingIdError && (
            <p className="text-xs text-red-600">{`Please enter valid meetingId`}</p>
          )}
        </>
      ) : null}

      {isJoinMeetingClicked && (
        <>
          <button
            disabled={participantName.length < 3}
            className={`w-full ${
              participantName.length < 3 ? "bg-gray-650" : "bg-purple-350"
            }  text-white px-2 py-3 rounded-xl mt-5`}
            onClick={(e) => {
              console.log(`Join Meeting Clicked ${isJoinMeetingClicked}`);
              console.log(`Meeting ID: ${meetingId}`);
              if (isJoinMeetingClicked) {
                if (videoTrack) {
                  videoTrack.stop();
                  setVideoTrack(null);
                }
                if (meetingId.match("\\w{4}\\-\\w{4}\\-\\w{4}")) {
                  console.log(`Matched: ${meetingId}`);
                  onClickJoin(meetingId);
                } else setMeetingIdError(true);
              }
            }}
          >
            {`Join ${classroom.title} Classroom`}
          </button>
        </>
      )}

      {!isJoinMeetingClicked && (
        <div className="w-full md:mt-0 mt-4 flex flex-col">
          <div className="flex items-center justify-center flex-col w-full ">
            <button
              className="w-full bg-gray-650 text-white px-2 py-3 rounded-xl mt-5"
              onClick={(e) => {
                setIsJoinMeetingClicked(true);
              }}
            >
              Join {classroom ? `${classroom.title} Classroom` : "meeting"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
