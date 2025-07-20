import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

// Optional: static title map for cleaner titles
const routeTitles = {
  "/": "Login ",
  "/login": "Login",
  "/register": "Register",
  "/forget": "Forgot",
  "/otp": "Verify OTP ",
  "/subjects": "Subjects ",
};

const TitleManager = () => {
  const location = useLocation();
  const { subject, chapterId } = useParams();

  useEffect(() => {
    const path = location.pathname;
    let title = "School System"; // Default title

    if (routeTitles[path]) {
      title = routeTitles[path];
    } else if (path.startsWith("/chapter/")) {
      const chapterName = chapterId ? `Chapter ${chapterId}` : "Chapters";
      title = `${chapterName} - School System`;
    } else if (path.startsWith("/assessment/")) {
      title = `Assessment - ${subject || "Unknown"} - School System`;
    }

    document.title = title;
  }, [location.pathname, subject, chapterId]);

  return null;
};

export default TitleManager;
