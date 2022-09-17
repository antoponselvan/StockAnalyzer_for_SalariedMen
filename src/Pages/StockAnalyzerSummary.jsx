import { useState } from "react";
import { useEffect } from "react"

const StockAnalyzerSummary = ({companySummaryData, companySharePrice, kpiScore, companySummary}) => {
  // const [colorCode, setColorCode] = useState({})
  useEffect(()=>{
    Plotly.newPlot('stockPriceGraph', [{
      x: companySharePrice.time,
      y: companySharePrice.val}], {
        margin: {t:0}
      });

    Plotly.newPlot("summaryRadarChart", [{
      type: 'scatterpolar',
      r: [companySummary.scoreSummary.safeguard, companySummary.scoreSummary.fundamentals, companySummary.scoreSummary.valuation],
      theta: ['Safeguarding','Fundamentals','Valuation'],
      fill: 'toself'}], 
      {polar: {
          radialaxis: {
            visible: false,
            range: [0, 10]
          }
        },
        showlegend: false
      }
      )
  },[companySummary])

  const relevantKpiAttributes = Object.keys(kpiScore)
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
      <div className="row align-items-center mt-4">
        <div className="col-md-6">
          <h5>Share Price</h5>
          <div id="stockPriceGraph" className="" style={{height:300}}>
          </div>
        </div>
        <div className="col-md-6">
          <div id="summaryRadarChart" className="" style={{height:300}}>
          </div>
        </div>
      </div>    
      <div className="row align-items-start my-5">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
            <h5 className="card-title">Financial Fundamentals</h5>
            <ul className="list-group list-group-flush text-start">
              <li className={"list-group-item lead " + colorCode.revenueCAGR}>Revenue CAGR (%) : {companySummary.fundamentalsSummary.revenueCAGR}</li>
              <li className={"list-group-item lead " + colorCode.incomeCAGR}>Income CAGR (%) : {companySummary.fundamentalsSummary.incomeCAGR}</li>
              <li className={"list-group-item lead " + colorCode.debtByAssetsCAGR}>DebyByAssets CAGR (%): {companySummary.fundamentalsSummary.debtByAssetsCAGR}</li>
            </ul>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
            <h5 className="card-title">Valuation</h5>
            <ul className="list-group list-group-flush text-start">
              <li className={"list-group-item lead " + colorCode.PECurrent}>PE (Current - 2yr EPS) : {companySummary.valuationSummary.PE} vs PE(Ideal):{companySummary.valuationSummary.PEIdeal}</li>
              <li className={"list-group-item lead " + colorCode.PBCurrent}>PB (Current - 2yr BV): {companySummary.valuationSummary.PB} vs PB(Ideal):{companySummary.valuationSummary.PBIdeal?.toFixed(2)}</li>
            </ul>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
            <h5 className="card-title">Safeguarding Factors</h5>
            <ul className="list-group list-group-flush text-start">
              <li className={"list-group-item lead " + colorCode.indexConstituent}>Part of S&P500: {companySummary.safeguardsSummary.indexConstituent}</li>
              <li className={"list-group-item lead " + colorCode.yearCount}>{"Year Count Since IPO: (>=) "}{companySummary.safeguardsSummary.publicYearCount}</li>
              <li className={"list-group-item lead " + colorCode.stockPrice}>StockPrice CAGR {companySummary.safeguardsSummary.sharePriceCAGR}%</li>
            </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockAnalyzerSummary