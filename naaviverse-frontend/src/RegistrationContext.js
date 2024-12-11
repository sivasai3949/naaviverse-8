import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
// import { BankContext } from "./Context";

export const RegistrationContext = createContext();
const RegistrationContextProvider = (props) => {
  // const { email } = useContext(BankContext);

  const [step, setStep] = useState("");
  const [appData, setAppData] = useState(null);
  const [affiliateData, setAffiliateData] = useState(null);
  const [initialPath, setInitialPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [pasteContent, setPasteContent] = useState("");

  const [affEmail, setAffEmail] = useState("");
  const [affData, setAffData] = useState(null);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [createAccountLoading, setCreateAccountLoading] = useState(false);

  const [pin, setPin] = useState("");
  const [pinMisMatch, setPinMisMatch] = useState(false);

  const [loadingRight, setLoadingRight] = useState(false);

  //PreRegistered States

  const [authId, setAuthId] = useState(null);
  const [tempEmail, setTempEmail] = useState("");
  const [tempUsername, setTempUsername] = useState("");
  const [challengeName, setChallengeName] = useState("");
  const [session, setSession] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [affType, setAffType] = useState(true);

  const handleCreateAccount = (lastRoute) => {
    setCreateAccountLoading(true);

    axios
      .post(`https://gxauth.apimachine.com/gx/user/signup`, {
        username: userName,
        email: userEmail,
        password: userPassword,
        ref_affiliate: affData?.hardCoded?.[0]?.data?.username,
        account_type: "Personal",
        signedup_app: appData?.app_code,
      })
      .then(({ data }) => {
        if (data.status) {
          setStep("step7");
          setCreateAccountLoading(false);
        }
      });

    // console.log("create account now");
    // console.log("aff Upline: ", affData?.hardCoded?.[0]?.data?.username);
    // console.log("userEmail: ", userName);
    // console.log("userEmail: ", userEmail);
    // console.log("userPassword: ", userPassword);
    // console.log("signedupApp: ", appData?.app_code);
    // setStep("step7");
  };

  const confirmEmail = () => {
    setStep("step8");
    axios
      .post(`https://gxauth.apimachine.com/gx/user/confirm`, {
        email: userEmail,
        code: pin,
      })
      .then(({ data }) => {
        if (data.status) {
          setStep("step9");
        } else {
          setStep("step7");
          setPinMisMatch(true);
        }
      });
  };
  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://comms.globalxchange.io/gxb/apps/get?app_code=naavi`)
      .then(({ data }) => {
        if (data.apps.length > 0) {
          setAppData(data.apps[0]);
          setLoading(false);
        } else {
          setAppData(data.apps[0]);
          setLoading(false);
        }
      });
  }, []);

  const value = {
    step,
    setStep,
    initialPath,
    setInitialPath,
    appData,
    setAppData,
    loading,
    setLoading,
    pasteContent,
    setPasteContent,

    //input states
    affEmail,
    setAffEmail,
    affData,
    setAffData,
    userEmail,
    setUserEmail,
    userName,
    setUserName,
    userPassword,
    setUserPassword,

    pin,
    setPin,
    createAccountLoading,
    setCreateAccountLoading,
    loadingRight,
    setLoadingRight,
    //Functions
    handleCreateAccount,
    confirmEmail,

    //Pre-Registered States

    authId,
    setAuthId,
    tempEmail,
    setTempEmail,
    tempUsername,
    setTempUsername,
    challengeName,
    setChallengeName,
    session,
    setSession,
    newPassword,
    setNewPassword,

    //by-myself
    affType,
    setAffType,
  };
  return (
    <RegistrationContext.Provider value={value}>
      {props.children}
    </RegistrationContext.Provider>
  );
};

export default RegistrationContextProvider;
