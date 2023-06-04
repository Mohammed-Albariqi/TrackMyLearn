import React, { useState, useEffect, memo, useMemo, useCallback } from "react";
import ReactModal from "react-modal";
import { useData } from "../hooks/useData";

const PopUpQuestions = memo(({ user, peerId, classroom }) => {
  const [showPopUpQuestions, setShowPopUpQuestions] = useState(false);
  const [popUpQuestions, setPopUpQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledAnswers, setShuffledAnswers] = useState(null);
  const [timer, setTimer] = useState(40); // Timer value in seconds
  const { saveUserData, getUserData } = useData();
  const [focusingPercentage, setFocusingPercentage] = useState(null);
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    if (classroom && classroom.questions) {
      setPopUpQuestions(classroom.questions);
    }
  }, [classroom]);

  useEffect(() => {
    async function fetchUserData() {
      if (popUpQuestions.length > 0) {
        const userData = await getUserData(peerId);
        if (
          userData &&
          userData.focusingPercentage < 850 &&
          !asked &&
          userData.type !== "instructor"
        ) {
          setTimer(40);
          

          setCurrentQuestionIndex(0);
          setShuffledAnswers(
            shuffleArray(popUpQuestions[currentQuestionIndex].answers)
          );
          setShowPopUpQuestions(true);
         setAsked(true);
        }
      }
      
      
      }
    
    
    fetchUserData();
  }, [popUpQuestions, getUserData, peerId, asked, currentQuestionIndex]);

  useEffect(() => {
    let interval;
    if (showPopUpQuestions) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            setShowPopUpQuestions(false);
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [showPopUpQuestions]);

  useEffect(() => {
    console.log("[popUpQuestions] - Fetching user data.", peerId);
    const fetchUserData = async () => {
      const userData = await getUserData(peerId);
      console.log("[popUpQuestion] - userData", userData);
      if (userData && userData.focusingPercentage !== undefined) {
        const newFocusingPercentage = userData.focusingPercentage;
        console.log(
          "[popUpQuestions] - Focusing percentage: ",
          newFocusingPercentage
        );
        setFocusingPercentage(newFocusingPercentage);
        console.log(
          `[popUpQuestions] - Set Focusing Percentage: ${newFocusingPercentage}`
        );
      }
    };
    fetchUserData();
  }, [getUserData, peerId, saveUserData, user]);

  useEffect(() => {
    if (popUpQuestions.length > 0 && showPopUpQuestions) {
      setShuffledAnswers(
        shuffleArray(popUpQuestions[currentQuestionIndex].answers)
      );
    }
  }, [popUpQuestions, currentQuestionIndex, showPopUpQuestions]);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleAnswer = useCallback(
    async (answer) => {
      if (answer === popUpQuestions[currentQuestionIndex].answers[0]) {
        const tempUser = await getUserData(peerId);
        const newFocusingPercentage = tempUser.focusingPercentage + 150;
        saveUserData(user, peerId, newFocusingPercentage);
        console.log(
          `User answered correctly, increasing focusing percentage by 15%.`
        );
      } else {
        console.log(
          `User answered incorrectly. No change in focusing percentage.`
        );
      }
      setShowPopUpQuestions(false);
    },
    [
      popUpQuestions,
      currentQuestionIndex,
      getUserData,
      peerId,
      saveUserData,
      user,
    ]
  );

  const renderAnswers = useMemo(() => {
    if (shuffledAnswers) {
      return shuffledAnswers.map((answer, index) => (
        <button
          key={index}
          className="pop-up-questions__answer-button bg-white justify-between flex-row p-2 m-2 rounded-md"
          onClick={() => handleAnswer(answer)}
        >
          {answer}
        </button>
      ));
    } else {
      return [];
    }
  }, [shuffledAnswers, handleAnswer]);

  return (
    popUpQuestions.length > 0 &&
    showPopUpQuestions &&
    focusingPercentage !== null && // Check for null value
    focusingPercentage < 850 &&
    asked && (
      <ReactModal
        isOpen={showPopUpQuestions}
        className="backdrop-opacity-100 bg-gray-800 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        contentLabel="Pop-up Questions"
        style={{ overlay: { backgroundColor: "transparent" } }}
        ariaHideApp={false}
      >
        <div className="box-border h-auto w-auto p-4 border-4">
          <div className="pop-up-questions flex flex-col text-white">
            <div className="pop-up-questions__timer flex justify-center items-center">
              <div className="timer-circle">{timer}</div>
            </div>
            <div className="pop-up-questions__question">
              {popUpQuestions[currentQuestionIndex].question}
            </div>
            <div className="pop-up-questions__answers flex flex-col">
              <div className="flex justify-between">
                <button className="answer-button text-black">
                  {renderAnswers[0]}
                </button>
                <button className="answer-button text-black">
                  {renderAnswers[1]}
                </button>
              </div>
              <div className="flex justify-between">
                <button className="answer-button text-black">
                  {renderAnswers[2]}
                </button>
                <button className="answer-button text-black">
                  {renderAnswers[3]}
                </button>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>
    )
  );
});

export default PopUpQuestions;
