import * as faceapi from "face-api.js";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useData } from "../hooks/useData";

function FocusTracker({
  user,
  peerId,
  lectureTime,
  previousFocusingPercentage,
}) {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(false);

  const { saveUserData, userData, getUserData } = useData();

  const [focusingPercentage, setFocusingPercentage] = useState(1000);

  const videoRef = useRef();
  const videoHeight = 480;
  const videoWidth = 640;
  const canvasRef = useRef();
  const startTimeRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
      startVideo();
    };

    loadModels();
  }, []);

  const startVideo = () => {
    setCaptureVideo(true);
    startTimeRef.current = new Date().getTime(); // Record the start time
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  useEffect(() => {
    if (captureVideo && modelsLoaded) {
      const interval = setInterval(
        async () => {
          if (canvasRef && canvasRef.current) {
            canvasRef.current.innerHTML = await faceapi.createCanvasFromMedia(
              videoRef.current
            );
            const displaySize = {
              width: videoWidth,
              height: videoHeight,
            };

            faceapi.matchDimensions(canvasRef.current, displaySize);

            const detections = await faceapi
              .detectAllFaces(
                videoRef.current,
                new faceapi.TinyFaceDetectorOptions()
              )
              .withFaceLandmarks()
              .withFaceExpressions();

            const resizedDetections = faceapi.resizeResults(
              detections,
              displaySize
            );

            const previousData = await getUserData(peerId);
            if (previousData && previousData.focusingPercentage) {
              console.log(
                `[Focus Percentage]: ${previousData.focusingPercentage}`
              );
              setFocusingPercentage(previousData.focusingPercentage);
            }
            if (detections.length > 0) {
              console.log(`user is focusing`);
              // Increase the focusing percentage by 1 if it's less than 1000
              setFocusingPercentage((prevPercentage) =>
                prevPercentage < 1000 && previousData ? previousData.focusingPercentage + 1
                  : prevPercentage
              );
            } else {
              console.log(`user is not focusing`);
              // Decrease the focusing percentage by 1 if it's greater than 0
              setFocusingPercentage((prevPercentage) =>
                prevPercentage > 0 && previousData ? previousData.focusingPercentage - 10
                  : prevPercentage
              );
            }
            saveUserData(user, peerId, focusingPercentage);
            canvasRef &&
              canvasRef.current &&
              canvasRef.current
                .getContext("2d")
                .clearRect(0, 0, videoWidth, videoHeight);
            canvasRef &&
              canvasRef.current &&
              faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
            canvasRef &&
              canvasRef.current &&
              faceapi.draw.drawFaceLandmarks(
                canvasRef.current,
                resizedDetections
              );
            canvasRef &&
              canvasRef.current &&
              faceapi.draw.drawFaceExpressions(
                canvasRef.current,
                resizedDetections
              );
          }
        },
        lectureTime === "50" ? 3000 : 7200
      );

      return () => clearInterval(interval);
    }
  }, [captureVideo, lectureTime, modelsLoaded]);

  const updateUserData = useCallback(() => {
    saveUserData(user, peerId, focusingPercentage, () => {
      console.log(`user focusing and data updated to ${focusingPercentage}`);
    });
  }, [focusingPercentage, peerId, saveUserData, user]);

  useEffect(() => {
    updateUserData();
  }, [focusingPercentage, updateUserData]);

  const handleVideoOnPlay = () => {};

  const closeWebcam = () => {
    videoRef.current.pause();
    videoRef.current.srcObject.getTracks()[0].stop();
    setCaptureVideo(false);
  };

  return (
    <div hidden>
      {captureVideo ? (
        modelsLoaded ? (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              <video
                ref={videoRef}
                height={videoHeight}
                width={videoWidth}
                onPlay={handleVideoOnPlay}
                style={{ borderRadius: "10px" }}
              />
              <canvas ref={canvasRef} style={{ position: "absolute" }} />
            </div>
          </div>
        ) : (
          <div>loading...</div>
        )
      ) : (
        <></>
      )}
    </div>
  );
}

export default FocusTracker;
