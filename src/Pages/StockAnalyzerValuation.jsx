import { useEffect } from "react"
import Plot from 'react-plotly.js';
// import PlotlyComponent from "../C?omponents/TestComponents/PlotlyComponent";

const StockAnalyzerValuation = ({ kpiScore, companyValuation}) => {
  let PE = {x: companyValuation.details.PE.time, y: companyValuation.details.PE.val, name:"PE" };
  let PEmovingAvg = {x: companyValuation.details.PEMovingAvg.time, y: companyValuation.details.PEMovingAvg.val, name:"PE (3yr Avg)" }
  let PEyAxisHighLim = 100
  let PEyMax = Math.max(...PE.y)
  if (PEyMax < 100) {PEyAxisHighLim=PEyMax}
  
  let PB = {x: companyValuation.details.PB.time, y: companyValuation.details.PB.val, name:"PB" };
  let PBmovingAvg = {x: companyValuation.details.PBMovingAvg.time, y: companyValuation.details.PBMovingAvg.val, name:"PB (3yr Avg)" }
  
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

  return (
    <div className="col border-start border-bottom border-end">
      <div className="row align-items-center m-2 mt-5">
        <div className="col-md-9">
          <Plot data={[PE, PEmovingAvg]} layout={{height: 300 , margin:{t:0}, yaxis: {range:[0, PEyAxisHighLim]
      }}}/>
        </div>
        <div className="col">
          <h6 className={colorCode.PECurrent}>PE (Current (2yr EPS)): {companyValuation.summary.PE}</h6>
          <h6>PE (3yr moing avg): {companyValuation.summary.PEIdeal}</h6>
        </div>
      </div>

      <div className="row align-items-center m-2 mt-5">
        <div className="col-md-9">
        <Plot data={[PB, PBmovingAvg]} layout={{height: 300 , margin:{t:0},}}/>     
        </div>
        <div className="col">
          <h6 className={colorCode.PBCurrent}>P/B (Current (2yr BV)): {companyValuation.summary.PB}</h6>
          <h6>P/B (3yr moing avg): {companyValuation.summary.PBIdeal}</h6>
        </div>
      </div>
      
    </div>
  )
}

export default StockAnalyzerValuation