import React, { useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import { ReactComponent as SvgDotPatternIcon } from "../../images/dot-pattern.svg";
import { ReactComponent as LoaderSpinner } from "feather-icons/dist/icons/loader.svg";
import { ReactComponent as LockIcon } from "feather-icons/dist/icons/x-octagon.svg";
import { db, ref, get, auth, set, update } from "services/firebase";
import { useData } from "services/useData";
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
  const [id, setId] = useState("");
  const [course, setCourse] = useState({
    title: "",
    time: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const { userData } = useData();
  // TODO: const navigate = useNavigate();
  // -- Get Course Details from Firebase

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!course.title || !course.time || !course.description) {
      return alert("Please fill in all the fields");
    }
    setLoading(true);
    setSubmitted(true);
    try {
      // Generate a section ID e.g T40 or DR8 randomly
      const sectionId =
        Math.random().toString(36).substring(2, 3).toUpperCase() +
        Math.floor(Math.random() * 100);

      const tempId =
        course.title.toLowerCase().replace(/\s/g, "-") +
        "-" +
        sectionId.toLowerCase() +
        "-" +
        Math.floor(Math.random() * 100000);

      setId(tempId);
      console.log(id, sectionId);
      update(ref(db, `courses/${tempId}`), {
        ...course,
        id: tempId,
        section: sectionId,
        instructor: userData.name,
      });
      update(ref(db, `users/${userData.uid}/courses/${tempId}`), {
        ...course,
        id: tempId,
        section: sectionId,
        instructor: userData.name,
      });
      setSubmitted(false);
      setFinished(true);
      // TODO: Redirect to the classroom page
    } catch (error) {
      alert(error.message);
    }
  };

  return submitted ? (
    <Container>
      <Content>
        <FormContainer>
          <div tw="mx-auto max-w-4xl">
            <h2>Creating {course.title} Course...</h2>
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
            <h2>
              {course.title} Course Was Created Successfully with ID {id}
            </h2>
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
  ) : userData.type === "instructor" ? (
    <Container>
      <Content>
        <FormContainer>
          <div tw="mx-auto max-w-4xl">
            <h2>Create Course</h2>
            <form action="#">
              <TwoColumn>
                <Column>
                  <InputContainer>
                    <Label htmlFor="name-input">Course Name</Label>
                    <Input
                      id="name-input"
                      type="text"
                      name="name"
                      placeholder="Course Name"
                      onChange={(e) =>
                        setCourse({ ...course, title: e.target.value })
                      }
                    />
                  </InputContainer>
                  <InputContainer>
                    <Label htmlFor="description-input">Lecture Time</Label>
                    <Input
                      id="50-min"
                      type="radio"
                      name="lecture-time"
                      value="50"
                      onChange={(e) =>
                        setCourse({
                          ...course,
                          time: e.target.value + " Minutes",
                        })
                      }
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
                      onChange={(e) =>
                        setCourse({
                          ...course,
                          time: e.target.value + " Minutes",
                        })
                      }
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
                    <Label htmlFor="description-input">Description</Label>
                    <Input
                      id="description-input"
                      type="text"
                      name="description"
                      placeholder="Course Description"
                      onChange={(e) =>
                        setCourse({ ...course, description: e.target.value })
                      }
                    />
                  </InputContainer>
                </Column>
                <SubmitButton
                  type="submit"
                  value="Submit"
                  onClick={(e) => handleSubmit(e)}
                >
                  Submit
                </SubmitButton>
              </TwoColumn>
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
