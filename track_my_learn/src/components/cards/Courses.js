import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import tw from "twin.macro";
import styled from "styled-components";
import { SectionHeading } from "components/misc/Headings";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons";
import { ReactComponent as PersonIcon } from "feather-icons/dist/icons/user.svg";
import { ReactComponent as TimeIcon } from "feather-icons/dist/icons/clock.svg";
import { ReactComponent as ChevronLeftIcon } from "feather-icons/dist/icons/chevron-left.svg";
import { ReactComponent as ChevronRightIcon } from "feather-icons/dist/icons/chevron-right.svg";
import { useNavigate } from "react-router-dom";
import { auth, db, ref, get, onChildChanged } from "services/firebase";

const Container = tw.div`relative`;
const Content = tw.div`max-w-screen-xl mx-auto py-16 lg:py-20`;

const HeadingWithControl = tw.div`flex flex-col items-center sm:items-stretch sm:flex-row justify-between`;
const Heading = tw(SectionHeading)``;
const Controls = tw.div`flex items-center`;
const ControlButton = styled(PrimaryButtonBase)`
  ${tw`mt-4 sm:mt-0 first:ml-0 ml-6 rounded-full p-2`}
  svg {
    ${tw`w-6 h-6`}
  }
`;
const PrevButton = tw(ControlButton)``;
const NextButton = tw(ControlButton)``;

const CardSlider = styled(Slider)`
  ${tw`mt-16`}
  .slick-track {
    ${tw`flex`}
  }
  .slick-slide {
    ${tw`h-auto flex justify-center mb-1`}
  }
`;
const Card = tw.div`h-full flex! flex-col sm:border max-w-sm sm:rounded-tl-4xl sm:rounded-br-5xl relative focus:outline-none`;
const CardImage = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`w-full h-56 sm:h-64 bg-cover bg-center rounded sm:rounded-none sm:rounded-tl-4xl`,
]);

const TextInfo = tw.div`py-6 sm:px-10 sm:py-6`;
const TitleReviewContainer = tw.div`flex flex-col sm:flex-row sm:justify-between sm:items-center`;
const Title = tw.h5`text-2xl font-bold`;

const Description = tw.p`text-sm leading-loose mt-2 sm:mt-4`;

const SecondaryInfoContainer = tw.div`flex flex-col sm:flex-row mt-2 sm:mt-4`;
const IconWithText = tw.div`flex items-center mr-6 my-2 sm:my-0`;
const IconContainer = styled.div`
  ${tw`inline-block rounded-full p-2 bg-gray-700 text-gray-100`}
  svg {
    ${tw`w-3 h-3`}
  }
`;
const Text = tw.div`ml-2 text-sm font-semibold text-gray-800`;

