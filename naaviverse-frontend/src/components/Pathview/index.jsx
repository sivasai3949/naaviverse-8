import React, { useState, useEffect, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import { useCoinContextData } from "../../context/CoinContext";
import "./pathview.scss";
import { GlobalContex } from "../../globalContext";

const Pathview = () => {
  const {
    searchTerm,
    pathItemSelected,
    setPathItemSelected,
    pathItemStep,
    setPathItemStep,
    selectedPathItem,
    setSelectedPathItem,
  } = useCoinContextData();
  const {
    refetchPaths,
    gradeToggle,
    schoolToggle,
    setSchoolToggle,
    curriculumToggle,
    setCurriculumToggle,
    streamToggle,
    setStreamToggle,
    performanceToggle,
    setPerformanceToggle,
    financialToggle,
    setFinancialToggle,
    personalityToggle,
    setPersonalityToggle,
  } = useContext(GlobalContex);
  const [loading, setLoading] = useState(false);
  const [pathViewData, setPathViewData] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://careers.marketsverse.com/paths/get/specific`, {
        params: {
          email: JSON.parse(localStorage.getItem("user"))?.user?.email,
          grade: gradeToggle,
          curriculum: curriculumToggle,
          stream: streamToggle,
          performance: performanceToggle,
          financialSituation: financialToggle,
          personality: personalityToggle,
        },
      })
      .then((response) => {
        let result = response?.data?.data;
        // console.log(result, "path view result");
        setPathViewData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error, "error in getting path view result");
        setPathViewData([]);
        setLoading(false);
      });
  }, [refetchPaths]);

  const filteredPathViewData = pathViewData?.filter(
    (entry) =>
      entry?.destination_institution
        ?.toLowerCase()
        ?.includes(searchTerm?.toLowerCase()) ||
      entry?.program?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <div className="pathviewPage">
      <div className="pathviewNav">
        <div className="name-div">School</div>
        <div className="name-div">Program</div>
        <div className="description-div">Description</div>
      </div>
      <div className="pathviewContent">
        {loading ? (
          Array(10)
            .fill("")
            .map((e, i) => {
              return (
                <div className="each-pv-data" key={i}>
                  <div className="each-pv-name">
                    <Skeleton width={100} height={30} />
                  </div>
                  <div className="each-pv-name">
                    <Skeleton width={100} height={30} />
                  </div>
                  <div className="each-pv-desc">
                    <Skeleton width={100} height={30} />
                  </div>
                </div>
              );
            })
        ) : filteredPathViewData?.length > 0 ? (
          filteredPathViewData?.map((e, i) => {
            return (
              <div
                className="each-pv-data"
                key={i}
                onClick={() => {
                  setPathItemSelected(true);
                  localStorage.setItem(
                    "selectedPath",
                    JSON.stringify(e?.nameOfPath)
                  );
                  // console.log(e?.nameOfPath, 'selected path');
                  setSelectedPathItem(e);
                }}
              >
                <div className="each-pv-name">{e?.destination_institution}</div>
                <div className="each-pv-name">{e?.program}</div>
                <div className="each-pv-desc">{e?.description}</div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              width: "100%",
              height: "20vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            No Path Found
          </div>
        )}
      </div>
    </div>
  );
};

export default Pathview;
