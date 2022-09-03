import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import StockAnalyzerTabs from "../Components/StockAnalyzerTabs"
import financialFreedom from "../../img/financialFreedom.webp"
import StockSearchBar from "../Components/StockSearchBar"

const StockAnalyzerLayout = ({setCompanyData}) => {

  const [requestedStockAnalyzerPage, setRequestedStockAnalyzerPage] = useState("summary");
  const [selectedStockCIK, setSelectedStockCIK] = useState("-1");
  const [companyList, setcompanyList] = useState([{name:"", ticker:"", CIK:"0000320193"}]) 
  // useEffect Fn to load list of stocks
 
    useEffect(()=>{
        fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://data.sec.gov/api/xbrl/frames/us-gaap/AccountsPayableCurrent/USD/CY2022Q1I.json')}`)
        .then(response => {
            if (response.ok) return response.json()
            throw new Error('Network response was not ok.')
        })
        .then(data => {
            setcompanyList((JSON.parse(data.contents)).data.map((companyInfo)=>{return {"Name":companyInfo.entityName, "CIK":companyInfo.cik}}))
        })
    },[])

  console.log(selectedStockCIK)
  // Function to search thru stock list based on input

  return (
    <>
    <div className="row justify-content-center container-fluid">
        <div className="col-md-9 col-lg-8 col-sm-12 m-3">
            <StockSearchBar companyList={companyList} selectedStockCIK={selectedStockCIK} setSelectedStockCIK={setSelectedStockCIK} setCompanyData={setCompanyData}/>
            
            <div className="text-center">
            { (selectedStockCIK === "-1") ? 
            <>
            <h4>Evaluate Your Stock for Financial Freedom</h4>
            <img src={financialFreedom}/> 
            </>
            :
            <>
            <StockAnalyzerTabs requestedStockAnalyzerPage={requestedStockAnalyzerPage} setRequestedStockAnalyzerPage={setRequestedStockAnalyzerPage}/>
            <Outlet/>
            </>
            }
            </div>
        </div>
    </div>
    </>
  )
}

export default StockAnalyzerLayout