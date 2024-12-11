import React, { useEffect, useState } from "react";
import { buyProduct } from "./apidata";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../components/store/store.ts";
import axios from "axios";
import { LoadingAnimation1 } from "../../../components/LoadingAnimation1";
import lg1 from "../../../static/images/login/lg1.svg";

const Step4 = ({ setAcceptOffer }) => {
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [isloading, setisloading] = useState(true);
  const [isfinalstep, setIsfinalstep] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const { setBuy, mallselectedCoin, index, setIndex } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    let email = userDetails?.user?.email;
    if (email) {
      axios
        .get(`https://comms.globalxchange.io/user/details/get?email=${email}`)
        .then((res) => {
          const { data } = res;
          if (data?.status) {
            setProfileId(data?.user["naavi_profile_id"]);
          }
        });
    }
  }, []);

  // useEffect(() => {
  //   let product = localStorage.getItem("product");
  //   setIndex(JSON.parse(product));
  // }, []);

  useEffect(() => {
    if (profileId && index) {
      let userEmail = userDetails?.user?.email;
      let token = userDetails?.idToken;
      let billing = index?.lifetime
        ? "lifetime"
        : index?.monthly
        ? "monthly"
        : "annual";

      let obj = {
        email: userEmail,
        token: token,
        product_id: index?.product_id,
        billing_method: billing,
        pay_with_coin: mallselectedCoin?.coinSymbol,
        app_code: "naavi",
        profile_id: profileId,
        client_app: 'naavi'
      };

      // console.log(obj, "obj");

      buyProduct(obj).then((response) => {
        let result = response?.data;
        // console.log(result, 'result');
        if (result?.status) {
          setIsfinalstep(true);
          setisloading(false);
        } else {
          setisloading(false);
          setErrMsg(result?.message);
        }
      });
    }
  }, [profileId, index]);

  return (
    <>
      {isloading ? (
        <div
          className="loading-component"
          style={{
            width: "100%",
            display: "flex",
            height: "100%",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <LoadingAnimation1 icon={lg1} width={200} />
          <div className="bottom-textt">Buying {index?.product_name}</div>
        </div>
      ) : (
        <>
          {isfinalstep ? (
            <>
              <div className="success-text-cs">
                You Have Successfully Subscribed To {index?.product_name}
              </div>
              <div className="buttonss-cs">
                <div className="buy-btn-cs">See Receipt</div>
                <div
                  className="share-btn-cs"
                  onClick={() => {
                    setBuy("step1");
                    setErrMsg("");
                    setIsfinalstep(false);
                    setAcceptOffer(false);
                    setIndex([]);
                  }}
                >
                  Close
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="success-text-cs">{errMsg}</div>
              <div className="buttonss-cs">
                <div
                  className="share-btn-cs"
                  style={{ textAlign: "center" }}
                  onClick={() => {
                    // navigate("/dashboard/users");
                    setBuy("step1");
                    setErrMsg("");
                    setIsfinalstep(false);
                    setAcceptOffer(false);
                    setIndex([]);
                  }}
                >
                  Close
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Step4;
