import React, { useEffect } from "react";
import MainContainer from "../containers/configContainer";
import AdminContainer from "../containers/adminContainer";
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { checkIfLoggedin } from "../redux/actions/authActions";

const Page = (props) => {
  const { children, checkIfLoggedin, user } = props;
  const location = useLocation();
  const navigate = useNavigate();

  let prevLocation = {};

  useEffect(() => {
    const pathChanged = prevLocation.pathname !== location.pathname;
    const hashChanged = prevLocation.hash !== location.hash;
    if (
      (pathChanged || hashChanged) &&
      !location.pathname.includes("/admin-courses") &&
      !location.pathname.includes("/admin-info")
    ) {
      window.scrollTo(0, 0);
    }
    prevLocation = location;
  }, [location]);

  if (localStorage.getItem("token")) {
    if (!user) {
      checkIfLoggedin(localStorage.getItem("token"));
    }
  } else {
    if (location.pathname !== "/landing" && location.pathname !== "/login") {
      navigate("/landing");
    }
  }

  useEffect(() => {
    if (user) {
      if (!location.pathname.includes("chat")) {
        if (
          user.role === "admin" &&
          (!location.pathname.includes("admin") ||
            location.pathname.includes("login") ||
            location.pathname.includes("landing"))
        ) {
          navigate("/admin");
        } else if (
          user.role === "teacher" &&
          (!location.pathname.includes("admin") ||
            location.pathname.includes("login") ||
            location.pathname.includes("landing"))
        ) {
          navigate("/admin");
        } else if (
          user.role === "student" &&
          (location.pathname.includes("admin") ||
            location.pathname.includes("login") ||
            location.pathname.includes("landing"))
        ) {
          navigate("/");
        } else if (
          user.role === "guest" &&
          (!location.pathname.includes("guest") ||
            location.pathname.includes("login") ||
            location.pathname.includes("landing"))
        ) {
          navigate("/guest");
        }
      }
    }
  }, [user, navigate, location]);

  return user ? (
    user.role === "student" || user.role === "guest" ? (
      <MainContainer location={location} children={children} />
    ) : user.role === "admin" ? (
      <AdminContainer location={location} children={children} />
    ) : user.role === "teacher" ? (
      <AdminContainer location={location} children={children} isTeacher />
    ) : null
  ) : location.pathname.includes("landing") ||
    location.pathname.includes("login") ? (
    children
  ) : null;
}

const mapStateToProps = (state) => {
  return {
    user: state.authReducer.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => ({
  checkIfLoggedin: (token) => dispatch(checkIfLoggedin(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Page);
