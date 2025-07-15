import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./Login";
import Otp from "./Otp";
import Register from "./Register";
import Forget from "./Forget";

const LoginPage = ({ activeForm = "login" }) => {
  const [active, setActive] = useState(activeForm);
  const navigate = useNavigate();

  const handleSetActive = (form) => {
    setActive(form);
    navigate(`/${form}`);
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Left Side: Image (only on md and up) */}
      <div className="hidden md:block w-1/2 h-full">
        <img
          src="/images/left-image.jpg"
          alt="Visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side: Form (full width on mobile) */}
      <div className="w-full md:w-1/2 h-full overflow-hidden">
        {active === "login" && <LoginForm setActive={handleSetActive} />}
        {active === "register" && <Register setActive={handleSetActive} />}
        {active === "otp" && <Otp setActive={handleSetActive} />}
        {active === "forget" && <Forget setActive={handleSetActive} />}
      </div>
    </div>

  );
};

export default LoginPage;
