import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Hero from "components/hero/TwoColumnWithInput.js";

export default () => {
  return (
    <AnimationRevealPage>
      <Hero roundedHeaderButton={true} />
    </AnimationRevealPage>
  );
};
