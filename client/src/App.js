// import { searchTwitter } from "utils/requests";
import { CardContainer } from "components/CardContainer";
import { useEffect, useRef, useState } from "react";

const App = () => {
  const toTopButton = useRef();
  const [isAtTop, setIsAtTop] = useState(true);
  useEffect(() => {
    window.addEventListener("scroll", scrollEvent);

    return () => window.removeEventListener("scroll", scrollEvent);
  }, []);

  const scrollEvent = (e) => {
    const withinPixels = 300;

    if (window.scrollY > withinPixels) {
      setIsAtTop(false);
    } else {
      setIsAtTop(true);
    }
  };

  /*
    back to top
    refresh
    loading animation
    search topics

    dynamic retrieve
    refresh data

    get trending topics
  */

  const toTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="w-full flex justify-center px-8 py-12">
        <CardContainer />
      </div>
      {/* {!isAtTop && ( */}
      <button
        ref={toTopButton}
        className={`fixed bottom-2 right-2 transition-opacity duration-300 ${
          isAtTop ? "hidden" : "visible"
        }`}
        onClick={toTop}
      >
        To top
      </button>
      {/* )} */}
    </>
  );
};

export default App;
