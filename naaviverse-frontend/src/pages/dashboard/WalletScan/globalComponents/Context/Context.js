import React, { Component, createContext } from "react";
import {
  fetchAllCoins,
  getRegisteredApp,
  getUserDetails,
} from "../../services/getAPIs";
export const Context = createContext();
export default class ContextProvider extends Component {
  state = {
    registeredApps: null,
    tabs: [],
    userDetails: null,
    tabsConfig: [],
    selectedTab: null,
    tabApps: [],
    cryptoCoins: [],
    fiatCoins: [],
    currencyImageList: null,
    refreshTable: null,
    openDownloadTab: false,
    nameImageList: [],
    allAppsData: {},
    currentTheme: "light",
    miniTabSelected: null,
  };
  refresh = () => {
    this.setState({
      tabsConfig: [],
      selectedTab: null,
      miniTabSelected: null,
      tabApps: [],
      registeredApps: null,
    });
  };
  updateState = (state, info) => {
    if (
      ["tabsConfig", "selectedTab", "miniTabSelected", "tabApps", "registeredApps"].includes(
        state
      )
    ) {
      localStorage.setItem(state, JSON.stringify(info));
    }
    this.setState({ [state]: info });
  };

  checkLocalData = () => {
    let a = localStorage.getItem("tabsConfig");
    a && this.setState({ tabsConfig: JSON.parse(a) });

    let b = localStorage.getItem("selectedTab");
    b && this.setState({ selectedTab: JSON.parse(b) });

    let c = localStorage.getItem("miniTabSelected");
    c && this.setState({ miniTabSelected: JSON.parse(c) });

    let d = localStorage.getItem("tabApps");
    d && this.setState({ tabApps: JSON.parse(d) });
  };

  setUpRApps = async () => {
    let res = await getRegisteredApp();
    if (res.data.status) {
      this.setState({ registeredApps: res.data.userApps });
      let tempObj = {};
      let temp = res.data.userApps.map((x) => {
        tempObj = {
          ...tempObj,
          [x.app_code]: { app_name: x.app_name, app_icon: x.app_icon },
        };
        return x;
      });
      this.setState({ allAppsData: { ...tempObj } });
    } else {
    }
  };
  setUpUserDetails = async () => {
    let res = await getUserDetails();
    if (res.data.status) {
      this.setState({ userDetails: res.data.user });
    } else {
      this.setState({ userDetails: null });
    }
  };
  setUpAllCoins = async () => {
    let res = await fetchAllCoins();
    let temp1 = res.data.coins.filter((item) => {
      return item.type === "fiat";
    });
    let justCoins = temp1.map((obj) => {
      return obj.coinSymbol;
    });
    let temp2 = res.data.coins.filter((item) => {
      return item.type === "crypto";
    });
    let justCoinsTwo = temp2.map((obj) => {
      return obj.coinSymbol;
    });
    let tempObj = {};
    let tempObjTwo = {};
    res.data.coins.forEach((element) => {
      let t = {
        [`${element.coinSymbol}`]: element?.coinImage,
      };
      let t2 = {
        [`${element.coinSymbol}`]: {
          _24hrchange: element?._24hrchange,
          coinName: element?.coinName,
          _id: element?._id,
          coinImage: element?.coinImage,
        },
      };
      tempObj = { ...tempObj, ...t };
      tempObjTwo = { ...tempObjTwo, ...t2 };
    });
    this.setState({
      currencyImageList: { ...tempObj },
      cryptoCoins: [...justCoinsTwo],
      fiatCoins: [...justCoins],
      nameImageList: { ...tempObjTwo },
    });
  };
  logOut = () =>{
    localStorage.clear();
    this.resetContext();
  }
  componentDidMount() {
    this.setUpRApps();
    this.setUpUserDetails();
    this.setUpAllCoins();
    this.checkLocalData();
  }
  // componentWillMount() {
  //   this.setUpRApps();
  //   this.setUpUserDetails();
  //   this.setUpAllCoins();
  //   this.checkLocalData();
  // }
  dateFormatter = (str) => {
    let temp = str.split("/");
    let final = `${months[temp[0]]} ${temp[1] + dateSuffix[temp[1] % 10]} ${
      temp[2]
    }`;
    return final;
  };
  valueFormatter = (value, coin) => {
    let cryptoCoins = ["ETH", "BTC", "LTC", "SEF"];

    if (value === "" || value === undefined || isNaN(value)) {
      if (cryptoCoins?.includes(coin?.toUpperCase())) {
        return [0.0];
      } else {
        return this.valueFormatter(0, coin);
      }
    } else {
      if (cryptoCoins?.includes(coin?.toUpperCase())) {
        let tempValue = parseFloat(value)?.toFixed(9)?.toString();
        return value?.toString()?.includes(".")
          ? [tempValue?.substring(0, 7)]
          : [tempValue?.substring(0, 6)];
      } else {
        if (this.state.fiatCoins.includes(coin)) {
          let formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: coin,
            minimumFractionDigits: 2,
          });

          value = formatter.format(value);
        } else {
          value = parseFloat(value).toFixed(2);
        }
        return [value];
      }
    }
  };
  resetContext = () =>{
    this.setState({...initialState})

  }
  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          updateState: this.updateState,
          dateFormatter: this.dateFormatter,
          valueFormatter: this.valueFormatter,
          refresh: this.refresh,
          logOut: this.logOut
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

const dateSuffix = {
  0: "th",
  1: "st",
  2: "nd",
  3: "rd",
  4: "th",
  5: "th",
  6: "th",
  7: "th",
  8: "th",
  9: "th",
};

const months = {
  1: "Jan",
  2: "Feb",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "Aug",
  9: "Sept",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};
const initialState = {
  registeredApps: null,
  tabs: [],
  userDetails: null,
  tabsConfig: [],
  selectedTab: null,
  tabApps: [],
  cryptoCoins: [],
  fiatCoins: [],
  currencyImageList: null,
  refreshTable: null,
  openDownloadTab: false,
  nameImageList: [],
  allAppsData: {},
  currentTheme: "light",
  miniTabSelected: null,
};
