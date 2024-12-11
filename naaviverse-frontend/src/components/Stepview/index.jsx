import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import { useCoinContextData } from "../../context/CoinContext";
import "./stepview.scss";

const Stepview = () => {
  const { searchTerm, pathItemSelected, setPathItemSelected } =
    useCoinContextData();
  const [loading, setLoading] = useState(false);
  const [stepViewData, setStepViewData] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://careers.marketsverse.com/steps/get")
      .then((response) => {
        let result = response?.data?.data;
        // console.log(result, "path view result");
        setStepViewData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error, "error in getting path view result");
      });
  }, []);

  const filteredStepViewData = stepViewData?.filter((entry) =>
    entry?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <div className="stepViewPage">
      <div className="stepviewNav">
        <div className="step-name-div">Name</div>
        <div className="step-description-div">Description</div>
      </div>
      <div className="stepviewContent">
        {loading
          ? Array(10)
              .fill("")
              .map((e, i) => {
                return (
                  <div className="each-sv-data" key={i}>
                    <div className="each-sv-name">
                      <Skeleton width={100} height={30} />
                    </div>
                    <div className="each-sv-desc">
                      <Skeleton width={100} height={30} />
                    </div>
                  </div>
                );
              })
          : filteredStepViewData?.map((e, i) => {
              return (
                <div
                  className="each-sv-data"
                  key={i}
                //   onClick={() => {
                //     setPathItemSelected(true);
                //   }}
                >
                  <div className="each-sv-name">{e?.name}</div>
                  <div className="each-sv-desc">{e?.description}</div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Stepview;
