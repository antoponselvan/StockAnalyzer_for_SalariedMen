import { useEffect } from "react";

const StockAnalyzerFundamentals = ({companyfundamentalsData}) => {
  
  useEffect(()=>{
    Plotly.newPlot( 'revenueGraph', [{
    x: companyfundamentalsData.details.revenue.time,
    y: companyfundamentalsData.details.revenue.val
    }], {
    margin: { t: 0 } } );

    Plotly.newPlot( 'incomeGraph', [{
      x: companyfundamentalsData.details.income.time,
      y: companyfundamentalsData.details.income.val
    }], {
      margin: { t: 0 } } );

    Plotly.newPlot( 'DbyEGraph', [{
      x: companyfundamentalsData.details.debtByEquity.time,
      y: companyfundamentalsData.details.debtByEquity.val
    
    }], {
      margin: { t: 0 } } );
  },[companyfundamentalsData])

  return (
    <>    
        <div className="col border-start border-bottom border-end align-items-center">
          <div className="row align-items-center m-2 mt-5">
            <div className="col-md-9">
              <div id="revenueGraph" className="border" style={{height:300}}>Revenue</div>
              <p>...</p>
            </div>
            <div className="col">
              <h4>CAGR (%): {companyfundamentalsData.summary.revenueCAGR}</h4>
            </div>
          </div>

          <div className="row align-items-center m-2">
            <div className="col-md-9">
              <div id="incomeGraph" className="border" style={{height:300}}>Income</div>
              <p>...</p>
            </div>
            <div className="col">
              <h4>CAGR (%): {companyfundamentalsData.summary.incomeCAGR}</h4>
            </div>
          </div>

          <div className="row align-items-center m-2">
            <div className="col-md-9">
              <div id="DbyEGraph" className="border" style={{height:300}}>Debt to Asset Ratio</div>
              <p>...</p>
            </div>
            <div className="col">
              <h4>CAGR (%): {companyfundamentalsData.summary.debtByEquityCAGR}</h4>
            </div>
          </div>

        </div>   
    </>
  )
}

export default StockAnalyzerFundamentals