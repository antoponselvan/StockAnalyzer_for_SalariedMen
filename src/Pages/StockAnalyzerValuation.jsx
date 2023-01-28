import { useEffect } from "react"
import Plot from 'react-plotly.js';
import { useState } from "react";
// import PlotlyComponent from "../C?omponents/TestComponents/PlotlyComponent";

const StockAnalyzerValuation = ({ kpiScore, companyValuation}) => {
  const [valuationGraphDim, setValuationGraphDim] = useState((window.innerWidth*0.9))
  let PE = {x: companyValuation.details.PE.time, y: companyValuation.details.PE.val, name:"PE" };
  let PEmovingAvg = {x: companyValuation.details.PEMovingAvg.time, y: companyValuation.details.PEMovingAvg.val, name:"PE(3y)" }
  let PEyAxisHighLim = 100
  let PEyMax = Math.max(...PE.y)
  if (PEyMax < 100) {PEyAxisHighLim=PEyMax}
  
  let PB = {x: companyValuation.details.PB.time, y: companyValuation.details.PB.val, name:"PB" };
  let PBmovingAvg = {x: companyValuation.details.PBMovingAvg.time, y: companyValuation.details.PBMovingAvg.val, name:"PB(3y)" }
  
  const relevantKpiAttributes = ["PECurrent", "PBCurrent"]
  let colorCode={}
  for (let kpi of relevantKpiAttributes){
    switch (kpiScore[kpi]) {
      case 0:
        colorCode[kpi] = "text-danger";
        break;
      case 1:
        colorCode[kpi] = "text-warning"
        break;
      case 2:
        colorCode[kpi] = "text-success"
        break;
      default:
        colorCode[kpi] = "text-dark"
    }

  }
  const handleResize = () => {
    const winSize = window.innerWidth
    if (winSize >= 992){
      setValuationGraphDim(winSize*0.9*(7/12))
    } else if (winSize >= 768){
      setValuationGraphDim(winSize*0.9*(9/12))
    } else {
      setValuationGraphDim(winSize*0.9)
    }    
  }
  window.addEventListener('resize', handleResize)

  useEffect(()=>{handleResize()},[])

  if (companyValuation.allDataLoaded) {
    return (
      <div className="col border-start border-bottom border-end">
        <div className="row align-items-center m-2 mt-5">
            <h5>P/E (Earnings) Based Valuation</h5>
            <Plot data={[PE, PEmovingAvg]} layout={{width: valuationGraphDim, height: 400 , yaxis: {range:[0, PEyAxisHighLim]} ,margin: {t:0, l:40,r:40}}}/>
            <h6 className={colorCode.PECurrent}>PE (Current (2yr EPS)): {companyValuation.summary.PE}</h6>
            <h6 className={colorCode.PECurrent}>PE (3yr moing avg): {companyValuation.summary.PEIdeal}</h6>
            <p>{"(PE(Cur) / PE(3yAvg)) < 0.95:Green  ; >1.05:Red;  Else:Yellow"}</p>
        </div>
        <div className="m-5">.</div>
        <div className="row align-items-center m-2 mt-5">
          <h5>P/B (Asset-Debt) Based Valuation</h5>
          <Plot data={[PB, PBmovingAvg]} layout={{width: valuationGraphDim, height: 400 , margin: {t:0, l:40,r:40}}}/> 
          <h6 className={colorCode.PBCurrent}>P/B (Current (2yr BV)): {companyValuation.summary.PB}</h6>
          <h6 className={colorCode.PBCurrent}>P/B (3yr moing avg): {companyValuation.summary.PBIdeal}</h6>
          <p>{"(PB(Cur) / PB(3yAvg)) < 0.95:Green  ; >1.05:Red;  Else:Yellow"}</p>
        </div>
        
      </div>
    )} else {
      return(
        <div className="text-center m-5">
          <div className="spinner-grow text-secondary" role="status"></div>
          <div className="spinner-grow text-secondary" role="status"></div>
          <div className="spinner-grow text-secondary" role="status"></div>
        </div> 
      )
    }
}

export default StockAnalyzerValuation