import { useEffect } from "react"

const StockAnalyzerSummary = ({companySummaryData, companySharePrice}) => {
  
  useEffect(()=>{
    Plotly.newPlot('stockPriceGraph', [{
      x: companySharePrice.time,
      y: companySharePrice.val}], {
        margin: {t:0}
      });

    Plotly.newPlot("summaryRadarChart", [{
      type: 'scatterpolar',
      r: [companySummaryData.scoreSummary.safeguard, companySummaryData.scoreSummary.fundamentals, companySummaryData.scoreSummary.valuation],
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
  },[companySharePrice])

  console.log(companySummaryData.safeguardsSummary)
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
            {/* <img src="../../img/FinancialHealth.jpg" className="card-img-top" alt="..."/> */}
            <div className="card-body">
            <h5 className="card-title">Financial Fundamentals</h5>
            <ul className="list-group list-group-flush text-start">
              <li className="list-group-item text-dark">Revenue CAGR (%) : {companySummaryData.fundamentalsSummary.revenueCAGR}</li>
              <li className="list-group-item text-dark">Income CAGR (%) : {companySummaryData.fundamentalsSummary.incomeCAGR}</li>
              <li className="list-group-item text-dark">DebyByEquity CAGR (%): {companySummaryData.fundamentalsSummary.debtByEquityCAGR}</li>
            </ul>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            {/* <img src="../../img/ValuationSmall.webp" className="card-img-top" alt="..."/> */}
            <div className="card-body">
            <h5 className="card-title">Valuation</h5>
            <ul className="list-group list-group-flush text-start">
              <li className="list-group-item text-dark">PE : {companySummaryData.valuationSummary.PE} vs PE(Ideal):{companySummaryData.valuationSummary.PEIdeal}</li>
              <li className="list-group-item text-dark">PB : {companySummaryData.valuationSummary.PB} vs PB(Ideal):{companySummaryData.valuationSummary.PBIdeal}</li>
            </ul>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            {/* <img src="../../img/SafeguardingSmall.png" className="card-img-top" style={{height:100, width:160}} alt="..."/> */}
            <div className="card-body">
            <h5 className="card-title">Safeguarding Factors</h5>
            <ul className="list-group list-group-flush text-start">
              <li className="list-group-item text-success">Part of S&P500: {companySummaryData.safeguardsSummary.indexConstituent}</li>
              <li className="list-group-item text-success">Year Count Since IPO: {companySummaryData.safeguardsSummary.publicYearCount}</li>
              <li className="list-group-item text-success">StockPrice CAGR {companySummaryData.safeguardsSummary.sharePriceCAGR}%</li>
            </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockAnalyzerSummary