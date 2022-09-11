import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import StockAnalyzerTabs from "../Components/StockAnalyzerTabs"
import financialFreedom from "../../img/financialFreedom.webp"
import StockSearchBar from "../Components/StockSearchBar"

const StockAnalyzerLayout = ({selectedStock, setSelectedStock, setCompanyData, companyData, calculatedCompanyData, setCalculatedCompanyData}) => {
  
  
  return (
    <>
    <div className="container-fluid border">
      <div className="row justify-content-center text-center" >
        <div className="col-md-9 col-lg-8 col-sm-12 m-3 align-items-center">
          <div className="row">
            <StockSearchBar selectedStock={selectedStock} setSelectedStock={setSelectedStock} setCompanyData={setCompanyData} companyData={companyData} calculatedCompanyData={calculatedCompanyData} setCalculatedCompanyData={setCalculatedCompanyData}/>
          </div>              
          {(selectedStock.cik === "-1") ? 
          <div className="row">
            <h4>Evaluate Your Stock for Financial Freedom</h4>
            <img src={financialFreedom}/> 
          </div>
              :
          <div className="row">
            <StockAnalyzerTabs/>              
            <Outlet/>
          </div>}
        </div>
      </div>
    </div>
    </>
  )
}

export default StockAnalyzerLayout