import React, { useState } from "react";
import realtorwhite from "../../static/images/dashboard/realtorwhite.svg";
import "./dashsidebar.scss";
import { useStore } from "../store/store.ts";
import { useNavigate } from "react-router-dom";
import { useCoinContextData } from "../../context/CoinContext";
import logo from "./logo.svg";
import history from "./history.svg";

const sidebarMenu1 = [
  {
    id: 0,
    title: "Paths",
    path:'/dashboard/users'
  },
  // {
  //   id: 1,
  //   title: "Partners",
  //   path:'/dashboard/users'
  // },
  // {
  //   id: 2,
  //   title: "Services",
  // },
];

const sidebarMenu2 = [
  {
    id: 0,
    title: "My Journey",
    // path: '/dashboard/journey'
    path:'/dashboard/users'
  },
  {
    id: 1,
    title: "Current Step",
    path:'/dashboard/users'
  },
  {
    id: 2,
    title: "Transactions",
    path:'/dashboard/users'
  },
  // {
  //   id: 3,
  //   title: "Cabinet",
  // },
  // {
  //   id: 4,
  //   title: "Task Manager",
  // },
];

const sidebarMenu3 = [
  {
    id: 0,
    title: "Vaults",
  },
  {
    id: 1,
    title: "Naavi GPT",
  },
];

const Dashsidebar = ({ isNotOnMainPage, handleChange }) => {
  const { sideNav, setsideNav, setBuy } = useStore();
  const navigate = useNavigate();
  const {
    checkForHistory,
    setCheckForHistory,
    preLoginHistoryData,
    setPreLoginHistoryData,
    setPathItemSelected,
    setSelectedPathItem,
    setCurrentStepData,
    setCurrentStepDataLength,
    setCurrentStepDataPathId,
    setTransactionSelected,
    setTransactionData,
  } = useCoinContextData();

  return (
    <div className="dashboard-sidebar1" style={{ overflow: "hidden" }}>
      <div className="logo-border">
        <div
          className="dashboard-left"
          onClick={() => {
            if (handleChange) {
              handleChange();
              setsideNav("Paths");
            }
          }}
        >
          <img
            className="dashboard-logo"
            src={logo}
            alt=""
            style={{ width: "50%" }}
          />
        </div>
      </div>
      <div
        style={{
          overflowY: "scroll",
          height: "calc(100% - 70px)",
          padding: "0px 0 0 0",
        }}
      >
        <div
          style={{
            padding: "0 2vw",
          }}
        >
          {/* <div
            style={{
              // marginLeft: "15px",
              fontWeight: "600",
              fontSize: "18px",
              marginBottom: "1.5rem",
              color: "#100F0D",
            }}
          >
            Discover
          </div> */}
          {sidebarMenu1.map((each, i) => {
            return (
              <div
                className="each-sidenav"
                style={{
                  background: sideNav === each.title ? "#FFFFFF" : "",
                  color: sideNav === each.title ? "#100F0D" : "",
                  paddingLeft: sideNav === each.title ? "20px" : "",
                  // boxShadow:
                  //   sideNav === each.title
                  //     ? "0px 2px 2px rgba(0, 0, 0, 0.25)"
                  //     : "",
                  // fontWeight: sideNav === each.title ? "700" : "500",
                  borderRadius: sideNav === each.title ? "35px" : "",
                }}
                key={i}
                onClick={() => {
                  if (handleChange) {
                    handleChange();
                    setsideNav(each.title);
                  } else if (isNotOnMainPage) {
                    navigate("/dashboard/users/");
                    setBuy("step1");
                    setsideNav(each.title);
                  } else {
                    setsideNav(each.title);
                  }
                  navigate(each?.path)
                }}
              >
                {each.title}
              </div>
            );
          })}
        </div>

        {/* <div className="sidebar-line"></div> */}

        <div
          style={{
            padding: "0 2vw",
          }}
        >
          {/* <div
            style={{
              // marginLeft: "15px",
              fontWeight: "600",
              fontSize: "18px",
              marginBottom: "1.5rem",
              color: "#100F0D",
            }}
          >
            Manage
          </div> */}
          <div>
            {sidebarMenu2.map((ele, j) => {
              return (
                <div
                  className="each-sidenav"
                  style={{
                    background: sideNav === ele.title ? "#FFFFFF" : "",
                    color: sideNav === ele.title ? "#100F0D" : "",
                    paddingLeft: sideNav === ele.title ? "20px" : "",
                    // boxShadow:
                    //   sideNav === ele.title
                    //     ? "0px 2px 2px rgba(0, 0, 0, 0.25)"
                    //     : "",
                    borderRadius: sideNav === ele.title ? "35px" : "",
                  }}
                  key={j}
                  onClick={() => {
                    setCurrentStepData('');
                    setCurrentStepDataLength('');
                    setCurrentStepDataPathId('');
                    setTransactionSelected(false);
                    setTransactionData([]);
                    if (handleChange) {
                      handleChange();
                      setsideNav(ele.title);
                    } else {
                      setsideNav(ele.title);
                    }
                    navigate(ele?.path)
                  }}
                >
                  {ele.title}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* <div className="sidebar-line"></div> */}

        <div
          className="history-div"
          style={{ display: checkForHistory ? "flex" : "none" }}
        >
          <div className="history-box">
            <div>
              <img src={history} alt="" />
            </div>
            <div style={{ fontSize: "0.8rem" }}>
              You viewed the following path:
            </div>
            <div className="history-details">
              <div className="font1" style={{ fontWeight: "500" }}>
                {preLoginHistoryData?.destination_institution}
              </div>
              <div className="font1">{preLoginHistoryData?.program}</div>
              <div className="pathId-text">
                <span style={{ fontWeight: "600" }}>pathid:</span>{" "}
                {preLoginHistoryData?._id}
              </div>
            </div>
            <div className="open-btn" onClick={() => {
              setPathItemSelected(true);
              setSelectedPathItem(preLoginHistoryData);
              localStorage.setItem("selectedPath", JSON.stringify(preLoginHistoryData?.nameOfPath));
            }}>Open</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashsidebar;
