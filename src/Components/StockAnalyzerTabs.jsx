import { useNavigate } from "react-router-dom"
import { useState } from "react";
import { useEffect } from "react";

const StockAnalyzerTabs = () => {
  
  const [requestedStockAnalyzerPage, setRequestedStockAnalyzerPage] = useState("summary");
  const navigate = useNavigate();

  useEffect(() => { 
    switch (requestedStockAnalyzerPage){
        case "summary": {
            navigate("/StockAnalyzer/Summary")
            break;
        }
        case "financialFundamentals":{
            navigate("/StockAnalyzer/Fundamentals")
            break;
        }
        case "valuation":{
            navigate("/StockAnalyzer/Valuation")
            break;
        }
    }
  },[requestedStockAnalyzerPage])
  
  const handleClick = (clickedLi) => () => setRequestedStockAnalyzerPage(clickedLi)

  return (
    <>
        <ul className="nav nav-tabs border justify-content-center">
            <li className="nav-item" onClick={handleClick("summary")}>
                <a className={"text-center nav-link "+(requestedStockAnalyzerPage==="summary"? " active" : "")}> Summary</a>
            </li>
            <li className="nav-item" onClick={handleClick("financialFundamentals")}>
                <a className={"text-center nav-link "+(requestedStockAnalyzerPage==="financialFundamentals"? " active" : "")}>Fundamentals</a>
            </li>
            <li className="nav-item" onClick={handleClick("valuation")}>
                <a className={"text-center nav-link "+(requestedStockAnalyzerPage==="valuation"? " active" : "")}>Valuation</a>
            </li>
        </ul>
    
    </>
  )
}

export default StockAnalyzerTabs