import { Link } from "react-router-dom"
import { useState } from "react";

const StockAnalyzerTabs = () => {
  
  const [requestedStockAnalyzerPage, setRequestedStockAnalyzerPage] = useState("summary");
  const handleClick = (clickedLi) => () => setRequestedStockAnalyzerPage(clickedLi)

  return (
    <>
        <ul className="nav nav-tabs border justify-content-center">
            <Link to="/StockAnalyzer/Summary"><li className="nav-item" onClick={handleClick("summary")}>
                <a className={"text-center nav-link "+(requestedStockAnalyzerPage==="summary"? " active" : "")}> Summary</a>
            </li></Link>
            <Link to="/StockAnalyzer/Fundamentals"><li className="nav-item" onClick={handleClick("financialFundamentals")}>
                <a className={"text-center nav-link "+(requestedStockAnalyzerPage==="financialFundamentals"? " active" : "")}>Financial Fundamentals</a>
            </li></Link>
            <Link to="/StockAnalyzer/Valuation"><li className="nav-item" onClick={handleClick("valuation")}>
                <a className={"text-center nav-link "+(requestedStockAnalyzerPage==="valuation"? " active" : "")}>Valuation</a>
            </li></Link>
        </ul>
    
    </>
  )
}

export default StockAnalyzerTabs