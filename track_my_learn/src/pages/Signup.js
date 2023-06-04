import React, { useState, useEffect } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import illustration from "images/signup-illustration.svg";
import logo from "images/logo.svg";
import { ReactComponent as SignUpIcon } from "feather-icons/dist/icons/user-plus.svg";
import { useNavigate } from "react-router-dom";
import { auth, registerWithEmailAndPassword } from "services/firebase";

// -- Styling --
const Container = tw(
  ContainerBase
)`min-h-screen bg-primary-900 text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;
const RadioLabel = tw.label`top-0 left-0 tracking-wide font-semibold text-sm`;

const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-purple-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${(props) => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full max-w-lg bg-contain bg-center bg-no-repeat`}
`;
// TODO: Select Type.
// TODO: Checkbox for agreeing to the terms.
const Signup = () => {
  // -- Page Variables --
  const logoLinkUrl = "#";
  const illustrationImageSrc = illustration;
  const headingText = "Sign Up to TrackMyLearn";
  const submitButtonText = "Sign Up";
  const SubmitButtonIcon = SignUpIcon;
  const tosUrl = "#";
  const privacyPolicyUrl = "#";
  const signInUrl = "login";

  const navigate = useNavigate();

  // -- Starting backend --
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [userType, setUserType] = useState("");
  const [checked, setChecked] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    // -- Validating Data --
    if (
      !name ||
      !email ||
      !password ||
      !passwordConfirmation ||
      !userType ||
      !checked
    ) {
      alert("Please fill in all fields");
      return;
    }
    if (password !== passwordConfirmation) {
      alert("Passwords do not match");
      return;
    }
    if (password < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    // -- Adding user to firebase authentication & realtime database --
    await registerWithEmailAndPassword(name, email, password, userType);
    navigate("/");
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <AnimationRevealPage>
      <Container>
        <Content>
          <MainContainer>
            <LogoLink href={logoLinkUrl}>
              <LogoImage src={logo} />
            </LogoLink>
            <MainContent>
              <Heading>{headingText}</Heading>
              <FormContainer>
                <Form>
                  <Input
                    type="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Password Confirmation"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                  />
                  <div className="flex flex-row items-center center">
                    <Input
                      id="student"
                      type="radio"
                      name="user-type"
                      value={"student"}
                      onClick={() => setUserType("student")}
                      style={{ width: "25px" }}
                    />
                    <RadioLabel
                      htmlFor="student"
                      style={{ marginLeft: "3px", marginRight: "10px" }}
                    >
                      Student
                    </RadioLabel>
                    <Input
                      id="instructor"
                      type="radio"
                      name="user-type"
                      value={"instructor"}
                      onClick={() => setUserType("instructor")}
                      style={{ width: "25px" }}
                    />
                    <RadioLabel
                      htmlFor="instructor"
                      style={{ marginLeft: "3px", marginRight: "10px" }}
                    >
                      Instructor
                    </RadioLabel>
                  </div>
                  <div className="flex flex-row items-center center">
                    <Input
                      id="agree"
                      type="checkbox"
                      name="agree"
                      value={checked}
                      onClick={() => setChecked(!checked)}
                      style={{ width: "25px" }}
                    />
                    <RadioLabel
                      htmlFor="agree"
                      style={{ marginLeft: "3px", marginRight: "10px" }}
                    >
                      I agree to the terms and conditions
                    </RadioLabel>
                  </div>
                  <SubmitButton onClick={(e) => handleSignUp(e)}>
                    <SubmitButtonIcon className="icon" />
                    <span className="text">{submitButtonText}</span>
                  </SubmitButton>
                  <p tw="mt-6 text-xs text-gray-600 text-center">
                  I agree to the terms and conditions{" "}
                    <a
                      href={tosUrl}
                      tw="border-b border-gray-500 border-dotted"
                    >
                      Terms of Service
                    </a>{" "}
                    and its{" "}
                    <a
                      href={privacyPolicyUrl}
                      tw="border-b border-gray-500 border-dotted"
                    >
                      Privacy Policy
                    </a>
                  </p>

                  <p tw="mt-8 text-sm text-gray-600 text-center">
                    Already have an account?{" "}
                    <a
                      href={signInUrl}
                      tw="border-b border-gray-500 border-dotted"
                    >
                      Sign In
                    </a>
                  </p>
                </Form>
              </FormContainer>
            </MainContent>
          </MainContainer>
          <IllustrationContainer>
            <IllustrationImage imageSrc={illustrationImageSrc} />
          </IllustrationContainer>
        </Content>
      </Container>
    </AnimationRevealPage>
  );
};

export default Signup;
