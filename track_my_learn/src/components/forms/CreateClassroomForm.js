import React, { useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import { ReactComponent as SvgDotPatternIcon } from "../../images/dot-pattern.svg";
import { ReactComponent as LoaderSpinner } from "feather-icons/dist/icons/loader.svg";
import { ReactComponent as LockIcon } from "feather-icons/dist/icons/x-octagon.svg";
import { db, ref, get, auth, set } from "services/firebase";
import { VIDEOSDK_TOKEN, createMeeting } from "services/videoSDK";
// import { useNavigate } from "react-router-dom";

const Container = tw.div`relative`;
const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;

const FormContainer = styled.div`
  ${tw`p-10 sm:p-12 md:p-16 bg-primary-500 text-gray-100 rounded-lg relative`}
  form {
    ${tw`mt-4`}
  }
  h2 {
    ${tw`text-3xl sm:text-4xl font-bold`}
  }
  input,
  textarea {
    ${tw`w-full bg-transparent text-gray-100 text-base font-medium tracking-wide border-b-2 py-2 text-gray-100 hocus:border-pink-400 focus:outline-none transition duration-200`};

    ::placeholder {
      ${tw`text-gray-500`}
    }
  }
`;

const TwoColumn = tw.div`flex flex-col sm:flex-row justify-between`;
const Column = tw.div`sm:w-5/12 flex flex-col`;
const InputContainer = tw.div`relative py-5 mt-6`;
const Label = tw.label`absolute top-0 left-0 tracking-wide font-semibold text-sm`;
const RadioLabel = tw.label`top-0 left-0 tracking-wide font-semibold text-sm`;

const Input = tw.input``;
const SubmitButton = tw.button`w-full sm:w-32 mt-6 py-3 bg-gray-100 text-primary-500 rounded-full font-bold tracking-wide shadow-lg uppercase text-sm transition duration-300 transform focus:outline-none focus:shadow-outline hover:bg-gray-300 hover:text-primary-700 hocus:-translate-y-px hocus:shadow-xl`;

const SvgDotPattern1 = tw(
  SvgDotPatternIcon
)`absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2 -z-10 opacity-50 text-primary-500 fill-current w-24`;

export default (param) => {
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);
  const [lectureTime, setLectureTime] = useState();
  const [minimumFocus, setMinimumFocus] = useState();
  const [popUpQuestions, setPopUpQuestions] = useState(false);
  const [howManyQuestions, setHowManyQuestions] = useState(null);
  const [questionValues, setQuestionValues] = useState([0]);
  const [answerValues, setAnswerValues] = useState([0]);
  const [type, setType] = useState("");
  // TODO: const navigate = useNavigate();
  // -- Get Course Details from Firebase
  const getCourseData = async () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // -- Check if the user is instructor
        get(ref(db, `users/${user.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            if (snapshot.val().type !== "instructor") {
              setType("student");
            } else {
              setType("instructor");
            }
          }
        });

        // -- Checking if the user is student?
        if (type === "student") return;

        // -- Get course details
        const courseRef = ref(db, `users/${user.uid}/courses/${param.id}`);
        get(courseRef).then((snapshot) => {
          if (snapshot.exists()) {
            setCourse(snapshot.val());
            setLoading(false);
          } else {
            console.log("No data available");
          }
        });
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      // -- data validation --
      if (lectureTime === undefined || minimumFocus === undefined ||
          howManyQuestions === null ||
          questionValues===[null]|| answerValues===[null]) {
        alert("Please fill in all the fields");
        return;
      }
      
      
      console.log(`Questions: ${questionValues}`);
      console.log(`Answers: ${answerValues}`);
      const questions = questionValues.map((q) => q.trim());
      const answers = answerValues.map((a) => {
        const splitAnswers = a.split(",").map((ans) => ans.trim());
        if (splitAnswers.length !== 4) {
          throw new Error(
            "Answers must be in the format 'answer1, answer2, answer3, answer4'"
          );
        }
        return splitAnswers;
      });

      const questionsAndAnswers = questions.map((question, index) => ({
        question,
        answers: answers[index],
      }));
      await createMeeting({ token: VIDEOSDK_TOKEN }).then((data) => {
        console.log(data);
        set(ref(db, `classroom/${param.id}`), {
          ...course,
          questions: questionsAndAnswers,
          lectureTime: lectureTime,
          minimumFocus: minimumFocus,
          roomId: data,
        });
      });
      setSubmitted(false);
      setFinished(true);
      // TODO: Redirect to the classroom page
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return submitted ? (
    <Container>
      <Content>
        <FormContainer>
          <div tw="mx-auto max-w-4xl">
            <h2>Creating Classroom for {course.title}...</h2>
            <form action="#"></form>
            <LoaderSpinner />
          </div>
        </FormContainer>
        <SvgDotPattern1 />
      </Content>
    </Container>
  ) : finished ? (
    <Container>
      <Content>
        <FormContainer>
          <div tw="mx-auto max-w-4xl">
            <h2>Classroom for {course.title} Was Created Successfully</h2>
            <form action="#"></form>
          </div>
        </FormContainer>
        <SvgDotPattern1 />
      </Content>
    </Container>
  ) : loading ? (
    <Container>
      <Content>
        <TwoColumn>
          <LoaderSpinner />
        </TwoColumn>
        <SvgDotPattern1 />
      </Content>
    </Container>
  ) : type === "instructor" ? (
    <Container>
      <Content>
        <FormContainer>
          <div tw="mx-auto max-w-4xl">
            <h2>Create Classroom for {course.title}</h2>
            <form action="#">
              <TwoColumn>
                <Column>
                  <InputContainer>
                    <Label htmlFor="name-input">Lecture Time</Label>
                    <Input
                      id="50-min"
                      type="radio"
                      name="lecture-time"
                      value="50"
                      onChange={(e) => setLectureTime(e.target.value)}
                      style={{ width: "25px" }}
                    />
                    <RadioLabel
                      htmlFor="50-min"
                      style={{ marginLeft: "3px", marginRight: "10px" }}
                    >
                      50 min
                    </RadioLabel>
                    <Input
                      id="120-min"
                      type="radio"
                      name="lecture-time"
                      value="120"
                      onChange={(e) => setLectureTime(e.target.value)}
                      style={{ width: "25px" }}
                    />
                    <RadioLabel
                      htmlFor="120-min"
                      style={{ marginLeft: "3px", marginRight: "10px" }}
                    >
                      120 min
                    </RadioLabel>
                  </InputContainer>
                  <InputContainer>
                    <Label htmlFor="minimum-focus">Minimum Focus Rate</Label>
                    <Input
                      id="25-percent"
                      type="radio"
                      name="minimum-focus"
                      value="25"
                      onChange={(e) => setMinimumFocus(e.target.value)}
                      style={{ width: "25px" }}
                    />
                    <RadioLabel
                      htmlFor="25-percent"
                      style={{ marginLeft: "3px", marginRight: "10px" }}
                    >
                      25%
                    </RadioLabel>
                    <Input
                      id="50-percent"
                      type="radio"
                      name="minimum-focus"
                      value="50"
                      onChange={(e) => setMinimumFocus(e.target.value)}
                      style={{ width: "25px" }}
                    />
                    <RadioLabel
                      htmlFor="50-percent"
                      style={{ marginLeft: "3px", marginRight: "10px" }}
                    >
                      50%
                    </RadioLabel>
                    <Input
                      id="75-percent"
                      type="radio"
                      name="minimum-focus"
                      value="75"
                      onChange={(e) => setMinimumFocus(e.target.value)}
                      style={{ width: "25px" }}
                    />
                    <RadioLabel
                      htmlFor="75"
                      style={{ marginLeft: "3px", marginRight: "10px" }}
                    >
                      75%
                    </RadioLabel>
                    <Input
                      id="90-percent"
                      type="radio"
                      name="minimum-focus"
                      value="90"
                      onChange={(e) => setMinimumFocus(e.target.value)}
                      style={{ width: "25px" }}
                    />
                    <RadioLabel
                      htmlFor="90-percent"
                      style={{ marginLeft: "3px", marginRight: "10px" }}
                    >
                      90%
                    </RadioLabel>
                  </InputContainer>
                </Column>
                <Column>
                  <InputContainer tw="flex-1">
                    <Label htmlFor="name-input">Set Pop-up Questions?</Label>
                    <Input
                      id="pop-up-yes"
                      type="radio"
                      name="pop-up"
                      value={true}
                      onClick={() => setPopUpQuestions(true)}
                      style={{ width: "25px" }}
                    />
                    <RadioLabel
                      htmlFor="pop-up-yes"
                      style={{ marginLeft: "3px", marginRight: "10px" }}
                    >
                      Yes
                    </RadioLabel>
                    <Input
                      id="pop-up-no"
                      type="radio"
                      name="pop-up"
                      value={false}
                      onClick={() => setPopUpQuestions(false)}
                      style={{ width: "25px" }}
                    />
                    <RadioLabel
                      htmlFor="pop-up-no"
                      style={{ marginLeft: "3px", marginRight: "10px" }}
                    >
                      No
                    </RadioLabel>
                  </InputContainer>
                  {popUpQuestions && (
                    <InputContainer tw="flex-1">
                      <Label htmlFor="pop-up-name">
                        How Many Pop-up Questions?
                      </Label>
                      <Input
                        id="pop-up-1"
                        type="radio"
                        name="how-many-pop-up"
                        value={1}
                        onClick={() => setHowManyQuestions(1)}
                        style={{ width: "25px" }}
                      />
                      <RadioLabel
                        htmlFor="pop-up-1"
                        style={{ marginLeft: "3px", marginRight: "10px" }}
                      >
                        1
                      </RadioLabel>
                      <Input
                        id="pop-up-2"
                        type="radio"
                        name="how-many-pop-up"
                        value={2}
                        onClick={() => setHowManyQuestions(2)}
                        style={{ width: "25px" }}
                      />
                      <RadioLabel
                        htmlFor="pop-up-2"
                        style={{ marginLeft: "3px", marginRight: "10px" }}
                      >
                        2
                      </RadioLabel>
                      <Input
                        id="pop-up-3"
                        type="radio"
                        name="how-many-pop-up"
                        value={3}
                        onClick={() => setHowManyQuestions(3)}
                        style={{ width: "25px" }}
                      />
                      <RadioLabel
                        htmlFor="pop-up-3"
                        style={{ marginLeft: "3px", marginRight: "10px" }}
                      >
                        3
                      </RadioLabel>
                      <Input
                        id="pop-up-4"
                        type="radio"
                        name="how-many-pop-up"
                        value={4}
                        onClick={() => setHowManyQuestions(4)}
                        style={{ width: "25px" }}
                      />
                      <RadioLabel
                        htmlFor="pop-up-4"
                        style={{ marginLeft: "3px", marginRight: "10px" }}
                      >
                        4
                      </RadioLabel>
                    </InputContainer>
                  )}
                </Column>
              </TwoColumn>
              {popUpQuestions && howManyQuestions > 0 && (
                <p key={"dynamic-p"}>
                  Use the following format: "answer1, answer2, answer3, answer4"
                  <br></br>
                  Where answer1 is the correct answer.
                </p>
              )}
              {popUpQuestions && howManyQuestions > 0  ? Array.from(Array(howManyQuestions).keys()).map(
                    (item, index) => (
                      <TwoColumn key={`pop-up-question-${index}`}>
                        <Column>
                          <InputContainer key={`k-${index}`}>
                            <Label htmlFor={`pop-up-question-${index}`}>
                              Pop-up Question {index + 1}
                            </Label>
                            <Input
                              key={`pop-up-question-${index}`}
                              type="text"
                              name={`pop-up-question-${index}`}
                              onChange={(e) => {
                                const newValues = [...questionValues];
                                newValues[index] = e.target.value;
                                setQuestionValues(newValues);
                              }}
                              placeholder="Pop-up Question"
                            />
                          </InputContainer>
                        </Column>
                        <Column>
                          <InputContainer key={`k-${index}`}>
                            <Label htmlFor={`pop-up-answer-${index}`}>
                              Pop-up Answer {index + 1}
                            </Label>
                            <Input
                              key={`pop-up-answer-${index}`}
                              type="text"
                              name={`pop-up-answer-${index}`}
                              onChange={(e) => {
                                const newValues = [...answerValues];
                                newValues[index] = e.target.value;
                                setAnswerValues(newValues);
                              }}
                              placeholder="answer1, answer2, answer3, answer4"
                            />
                          </InputContainer>
                        </Column>
                      </TwoColumn>
                    )
                  )
                : null}
              <SubmitButton
                type="submit"
                value="Submit"
                onClick={(e) => handleSubmit(e)}
              >
                Submit
              </SubmitButton>
            </form>
          </div>
          <SvgDotPattern1 />
        </FormContainer>
      </Content>
    </Container>
  ) : (
    <Container>
      <Content>
        <FormContainer>
          <LockIcon
            style={{
              width: "25px",
              height: "25px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "20px",
              display: "block",
            }}
          />
          <div tw="mx-auto max-w-4xl">
            <TwoColumn>
              <h2
                style={{
                  textAlign: "center",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                403 Forbidden
              </h2>
            </TwoColumn>
          </div>
          <SvgDotPattern1 />
        </FormContainer>
      </Content>
    </Container>
  );
};
