import Plot from 'react-plotly.js';
import { useState, useEffect } from 'react';

const StockAnalyzerSummary = ({companySharePrice, kpiScore, companySummary}) => {
  const [summaryGraphDim, setSummaryGraphDim] = useState((window.innerWidth*0.95))
  let sharePriceData = {x: companySharePrice.time, y: companySharePrice.val};
  let radarChartData = {
    type: 'scatterpolar',
    r: [companySummary.scoreSummary.safeguard, companySummary.scoreSummary.fundamentals, companySummary.scoreSummary.valuation],
    theta: ['Safeguards','Fundamentals','Valuation'],
    fill: 'toself'}
  let radarChartLayout = {polar: {radialaxis: {visible: false, range: [0, 10]}}, showlegend: false, margin:{t:0}, width:summaryGraphDim}


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
  const handleResize = () => {
    const winSize = window.innerWidth
    if (winSize >= 992){
      setSummaryGraphDim(winSize*0.47*(7/12))
    } else if (winSize >= 768){
      setSummaryGraphDim(winSize*0.47*(9/12))
    } else {
      setSummaryGraphDim(winSize*0.95)
    }    
  }
  window.addEventListener('resize', handleResize)

  useEffect(()=>{handleResize()},[])

  if (companySummary.allDataLoaded) {
  return (
    <div className="col border-start border-bottom border-end">
      <div className="row align-items-center mt-4">
        <div className="col-lg-6">
          <h5>Share Price</h5>          
          <Plot data={[sharePriceData]} layout={{width: summaryGraphDim, height: 400, margin: {t:40, l:40,r:40}}}/>          
        </div>
        <div className="col-lg-6 mt-5">
          <h5>Overall Summary Score</h5>
          <Plot data={[radarChartData]} layout={radarChartLayout}/>
        </div>
      </div>    
      <div className="row align-items-start my-5">
        <div className="col-md-4 mb-3">
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
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
            <h5 className="card-title">Valuation</h5>
            <ul className="list-group list-group-flush text-start">
              <li className={"list-group-item lead " + colorCode.PECurrent}>PE (Current - 2yr EPS) : {companySummary.valuationSummary.PE} vs PE(Ideal):{companySummary.valuationSummary.PEIdeal}</li>
              <li className={"list-group-item lead " + colorCode.PBCurrent}>PB (Current - 2yr BV): {companySummary.valuationSummary.PB} vs PB(Ideal):{companySummary.valuationSummary.PBIdeal}</li>
            </ul>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
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
    </div>)
  } else {
    return(
      <div className="text-center m-5">
        <div className="spinner-grow text-secondary" role="status"></div>
        <div className="spinner-grow text-secondary" role="status"></div>
        <div className="spinner-grow text-secondary" role="status"></div>
      </div> 
    )
  }
  
}

export default StockAnalyzerSummary