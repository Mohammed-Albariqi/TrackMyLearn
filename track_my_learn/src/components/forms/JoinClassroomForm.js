import React, { useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import { ReactComponent as SvgDotPatternIcon } from "../../images/dot-pattern.svg";
import { ReactComponent as LoaderSpinner } from "feather-icons/dist/icons/loader.svg";
import { ReactComponent as LockIcon } from "feather-icons/dist/icons/x-octagon.svg";
import { db, ref, get, auth } from "services/firebase";
import { useNavigate } from "react-router-dom";
//import endpoint from "../../config";

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
const InputContainer = tw.div`relative py-5 mt-6`;
const Label = tw.label`absolute top-0 left-0 tracking-wide font-semibold text-sm`;

const Input = tw.input``;
const SubmitButton = tw.button`w-full sm:w-32 mt-6 py-3 bg-gray-100 text-primary-500 rounded-full font-bold tracking-wide shadow-lg uppercase text-sm transition duration-300 transform focus:outline-none focus:shadow-outline hover:bg-gray-300 hover:text-primary-700 hocus:-translate-y-px hocus:shadow-xl`;

const SvgDotPattern1 = tw(
  SvgDotPatternIcon
)`absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2 -z-10 opacity-50 text-primary-500 fill-current w-24`;

export default (param) => {
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();
  // -- Get Course Details from Firebase
  const getCourseData = async () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // -- Check if the user is student
        get(ref(db, `users/${user.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            if (snapshot.val().type !== "instructor") {
              setType("student");
              setStudentName(snapshot.val().name);
            } else {
              setType("instructor");
              setStudentName(snapshot.val().name);
            }
          }
        });

        if (type === "instructor") {
          navigate("/dashboard");
        }

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

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      // Get classroom data from firebase
      await get(ref(db, `classroom/${param.id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const classroom = snapshot.val();
          // Send userId & classroom to the Meetings React App on port 3001
          window.location.replace(
            `${process.env.REACT_APP_ENDPOINT}?classroom=${classroom.id}&uid=${auth.currentUser.uid}`
          );
        } else {
          console.log("No data available");
        }
      });
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Condition ? true : false
  return loading ? (
    <Container>
      <Content>
        <TwoColumn>
          <div tw="mx-auto max-w-4xl">
            <LoaderSpinner />
          </div>
        </TwoColumn>
      </Content>
    </Container>
  ) : course.title ? (
    <Container>
      <Content>
        <FormContainer>
          <div tw="mx-auto max-w-4xl">
            <h2>Join Classroom for {course.title}</h2>
            <h3>
              Instructed by: <b>{course.instructor}</b>
            </h3>
            <form action="#">
              <InputContainer>
                <Label htmlFor="name-input">Name</Label>
                <Input
                  id="50-min"
                  type="text"
                  disabled={true}
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </InputContainer>
              <SubmitButton
                type="submit"
                value="Submit"
                style={{ width: "100%" }}
                onClick={(e) => handleJoin(e)}
              >
                Join Classroom
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
              width: "30px",
              height: "30px",
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