const PrimaryButton = tw(
  PrimaryButtonBase
)`mt-auto sm:text-lg rounded-none w-full rounded sm:rounded-none sm:rounded-br-4xl py-3 sm:py-6`;
export default () => {
  // useState is used instead of useRef below because we want to re-render when sliderRef becomes available (not null)
  const [sliderRef, setSliderRef] = useState(null);
  const sliderSettings = {
    arrows: false,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
        },
      },

      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const [cards, setCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();
  // Fetch data from Firebase
  const getData = async () => {
    auth.onAuthStateChanged(async (user) => {
      const typeSnapshot = await get(ref(db, `users/${user.uid}/type`));
      if (typeSnapshot.exists()) {
        setUserType(typeSnapshot.val());
      }
      const snapshot = await get(ref(db, `users/${user.uid}/courses`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        let dataArray = [JSON.parse(JSON.stringify(data, null, 2))];
        let cleanedData = [];

        // Retrieve the classroom data
        const classroomSnapshot = await get(ref(db, `/classroom`));
        const coursesSnapshot = await get(ref(db, `/courses`));

        if (classroomSnapshot.exists() && coursesSnapshot.exists()) {
          const classrooms = classroomSnapshot.val();
          const courses = coursesSnapshot.val();

          for (let i in dataArray[0]) {
            const courseId = dataArray[0][i].id;
            const hasClassroom = classrooms.hasOwnProperty(courseId);
            const course = {
              ...dataArray[0][i],
              classroom: hasClassroom,
              minimumFocus: hasClassroom
                ? classrooms[courseId].minimumFocus
                : 0,
            };
            console.log(course);

            // Append reports and activeReport to course from courses object
            if (hasClassroom) {
              const courseData = courses[courseId];
              course.reports = courseData.report;
              course.activeReport = courseData.activeReport;
            }

            cleanedData.push(course);
          }
        }

        setCards(cleanedData);
        setCardsLoading(false);
      } else {
        console.log("No data available");
        setCardsLoading(false);
      }
    });
  };
  // Checking for changes in the database and updating the state
  const dataChanged = auth.onAuthStateChanged((user) => {
    onChildChanged(ref(db, `users/${user.uid}/courses`), async (snapshot) => {
      const data = snapshot.val();
      // Replace the child only without changing the order
      const index = cards.findIndex((card) => card.title === data.title);
      cards[index] = data;
      setCards([...cards]);
    });
  });

  // Handle course clicks
  const handleCourse = (card) => {
    if (userType === "instructor" && !card.classroom) {
      // If the instructor clicked on Create Classroom button, redirect to the Create Classroom page
      navigate(`/create-classroom/${card.id}`);
    } else if (
      userType === "instructor" &&
      card.classroom &&
      card.activeReport
    ) {
      // Check if the instructor clicked on the course and the course has a report
      // If the instructor clicked on the course and the course has a report, redirect to the Report page
      localStorage.setItem("data", JSON.stringify(card));
      navigate(`/report/${card.id}`);
    } else {
      // If the student clicked on the course, redirect to the Classrooms page
      navigate(`/join-classroom/${card.id}`);
    }
  };

  useEffect(() => {
    getData();
    dataChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return cardsLoading ? (
    <Container>
      <Content>
        <HeadingWithControl>
          <Heading>Your Courses</Heading>
          <Controls>
            <PrevButton onClick={sliderRef?.slickPrev}>
              <ChevronLeftIcon />
            </PrevButton>
            <NextButton onClick={sliderRef?.slickNext}>
              <ChevronRightIcon />
            </NextButton>
          </Controls>
        </HeadingWithControl>
        <CardSlider ref={setSliderRef} {...sliderSettings}>
          {/* Loading Skeleton... */}
          <Card>
            <CardImage imageSrc={null} />
            <TextInfo>
              <TitleReviewContainer>
                <Title></Title>
              </TitleReviewContainer>
              <SecondaryInfoContainer>
                <IconWithText>
                  <IconContainer>
                    <PersonIcon />
                  </IconContainer>
                  <Text></Text>
                </IconWithText>
                <IconWithText>
                  <IconContainer>
                    <TimeIcon />
                  </IconContainer>
                  <Text></Text>
                </IconWithText>
              </SecondaryInfoContainer>
            </TextInfo>
          </Card>
        </CardSlider>
      </Content>
    </Container>
  )
   :
  
  (
    <Container>
      <Content>
        <HeadingWithControl>
          <Heading>Your Courses</Heading>
          <Controls>
            <PrevButton onClick={sliderRef?.slickPrev}>
              <ChevronLeftIcon />
            </PrevButton>
            <NextButton onClick={sliderRef?.slickNext}>
              <ChevronRightIcon />
            </NextButton>
          </Controls>
        </HeadingWithControl>
        <CardSlider ref={setSliderRef} {...sliderSettings}>
          {/* Checking if there is no courses. */}
          {cards < 1 && <Text>You have no courses yet.</Text>}
          {/* Mapping through the courses. */}
          {cards.map((card, index) => (
            <Card key={index}>
              <TextInfo>
                <TitleReviewContainer>
                  <Title>
                    {card.section} - {card.title}
                  </Title>
                </TitleReviewContainer>
                <SecondaryInfoContainer>
                  <IconWithText>
                    <IconContainer>
                      <PersonIcon />
                    </IconContainer>
                    <Text>{card.instructor}</Text>
                  </IconWithText>
                  <IconWithText>
                    <IconContainer>
                      <TimeIcon />
                    </IconContainer>
                    <Text>{card.time}</Text>
                  </IconWithText>
                </SecondaryInfoContainer>
                <Description>{card.description}</Description>
                {userType === "instructor" && (
                  <Description>Course ID: {card.id}</Description>
                )}
              </TextInfo>
              <PrimaryButton
                disabled={userType !== "instructor" && !card.classroom}
                onClick={() => {
                  handleCourse(card);
                }}
              >
                {userType === "instructor" && !card.classroom
                  ? "Create Classroom"
                  : userType === "instructor" &&
                    card.classroom &&
                    card.activeReport
                  ? "View Report"
                  : "Join Classroom"}
              </PrimaryButton>
            </Card>
          ))}
        </CardSlider>
      </Content>
    </Container>
  );
};
