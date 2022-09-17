import { useEffect } from "react";

const StockAnalyzerFundamentals = ({kpiScore, companyFundamentals}) => {
  
  useEffect(()=>{
    Plotly.newPlot( 'revenueGraph', [{
    // x: companyfundamentalsData.details.revenue.time,
    // y: companyfundamentalsData.details.revenue.val
    x: companyFundamentals.details.revenue.time,
    y: companyFundamentals.details.revenue.val
    }], {
    margin: { t: 0 } } );

    Plotly.newPlot( 'incomeGraph', [{
      // x: companyfundamentalsData.details.income.time,
      // y: companyfundamentalsData.details.income.val
    x: companyFundamentals.details.income.time,
    y: companyFundamentals.details.income.val

    }], {
      margin: { t: 0 } } );

    Plotly.newPlot( 'DbyEGraph', [{
      // x: companyfundamentalsData.details.debtByEquity.time,
      // y: companyfundamentalsData.details.debtByEquity.val
      x: companyFundamentals.details.debtByAssets.time,
      y: companyFundamentals.details.debtByAssets.val
    
    }], {
      margin: { t: 0 } } );
  },[companyFundamentals])

  const relevantKpiAttributes = ["revenueCAGR", "incomeCAGR", "debtByAssetsCAGR"]
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
    <>    
        <div className="col border-start border-bottom border-end align-items-center">
          <div className="row align-items-center m-2 mt-5">
            <div className="col-md-9">
              <div id="revenueGraph" className="border" style={{height:300}}>Revenue</div>
              <p>...</p>
            </div>
            <div className="col">
              <h4 className={colorCode.revenueCAGR}>CAGR (%): {companyFundamentals.summary.revenueCAGR}</h4>
            </div>
          </div>

          <div className="row align-items-center m-2">
            <div className="col-md-9">
              <div id="incomeGraph" className="border" style={{height:300}}>Income</div>
              <p>...</p>
            </div>
            <div className="col">
              <h4 className={colorCode.incomeCAGR}>CAGR (%): {companyFundamentals.summary.incomeCAGR}</h4>
            </div>
          </div>

          <div className="row align-items-center m-2">
            <div className="col-md-9">
              <div id="DbyEGraph" className="border" style={{height:300}}>Debt to Asset Ratio</div>
              <p>...</p>
            </div>
            <div className="col">
              <h4 className={colorCode.debtByAssetsCAGR}>CAGR (%): {companyFundamentals.summary.debtByAssetsCAGR}</h4>
            </div>
          </div>

        </div>   
    </>
  )
}

export default StockAnalyzerFundamentals