import React, { useEffect, useState } from "react";
import { useStore } from "../../components/store/store.ts";
import "./journey.scss";
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import { useCoinContextData } from "../../context/CoinContext";

// images
import arrow from "./arrow.svg";

const JourneyPage = () => {
  const {
    setCurrentStepData,
    setCurrentStepDataLength,
    currentStepdataPathId,
    setCurrentStepDataPathId,
  } = useCoinContextData();
  let userDetails = JSON.parse(localStorage.getItem("user"));
  const { sideNav, setsideNav } = useStore();
  const [loading, setLoading] = useState(false);
  const [journeyPageData, setJourneyPageData] = useState([]);
  const [currentStepIndication, setCurrentStepIndication] = useState("");
  const [competedSteps, setCompletedSteps] = useState([]);
  const email = userDetails?.user?.email;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://careers.marketsverse.com/userpaths/get?email=${email}`)
      .then((response) => {
        let result = response?.data?.data[0];
        // console.log(result, "journeyPageData result");
        let pathId = response?.data?.data[0]?.pathId;
        // console.log(pathId, "journeyPageData pathId");
        let currentStep = response?.data?.data[0]?.currentStep;
        // console.log(currentStep, "currentStep");
        let completedStepData = response?.data?.data[0]?.completedSteps;
        // console.log(completedStepData, "completedStepData");
        setJourneyPageData(result);
        setCurrentStepDataPathId(pathId);
        setCurrentStepIndication(currentStep);
        setCompletedSteps(completedStepData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error, "error in fetching journeyPageData");
        setLoading(false);
      });
  }, []);

  return (
    <div className="journeypage">
      <div className="journey-top-area">
        <div>{journeyPageData?.PathDetails?.length > 0 ? "Your Selected Path:" : "Go to Paths and select journey."}</div>
        {loading ? (
          <Skeleton width={150} height={30} />
        ) : (
          <div className="bold-text">
            {journeyPageData?.PathDetails?.length > 0
              ? journeyPageData?.PathDetails?.[0]?.nameOfPath
              : ""}
          </div>
        )}
        {loading ? (
          <Skeleton width={500} height={20} />
        ) : (
          <div className="journey-des">
            {journeyPageData?.PathDetails?.length > 0
              ? journeyPageData?.PathDetails?.[0]?.description
              : ""}
          </div>
        )}
      </div>
      <div className="journey-steps-area">
        {loading
          ? Array(6)
              .fill("")
              .map((e, i) => {
                return (
                  <div className="each-j-step relative-div" key={i}>
                    <div className="each-j-img">
                      <Skeleton width={75} height={75} />
                    </div>
                    <div className="each-j-step-text">
                      <Skeleton width={200} height={30} />
                    </div>
                    <div className="each-j-step-text1">
                      <Skeleton width={250} height={25} />
                    </div>
                    <div className="each-j-amount-div">
                      <div className="each-j-amount">
                        <Skeleton width={100} height={30} />
                      </div>
                    </div>
                  </div>
                );
              })
          : journeyPageData?.PathDetails?.length > 0
          ? journeyPageData?.PathDetails?.[0]?.StepDetails?.map((e, i) => {
              return (
                <div
                  className="each-j-step-container"
                  onClick={() => {
                    setsideNav("Current Step");
                    // console.log(e, "currentStepdata");
                    // console.log(
                    //   journeyPageData?.PathDetails?.[0]?.length,
                    //   "currentStepdataLength"
                    // );
                    setCurrentStepData(e);
                    setCurrentStepDataLength(
                      journeyPageData?.PathDetails?.[0]?.length
                    );
                  }}
                  key={i}
                >
                  <div className="each-j-stepp">
                    <div className="each-j-img">
                      <img src={e?.icon} alt="" />
                    </div>
                    <div className="each-j-step-text">{e?.name}</div>
                    <div className="each-j-step-text1">{e?.description}</div>
                    <div className="each-j-amount-div">
                      <div className="each-j-amount">{e?.cost}</div>
                    </div>
                  </div>
                  <div
                    className="current-step-indicator"
                    style={{
                      display:
                        e?._id === currentStepIndication ? "flex" : "none",
                    }}
                  >
                    Current Step
                  </div>
                  <div
                    className="completed-step-indicator"
                    style={{
                      display: competedSteps?.includes(e?._id) ? "flex" : "none",
                    }}
                  >
                    Completed
                  </div>
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
};

export default JourneyPage;
