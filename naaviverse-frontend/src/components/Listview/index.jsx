import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { useCoinContextData } from "../../context/CoinContext";
import "./listview.scss";

const Listview = () => {
  const { searchTerm } = useCoinContextData();
  const [loading, setLoading] = useState(false);
  const [leadSourceData, setLeadSourceData] = useState([]);
  const [showHiddenLinks, setShowHiddenLinks] = useState();
  const [select, setSelect] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://careers.marketsverse.com/universities/get")
      .then((response) => {
        let result = response?.data?.data;
        // console.log(result, "leadSourceData result");
        setLeadSourceData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error, "error in getting leadSourceData");
      });
  }, []);

  const filteredLeadSourceData = leadSourceData?.filter((entry) =>
    entry?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <div className="listview-container">
      <div className="listview-header">
        <div style={{ width: "40%" }}>Name</div>
        <div>Country</div>
      </div>
      <div className="listview-content">
        {loading
          ? Array(10)
              .fill("")
              .map((e, i) => {
                return (
                  <div className="each-list-content" key={i}>
                    <div style={{ width: "40%" }}>
                      <Skeleton width={100} height={30} />
                    </div>
                    <div>
                      <Skeleton width={100} height={30} />
                    </div>
                    <div
                      style={{
                        width: "40%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Skeleton width={100} height={30} />
                    </div>
                  </div>
                );
              })
          : filteredLeadSourceData?.map((e, i) => {
              return (
                <div className="each-list-content" key={i}>
                  <div style={{ width: "40%" }}>{e?.name}</div>
                  <div>{e?.country}</div>
                  <div className="web-btn-div">
                    {e?.domains?.length > 1 ? (
                      <>
                        <div
                          className="web-btn"
                          onClick={() => {
                            if (showHiddenLinks) {
                              setShowHiddenLinks(false);
                              setSelect("");
                            } else {
                              setShowHiddenLinks(true);
                              setSelect(e?.name);
                            }
                          }}
                        >
                          Website
                        </div>
                        <div
                          className="hidden-links-div"
                          style={{
                            display:
                              select === e?.name && e?.domains?.length > 1
                                ? "flex"
                                : "none",
                          }}
                        >
                          {Array.isArray(e?.domains) &&
                            e?.domains?.map((each, index) => {
                              return (
                                <div
                                  className="each-hidden-link"
                                  key={index}
                                  onClick={() => {
                                    window.open(each, "_blank");
                                  }}
                                >
                                  <p>{each}</p>
                                </div>
                              );
                            })}
                        </div>
                      </>
                    ) : (
                      <div
                        className="web-btn"
                        onClick={() => {
                          window.open(e?.domains?.[0], "_blank");
                        }}
                      >
                        Website
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Listview;
