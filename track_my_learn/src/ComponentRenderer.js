import React from "react";
import { useParams } from "react-router-dom";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";

import LoginPage from "pages/Login.js";
import SignupPage from "pages/Signup.js";
import AboutUsPage from "pages/AboutUs.js";
import ContactUsPage from "pages/ContactUs.js";
import TermsOfServicePage from "pages/TermsOfService.js";
import PrivacyPolicyPage from "pages/PrivacyPolicy.js";

import IllustrationAndInputHero from "components/hero/TwoColumnWithInput.js";

import SliderCards from "components/cards/ThreeColSlider.js";
import TrendingCards from "components/cards/TwoTrendingPreviewCardsWithImage.js";
import PortfolioCards from "components/cards/PortfolioTwoCardsWithImage.js";
import TabGridCards from "components/cards/TabCardGrid.js";
import ProfileThreeColGridCards from "components/cards/ProfileThreeColGrid.js";
import ThreeColContactDetailsCards from "components/cards/ThreeColContactDetails.js";

import CreateClassroomForm from "components/forms/CreateClassroomForm";
import JoinClassroomForm from "components/forms/JoinClassroomForm";
import TwoColContactUsWithIllustrationFullForm from "components/forms/TwoColContactUsWithIllustrationFullForm";

export const components = {
  innerPages: {
    LoginPage: {
      component: LoginPage,
      scrollAnimationDisabled: true,
      url: "/components/innerPages/LoginPage",
    },
    SignupPage: {
      component: SignupPage,
      url: `/components/innerPages/SignupPage`,
      scrollAnimationDisabled: true,
    },
    AboutUsPage: {
      component: AboutUsPage,
      url: `/components/innerPages/AboutUsPage`,
    },
    ContactUsPage: {
      component: ContactUsPage,
      url: `/components/innerPages/ContactUsPage`,
    },
    TermsOfServicePage: {
      component: TermsOfServicePage,
      url: `/components/innerPages/TermsOfServicePage`,
    },
    PrivacyPolicyPage: {
      component: PrivacyPolicyPage,
      url: `/components/innerPages/PrivacyPolicyPage`,
    },
  },

  blocks: {
    Hero: {
      type: "Hero Section",
      elements: {
        IllustrationAndInput: {
          name: "With Image Illustration and Input",
          component: IllustrationAndInputHero,
          url: "/components/blocks/Hero/IllustrationAndInput",
        },
      },
    },
  },

  Cards: {
    type: "Cards",
    elements: {
      Slider: {
        name: "Three Column Slider",
        component: SliderCards,
        url: "/components/blocks/Cards/Slider",
      },
      Portfolio: {
        name: "Two Column Portfolio Cards With Images ",
        component: PortfolioCards,
        url: "/components/blocks/Cards/Portfolio",
      },
      TabGrid: {
        name: "Tab Card Grid With Tab Switcher",
        component: TabGridCards,
        url: "/components/blocks/Cards/TabGrid",
      },
      ProfileThreeColGrid: {
        name: "Three Column Grid Cards For Profile",
        component: ProfileThreeColGridCards,
        url: "/components/blocks/Cards/ProfileThreeColGrid",
      },
      ThreeColContactDetails: {
        name: "Three Column Contact Details Cards",
        component: ThreeColContactDetailsCards,
        url: "/components/blocks/Cards/ThreeColContactDetails",
      },
      Trending: {
        name: "Two Trending Preview Cards With Images",
        component: TrendingCards,
        url: "/components/blocks/Cards/Trending",
      },
    },
  },

  Form: {
    type: "Forms Section",
    elements: {
      CreateClassroomForm: {
        name: "Create Classroom",
        component: CreateClassroomForm,
        url: "/components/blocks/Form/CreateClassroomForm",
      },
      JoinClassroomForm: {
        name: "Join Classroom",
        component: JoinClassroomForm,
        url: "/components/blocks/Form/JoinClassroomForm",
      },
      TwoColContactUsWithIllustrationFullForm: {
        name: "Two Column Contact Us With Illustration Full Form",
        component: TwoColContactUsWithIllustrationFullForm,
        url: "/components/blocks/Form/TwoColContactUsWithIllustrationFullForm",
      },
    },
  },
};

export default () => {
  const { type, subtype, name } = useParams();

  try {
    let Component = null;
    if (type === "blocks" && subtype) {
      Component = components[type][subtype]["elements"][name].component;
      return (
        <AnimationRevealPage disabled>
          <Component />
        </AnimationRevealPage>
      );
    } else Component = components[type][name].component;

    if (Component) return <Component />;

    throw new Error("Component Not Found");
  } catch (e) {
    console.log(e);
    return <div>Error: Component Not Found</div>;
  }
};
