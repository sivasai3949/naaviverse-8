import axios from 'axios';

export const coinData = (object) => {
  try {
    const response = axios.post(
      `https://comms.globalxchange.io/coin/vault/service/coins/get`,
      object
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const buyProduct = (object) => {
  try {
    const response = axios.post(
      `https://comms.globalxchange.io/gxb/product/buy`,
      object
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const allLicenses = (email) => {
  try {
    const response = axios.get(
      `https://comms.globalxchange.io/coin/vault/user/license/get?email=${email}`
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
