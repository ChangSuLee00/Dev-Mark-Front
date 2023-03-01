import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";

// React Start from here
const Scrollback = (): JSX.Element => {
  //--------------------------------------------------------
  // Declaration of useState, useContext, useRef ...
  const [showButton, setShowButton] = useState(false);

  //--------------------------------------------------------
  // Event Handler

  // moveBackToTop
  const moveBackToTop: React.MouseEventHandler<HTMLButtonElement> = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // CheckScroll
  const CheckScroll = () => {
    if (window.scrollY > 5) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  // addEventListener
  window.addEventListener("scroll", CheckScroll);

  //--------------------------------------------------------
  // return

  return (
    <>
      {showButton ? (
        <button className="back-to-top" onClick={moveBackToTop}>
          <FontAwesomeIcon icon={faChevronUp} />
        </button>
      ) : null}
    </>
  );
};

export default Scrollback;
