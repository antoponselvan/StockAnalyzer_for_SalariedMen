import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import StockAnalyzerTabs from "../Components/StockAnalyzerTabs"
import financialFreedom from "../../img/financialFreedom.webp"
import StockSearchBar from "../Components/StockSearchBar"

const StockAnalyzerLayout = ({selectedStockCIK, setSelectedStockCIK, setCompanyData}) => {
  
  console.log(selectedStockCIK)
  
  return (
    <>
    <div className="row justify-content-center container-fluid">
      <div className="col-md-9 col-lg-8 col-sm-12 m-3">
          <StockSearchBar selectedStockCIK={selectedStockCIK} setSelectedStockCIK={setSelectedStockCIK} setCompanyData={setCompanyData}/>
          
        <div className="text-center">
          { (selectedStockCIK === "-1") ? 
          <>
          <h4>Evaluate Your Stock for Financial Freedom</h4>
          <img src={financialFreedom}/> 
          </>
          :
          <>
          <StockAnalyzerTabs/>
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