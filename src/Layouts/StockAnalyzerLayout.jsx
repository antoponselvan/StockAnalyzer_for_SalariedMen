import { Outlet } from "react-router-dom"
import StockAnalyzerTabs from "../Components/StockAnalyzerTabs"
import financialFreedom from "../../img/financialFreedom.webp"
import StockSearchBar from "../Components/StockSearchBar"

const StockAnalyzerLayout = ({selectedStock, setSelectedStock, setCompanyData, companyData}) => {
  
  return (
    <>
    <div className="container-fluid border">
      <div className="row justify-content-center text-center" >
        <div className="col-md-9 col-lg-7 col-sm-12 m-3 align-items-center">
          <div className="row">
            <StockSearchBar selectedStock={selectedStock} setSelectedStock={setSelectedStock} setCompanyData={setCompanyData} companyData={companyData} />
          </div>              
          {(selectedStock.cik === "-1") ? 
          <div className="row justify-content-center">
            <h4>Evaluate Your (US listed) Stock for Financial Freedom</h4>
            <div className="col-md-7">
              <img className="img-fluid" src={financialFreedom}/> 
            </div>
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