import React, { useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import { ReactComponent as SvgDotPatternIcon } from "../../images/dot-pattern.svg";
import { ReactComponent as LoaderSpinner } from "feather-icons/dist/icons/loader.svg";
import { ReactComponent as LockIcon } from "feather-icons/dist/icons/x-octagon.svg";

import { useNavigate } from "react-router-dom";
import { db, ref, update } from "services/firebase";
import { remove } from "firebase/database";

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
const SubmitButton = tw.button`w-full sm:w-32 mt-6 py-3 bg-gray-100 text-primary-500 rounded-full font-bold tracking-wide shadow-lg uppercase text-sm transition duration-300 transform focus:outline-none focus:shadow-outline hover:bg-gray-300 hover:text-primary-700 hocus:-translate-y-px hocus:shadow-xl`;

const SvgDotPattern1 = tw(
  SvgDotPatternIcon
)`absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2 -z-10 opacity-50 text-primary-500 fill-current w-24`;

export default (param) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [readyForPrint, setReadyForPrint] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    const storedData = localStorage.getItem("data");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (readyForPrint) {
      window.print();
      const coursesRef = ref(db, "courses/" + data.id);
      update(coursesRef, {
        report: [],
        activeReport: false,
      });
      remove(ref(db, `classroom/${data.id}`))
        .then(() => {
          console.log("Remove succeeded.");
        })
        .catch((error) => {
          console.log("Remove failed: " + error.message);
        });
      localStorage.removeItem("data");
      navigate("/");
    }
  }, [readyForPrint]);

  const handleReport = () => {
    setReadyForPrint(true);
  };
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
  ) : data ? (
    <Container>
      <Content>
        <FormContainer>
          <div tw="mx-auto max-w-4xl">
            <h2>Report for: {data.title}</h2>
            <h3>
              Instructed by: <b>{data.instructor}</b>
            </h3>
            <form action="#">
              <table tw="table-fixed w-full text-center justify-between">
                <tr>
                  <th>Student Name</th>
                  <th>Focusing Percentage</th>
                  <th>Presence</th>
                </tr>
                <tbody>
                 
                  {data.reports.map((report) => (
                    report.type === "student" && (
                    <>
                      <tr key={`tr-${report.peerId}`}>
                        <td>
                          <p
                            key={`dp-${report.peerId}`}
                            htmlFor={`dp-${report.peerId}`}
                            style={{ marginBottom: "10px" }}
                          >
                            {report.displayName}
                          </p>
                        </td>
                        <td>
                          <p
                            key={`fp-${report.peerId}`}
                            htmlFor={`fp-${report.peerId}`}
                            style={{ marginBottom: "10px" }}
                          >
                            {report.focusingPercentage / 10}%
                          </p>
                        </td>
                        <td>
                          <p>
                            {report.focusingPercentage / 10 >= data.minimumFocus ? (
                              <b>Present</b>
                            ) 
                            
                            : 
                            
                            (
                              <b>Absent</b>
                            )}
                          </p>
                        </td>
                      </tr>
                    </>
                  )))}
                </tbody>
              </table>
              <SubmitButton
                type="submit"
                value="Submit"
                style={{ width: "100%" }}
                hidden={readyForPrint}
                onClick={(e) => {
                  handleReport();
                }}
              >
                Print Report & Finish
              </SubmitButton>
              <p hidden={readyForPrint}>
                **NOTE: if you pressed this button, this report will be deleted
                after you print it, and you can create another class
              </p>
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
