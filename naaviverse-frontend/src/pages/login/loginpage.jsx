import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./loginpage.scss";
import lg1 from "../../static/images/login/lg1.svg";
import lg2 from "../../static/images/login/lg2.svg";
import google from "../../static/images/login/google.svg";
import realtorfull from "../../static/images/login/realtorfull.svg";
import eye1 from "../../static/images/login/eye1.svg";
import eye2 from "../../static/images/login/eye2.svg";
import { Loginservice} from "../../services/loginapis";
import { useStore } from "../../components/store/store.ts";
import logo from "./logo.svg";
import loadinglogo from "./loadinglogo.svg";
import axios from "axios";
import info from "./info.svg";
import { useParams } from "react-router-dom";


const IconMenu = [
  {
    id: 0,
    icon: lg1,
  },
  {
    id: 1,
    icon: lg2,
  },
];

const Loginpage = () => {
  let navigate = useNavigate();
  const { accsideNav, setaccsideNav, loginType, setLoginType } = useStore();
  const [icon, setIcon] = useState(0);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [eye, seteye] = useState(false);
  const [iserror, setiserror] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [code, setCode] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [passwordResetMsg, setPasswordResetMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userToken, setUserToken] = useState("");


  useEffect(() => {
    localStorage.clear();
  }, []);

  const getProfilePic = (email, type) => {
    axios.get(`https://careers.marketsverse.com/${type==="Users" ? "users":"partner"}/get?email=${email}`).then(({data}) => {
      if(data.status){
        if(type === "Users"){
          localStorage.setItem('userProfilePic', data?.data[0]?.profilePicture)
        }else{
          localStorage.setItem('userProfilePic', data?.data[0]?.logo)
        }
      }
    })
  }

  const handleLogin = () => {
    setIsLoading(true);
    const obj = {
      email: email,
      password: password,
    };
  
    Loginservice(obj)
      .then((response) => {
        const result = response.data; // Accessing data directly
  
        // Check if login was successful by looking for the token
        if (result?.token) { // Check for token instead of status
          console.log("Login successful:", result);
  
          // Store user info and token in local storage
          localStorage.setItem("authToken", result.token);
          localStorage.setItem("user", JSON.stringify(result.user));
  
          // Register on app for 'naavi'
          const naaviObj = {
            email,
            app_code: "naavi",
          };
  
          // Navigate based on user type
          if (loginType === "Users") {
            navigate("/dashboard/users/profile");
            getProfilePic(email, loginType);
            localStorage.setItem('userType', 'user');
          } else {
            navigate("/dashboard/accountants/profile");
            getProfilePic(email, loginType);
            localStorage.setItem('userType', 'partner');
          }
  
          setiserror(false); // Reset error state on success
        } else {
          console.error("Login failed:", result?.message || "Unknown error");
          setiserror(true); // Set error state if no token is found
        }
      })
      .catch((error) => {
        console.error("Error during login:", error.message || "An unexpected error occurred");
        setiserror(true); // Set error state on catch
      })
      .finally(() => {
        setIsLoading(false); // Ensure loading state is reset regardless of success or failure
      });
  };

  // Updated frontend code
  const initiateForgotPassword = () => {
    setLoading(true);
    let obj = {
        email: email, // Ensure this aligns with the backend's expected field
    };
  
    axios
        .post(
            `http://localhost:4545/auth/forgotPassword`, // Replace with your backend endpoint
            obj
        )
        .then((response) => {
            let result = response?.data;
            if (result?.success) {
                setLoading(false);
                setForgotPasswordStep(2); // Proceed to the next step (e.g., OTP verification)
            } else {
                console.error("Failed to send OTP:", result?.message);
                setLoading(false);
            }
        })
        .catch((error) => {
            console.log(error, "Error in initiateForgotPassword");
            setLoading(false);
        });
  };
  const submitForgotPassword = () => {
    if (newPassword2 !== newPassword1) {
        setPasswordResetMsg("Passwords do not match.");
        return;
    }

    const obj = {
        email,
        otp: code,
        newPassword: newPassword2,
        confirmPassword: newPassword2,
    };

    // Ensure the token is part of the URL, not the request body
    const url = `http://localhost:4545/resetPassword/${userToken}`;

    axios
        .post(url, obj)  // Pass the URL with token as part of the endpoint
        .then(({ data }) => {
            if (data?.success) {
                setPasswordResetMsg("Password reset successful!");
                setForgotPassword(false);
                setForgotPasswordStep(1);
            } else {
                console.error("Failed:", data?.message);
                setPasswordResetMsg(data?.message || "Error occurred.");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            setPasswordResetMsg("An error occurred. Please try again.");
        });
};


  
  
  
  return (
    <div className="login-main">
      {forgotPassword ? (
        forgotPasswordStep === 1 ? (
          <div className="login-box">
            <div className="full-logo-box" style={{ marginBottom: "5rem" }}>
              <img
                className="full-logo"
                src={logo}
                alt=""
                style={{ width: "50%" }}
              />
            </div>
  
            <div className="input-box" style={{ marginBottom: "5rem" }}>
              <input
                className="input-inp"
                type="text"
                placeholder="Email"
                required
                id="email"
                name="email"
                autoComplete="email"
                value={email}
                onInput={(e) => {
                  setiserror(false);
                  setemail(e.target.value);
                }}
              />
            </div>
  
            <div
              className="login-btn"
              onClick={() => {
                if (email?.length > 0) {
                  initiateForgotPassword();
                }
              }}
              style={{
                opacity: loading ? "0.5" : email?.length > 0 ? "1" : "0.5",
              }}
            >
              {loading ? "Loading..." : "Next Step"}
            </div>
            <div
              className="google-btn"
              onClick={() => {
                setForgotPassword(false);
                setemail("");
                setLoading(false);
              }}
            >
              <div>Never Mind</div>
            </div>
          </div>
        ) : forgotPasswordStep === 2 ? (
          <div className="login-box">
            <div className="full-logo-box" style={{ marginBottom: "5rem" }}>
              <img
                className="full-logo"
                src={logo}
                alt=""
                style={{ width: "50%" }}
              />
            </div>
  
            <div style={{ marginBottom: "1.5rem" }}>
              We have sent a code to you’re email
            </div>
  
            <div className="input-box" style={{ marginBottom: "5rem" }}>
  <input
    className="input-inp"
    type="text"
    placeholder="Enter Code..."
    required
    value={code}
    onInput={(e) => {
      const value = e.target.value;
      const regex = /^[a-zA-Z0-9]*$/;  // Regex to allow alphanumeric characters only
      if (regex.test(value)) {
        setCode(value);  // Set value only if it matches the regex
      }
    }}
    maxLength={6}
    minLength={4}
  />
</div>

            <div
              className="login-btn"
              onClick={() => {
                if (code?.length === 6) {
                  setForgotPasswordStep(3);
                }
              }}
              style={{
                opacity: code?.length === 6 ? "1" : "0.5",
              }}
            >
              Next Step
            </div>
            <div
              className="google-btn"
              onClick={() => {
                setForgotPasswordStep(1);
                setCode("");
              }}
            >
              <div>Go Back</div>
            </div>
          </div>
        ) : forgotPasswordStep === 3 ? (
          <div className="login-box">
            <div className="full-logo-box" style={{ marginBottom: "5rem" }}>
              <img
                className="full-logo"
                src={logo}
                alt=""
                style={{ width: "50%" }}
              />
            </div>
  
            <div style={{ marginBottom: "1.5rem" }}>Create new password</div>
  
            <div className="input-box" style={{ marginBottom: "5rem" }}>
              <input
                style={{ width: "90%" }}
                className="input-inp"
                type="password"
                placeholder="Password..."
                required
                value={newPassword1}
                onInput={(e) => {
                  setNewPassword1(e.target.value);
                }}
              />
              <div className="password-check">
                <div
                  style={{
                    background:
                      newPassword1?.length >= 6
                        ? "linear-gradient(90deg, #47B4D5 0.02%, #29449D 119.26%)"
                        : "#FE2C55",
                  }}
                ></div>
              </div>
            </div>
  
            <div
              className="login-btn"
              onClick={() => {
                if (newPassword1?.length >= 6) {
                  setForgotPasswordStep(4);
                }
              }}
              style={{
                opacity: newPassword1?.length >= 6 ? "1" : "0.5",
              }}
            >
              Next Step
            </div>
            <div
              className="google-btn"
              onClick={() => {
                setForgotPasswordStep(2);
                setNewPassword1("");
              }}
            >
              <div>Go Back</div>
            </div>
          </div>
        ) : forgotPasswordStep === 4 ? (
          <div className="login-box">
            <div className="full-logo-box" style={{ marginBottom: "5rem" }}>
              <img
                className="full-logo"
                src={logo}
                alt=""
                style={{ width: "50%" }}
              />
            </div>
  
            <div style={{ marginBottom: "1.5rem" }}>Confirm new password</div>
  
            <div className="input-box" style={{ marginBottom: "5rem" }}>
              <input
                style={{ width: "90%" }}
                className="input-inp"
                type="password"
                placeholder="Password..."
                required
                value={newPassword2}
                onInput={(e) => {
                  setNewPassword2(e.target.value);
                }}
              />
              <div className="password-check">
                <div
                  style={{
                    background:
                      newPassword2?.length >= 6 && newPassword2 === newPassword1
                        ? "linear-gradient(90deg, #47B4D5 0.02%, #29449D 119.26%)"
                        : "#FE2C55",
                  }}
                ></div>
              </div>
            </div>
  
            <div
              className="login-btn"
              onClick={() => {
                if (
                  newPassword2?.length >= 6 &&
                  newPassword2 === newPassword1
                ) {
                  submitForgotPassword();
                }
              }}
              style={{
                opacity:
                  newPassword2?.length >= 6 && newPassword2 === newPassword1
                    ? "1"
                    : "0.5",
              }}
            >
              Next Step
            </div>
            <div
              className="google-btn"
              onClick={() => {
                setForgotPasswordStep(3);
                setNewPassword2("");
              }}
            >
              <div>Go Back</div>
            </div>
          </div>
        ) : (
          ""
        )
      ) : (
        <div className="login-box">
          <div className="full-logo-box">
            <img
              className="full-logo"
              src={logo}
              alt=""
              style={{ width: "50%" }}
            />
          </div>
          <div className="toggle-box">
            <div
              className="toggle-each"
              style={{
                background: loginType === "Users" ? "#F1F4F6" : "",
                fontWeight: loginType === "Users" ? "600" : "",
                fontSize: loginType === "Users" ? "18px" : "",
              }}
              onClick={() => {
                setLoginType("Users");
                console.log("Selected role:", "Users"); // Log selected role
              }}
            >
              Users
            </div>
            <div
              className="toggle-each"
              style={{
                background: loginType === "Accountants" ? "#F1F4F6" : "",
                fontWeight: loginType === "Accountants" ? "600" : "",
                fontSize: loginType === "Accountants" ? "18px" : "",
              }}
              onClick={() => {
                setLoginType("Accountants");
                console.log("Selected role:", "Accountants"); // Log selected role
              }}
            >
              Partners
            </div>
          </div>
          <div
            style={{
              marginTop: passwordResetMsg?.length > 1 ? "1.5rem" : "",
              marginBottom: passwordResetMsg?.length > 1 ? "1.5rem" : "",
            }}
          >
            {passwordResetMsg?.length > 1 ? passwordResetMsg : ""}
          </div>
          {iserror && (
            <div className="prompt-div">
              <div>
                <img src={info} alt="" />
              </div>
              <div>
                The credentials you entered are incorrect. Please try again or
                reset your password.
              </div>
            </div>
          )}
          <div className="input-box">
            <input
              className="input-inp"
              type="text"
              placeholder="Email"
              required
              id="email"
              name="email"
              autoComplete="email"
              value={email}
              onInput={(e) => {
                setiserror(false);
                setemail(e.target.value);
              }}
            />
          </div>
          <div className="input-box">
            <input
              className="input-inp"
              type="password"
              placeholder="Password"
              id="password"
              autoComplete="new-password"
              name="password"
              required
              value={password}
              onInput={(e) => {
                setiserror(false);
                setpassword(e.target.value);
              }}
            />
          </div>
          <div
            className="forgot"
            onClick={() => {
              setForgotPassword(true);
              setiserror(false);
            }}
          >
            Forgot Password
          </div>
          <div className="login-btn" onClick={() => handleLogin()}>
            Login
          </div>
          <div
            className="google-btn"
            onClick={() => {
              navigate(`/register?role=${loginType}`);
            }}
          >
            <div>Register With Email</div>
          </div>
        </div>
      )}
      <div>
        {isLoading ? (
          <div className="otclogo">
            <img className="otclogoimg" src={loadinglogo} alt="" />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
  };
  
  export default Loginpage;
  