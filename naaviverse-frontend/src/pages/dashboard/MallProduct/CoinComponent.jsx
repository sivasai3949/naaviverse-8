import React, { useEffect, useState } from 'react';
import './malls.scss';
import { coinData } from './apidata';
import Skeleton from 'react-loading-skeleton';
import { useStore } from "../../../components/store/store.ts";

const CoinComponent = () => {
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const {
    setMallCoinData,
    setBuy,
    setMallSeclectedCoin,
    filteredcoins,
    setfilteredcoins,
  } = useStore();
  const [isloading, setisloading] = useState(true);

  useEffect(() => {
    let userEmail = userDetails?.user?.email;
    let obj = {
      app_code: 'naavi',
      email: userEmail,
      post_app_prices: true,
      with_balances: true,
      orderby_dsc: true,
    };
    coinData(obj).then((response) => {
      let result = response?.data?.coins_data;
      setMallCoinData(result);
      setfilteredcoins(result);
      setisloading(false);
    });
  }, []);

  return (
    <>
      {isloading
        ? Array(10)
            .fill(' ')
            .map((item, index) => {
              return (
                <div className="coin-comp" key={index}>
                  <Skeleton width={40} height={40} borderRadius={50} />
                  <div className="coinnamee">
                    <Skeleton width={75} height={25} />
                  </div>
                  <div className="coinvaluee">
                    <Skeleton width={75} height={25} />
                  </div>
                </div>
              );
            })
        : filteredcoins?.map((e, i) => {
            return (
              <div
                className="coin-comp"
                key={i}
                onClick={() => {
                  setBuy('step3');
                  setMallSeclectedCoin(e);
                }}
              >
                <img src={e?.coinImage} alt="coin" style={{ width: '10%' }} />
                <div className="coinnamee">{e?.coinSymbol}</div>
                <div className="coinvaluee">{e?.coinValue}</div>
              </div>
            );
          })}
    </>
  );
};

export default CoinComponent;
