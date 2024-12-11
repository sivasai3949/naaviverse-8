import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

const PurchasePage = ({
    showDrop,
    setShowDrop,
    search,
    setSearch,
    searchic,
    profile,
    downarrow,
    purchaseData
}) => {

    const [isTxnLoading, setIsTxnLoading] = useState(false)
    const [txnData, setTxnData] = useState([])

    const [crmMenu, setcrmMenu] = useState('All')

    useEffect(() => {
      console.log(purchaseData, "jebifebferf3r")
      setTxnData(purchaseData)
    }, [purchaseData])

    const dateFormat = (dateString) => {
        const date = new Date(dateString);
        const options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
        };

        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
        return formattedDate
    }

    // useEffect(() => {
    //     const userDetails = JSON.parse(localStorage.getItem("user"));
    //     axios.get(
    //       `https://careers.marketsverse.com/userpurchase/get?creatoremail=${userDetails?.user?.email}`
    //     ).then(({data})=> {
    //         if(data?.status){
    //             console.log(data, "ljefhkjwefkwef")
    //             setTxnData(data?.data)
    //         }
    //     })
    // }, [])


    return ( 
        <>
        <div className="crm-all-box">
           
           <>
             <div className="crm-purchase-tab">
               <div className="crm-purchase-col2">Date</div>
               <div className="crm-purchase-col2">Customer</div>
               <div className="crm-purchase-col2">Service</div>
               <div className="crm-purchase-col3">Amount</div>
               <div className="crm-purchase-col3">Billing Frequency</div>
               <div className="crm-purchase-col4">Status</div>
             </div>
             <div className="purchase-alldata">
              
                 <>
                   {purchaseData
                     ?.filter(
                       (item) =>
                         item?.serviceDetails[0]?.name
                           .toLowerCase()
                           .startsWith(search?.toLowerCase()) ||
                         item.purchaseStatus
                           .toLowerCase()
                           .startsWith(search?.toLowerCase())
                     )
                     ?.map((each, i) => (
                       <div className="each-purchase">
                         <div className="crm-purchase-col2">{dateFormat(each?.createdAt)}</div>
                         <div className="crm-purchase-col2">{each?.serviceDetails[0]?.productcreatoremail}</div>
                         <div className="crm-purchase-col2">{each?.serviceDetails[0]?.name}</div>
                         <div className="crm-purchase-col3">{each?.serviceDetails[0]?.billing_cycle?.lifetime?.price || each?.serviceDetails[0]?.billing_cycle?.monthly?.price || each?.serviceDetails[0]?.billing_cycle?.annual?.price} {each?.serviceDetails[0]?.billing_cycle?.lifetime?.coin || each?.serviceDetails[0]?.billing_cycle?.monthly?.coin || each?.serviceDetails[0]?.billing_cycle?.annual?.coin}</div>
                         <div className="crm-purchase-col3">{each?.serviceDetails[0]?.chargingtype}</div>
                         <div className="crm-purchase-col4">{each?.serviceDetails[0]?.purchaseStatus? each?.serviceDetails[0]?.purchaseStatus: "N/A"}</div>
                       </div>
                     ))}
                 </>
             </div>
           </>
       
       </div>
      </>
     );
}
 
export default PurchasePage;