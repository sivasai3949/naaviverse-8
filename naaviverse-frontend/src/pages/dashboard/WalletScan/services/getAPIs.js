import axios from "axios";
import Axios from "axios";
export const getRegisteredApp = () => {
  const userDetails = JSON.parse(localStorage.getItem("user"));
  let email = userDetails?.user?.email;
  return axios.get(
    `https://comms.globalxchange.io/gxb/apps/registered/user?email=${email}`
  );
};

export const getUserDetails = () => {
  const userDetails = JSON.parse(localStorage.getItem("user"));
  let email = userDetails?.user?.email;
  return axios.get(
    `https://comms.globalxchange.io/user/details/get?email=${email}`
  );
};

export const fetchAllBankers = () => {
  return Axios(`https://teller2.apimachine.com/admin/allBankers`);
};
export function fetchAllCoins() {
  return Axios.get(`https://comms.globalxchange.io/coin/vault/get/all/coins`);
}
export const conversionAPI = (from, to) => {
  return Axios(
    `https://comms.globalxchange.io/forex/convert?buy=${from}&from=${to}`
  );
};
export const allCoinsConversion = (coin) => {
  return Axios.get(
    `https://comms.globalxchange.io/coin/getCmcPrices?convert=${coin}`
  );
};

export const bondEarningList = (email, coin) => {
  return axios.get(
    `https://comms.globalxchange.io/coin/iced/interest/logs/get?email=${email}&coin=${coin}`
  );
};

export const moneyMarketList = (email, app, coin) => {
  return Axios.get(
    `https://comms.globalxchange.io/coin/vault/service/user/app/interest/logs/get?email=${email}&app_code=${app}&coin=${coin}`
  );
};
