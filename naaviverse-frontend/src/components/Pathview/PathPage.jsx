import React, { useEffect, useState } from "react";
import { useStore } from "../../components/store/store.ts";
import "./journey.scss";
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import { useCoinContextData } from "../../context/CoinContext";
import CurrentStep from "../../pages/CurrentStep/index.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/index.jsx";
import Dashsidebar from "../dashsidebar/dashsidebar.jsx";

import searchIcon from "../../static/images/icons/search.svg";
import profile from '../../static/images/dashboard/profile.svg';
import downarrow from '../../static/images/dashboard/downarrow.svg';
import logout from "../../static/images/dashboard/logout.svg";
import profilea from "../../static/images/dashboard/profilea.svg";
import sidearrow from "../../static/images/dashboard/sidearrow.svg";
import MenuNav from "../MenuNav/index.jsx";
import AccDashsidebar from "../accDashsidebar/accDashsidebar.jsx";
import AdminAccDashsidebar from "../AdminAccDashsidebar/index.jsx";
// images
// import arrow from "./arrow.svg";

const PathPage = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const {} = useCoinContextData();
  const [loading, setLoading] = useState(false);
  // let userDetails = JSON.parse(localStorage.getItem("user"));
  // const email = userDetails?.user?.email;
  const [stepData, setStepData] = useState([]);
  const [showDrop, setShowDrop] = useState(false)
  useEffect(() => {
    setLoading(true);
    console.log(loc?.pathname?.split("/").pop(), "mwejbfkjwefwef");
    const pathId = loc?.pathname?.split("/").pop();
    if (pathId) {
      axios
        .get(`https://careers.marketsverse.com/paths/get?path_id=${pathId}`)
        .then(({ data }) => {
          if (data.status) {
            console.log(data?.data[0], "lkwehfkjewhfkejrf");
            setStepData(data?.data[0]);
            setLoading(false);
          }
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <div className="dashboard-main">
        <div className="dashboard-body">
          <div 
            // onClick={() => setShowDrop(false)}
          >
          {localStorage.getItem('userType') === 'partner' ? 
            <AccDashsidebar/> : localStorage.getItem('userType') === 'user' ? 
            <Dashsidebar /> : <AdminAccDashsidebar/>}
          </div>
          <div className="dashboard-screens">
          
           <MenuNav 
              showDrop={showDrop}
              setShowDrop={setShowDrop}
              // searchTerm={searchVault}
              // setSearchterm={setSearchVault}
              searchPlaceholder="Search..."
            />
            <div style={{ height: "100%" }}>
              <div className="journeypage">
                <div className="journey-top-area">
                  <div>Your Selected Path:</div>
                  {loading ? (
                    <Skeleton width={150} height={30} />
                  ) : (
                    <div className="bold-text">
                      {stepData?.length > 0
                        ? stepData?.destination_institution
                        : ""}
                    </div>
                  )}

                  <div
                    className="goBack-div"
                    onClick={() => {
                      // setShowPathDetails(false);
                      localStorage.removeItem("selectedPath");
                      // setSelectedPathItem([]);
                      navigate(-1)
                    }}
                  >
                    Go Back
                  </div>
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
                    : stepData?.length > 0
                      ? stepData?.StepDetails?.map((e, i) => {
                          return (
                            <div
                              className="each-j-step relative-div"
                              key={i}
                              onClick={() => {
                                // setShowSelectedPath(e)
                                // setProductKeys(e?.product_ids)
                                // console.log(e, "kjwebfkewjfkwjf");
                                // setStepServices(e?.ConnectedServices)
                                navigate(`/dashboard/step/${e?._id}`)
                              }}
                            >
                              <div className="each-j-img">
                                <img src={e?.icon} alt="" />
                              </div>
                              <div className="each-j-step-text">{e?.name}</div>
                              <div className="each-j-step-text1">
                                {e?.description}
                              </div>
                              <div className="each-j-amount-div">
                                <div className="each-j-amount">{e?.cost}</div>
                              </div>
                            </div>
                          );
                        })
                      : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
    </>
  );
};

export default PathPage;
