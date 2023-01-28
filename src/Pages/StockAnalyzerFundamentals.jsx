import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const StockAnalyzerFundamentals = ({kpiScore, companyFundamentals}) => {
  const [fundamentalsGraphDim, setFundamentalGraphDim] = useState((window.innerWidth*0.85))
  let revenueData = {x: companyFundamentals.details.revenue.time, y: companyFundamentals.details.revenue.val};
  let incomeData = {x: companyFundamentals.details.income.time, y: companyFundamentals.details.income.val};
  let debtByAssetsData = {x: companyFundamentals.details.debtByAssets.time, y: companyFundamentals.details.debtByAssets.val};

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
  const handleResize = () => {
    const winSize = window.innerWidth
    if (winSize >= 992){
      setFundamentalGraphDim(winSize*0.9*(7/12))
    } else if (winSize >= 768){
      setFundamentalGraphDim(winSize*0.9*(9/12))
    } else {
      setFundamentalGraphDim(winSize*0.85)
    }
    
  }
  window.addEventListener('resize', handleResize)

  useEffect(()=>{handleResize()},[])

  if (companyFundamentals.allDataLoaded) {
    return (
      <>    
          <div className="col border-start border-bottom border-end align-items-center">
          <div className="row align-items-center m-2 my-5">
                <h5>Income</h5>
                <Plot data={[incomeData]} layout={{width: fundamentalsGraphDim, height: 400, margin: {t:0, l:40,r:40}}}/>
                <h6 className={colorCode.incomeCAGR}>CAGR (%): {companyFundamentals.summary.incomeCAGR}</h6>
                <p>{"> 5% : Green  ;  < 0% : Red  ; Rest : Yellow"}</p>
            </div>
            <div className="mt-5">.</div>
            <div className="row align-items-center m-2 my-5">
                <h5>Revenue</h5>
                <Plot data={[revenueData]} layout={{width: fundamentalsGraphDim, height: 400, margin: {t:0, l:40,r:40}}}/>
                <h6 className={colorCode.revenueCAGR}>CAGR (%): {companyFundamentals.summary.revenueCAGR}</h6>
                <p>{"> 5% : Green  ;  < 0% : Red  ; Rest : Yellow"}</p>
            </div>
            <div className="m-5">.</div>          
            <div className="row align-items-center m-2 my-5">
                <h5>Debt / Assets</h5>
                <Plot data={[debtByAssetsData]}  layout={{width: fundamentalsGraphDim, height: 400, margin: {t:40, l:40,r:40}}}/>
                <h6 className={colorCode.debtByAssetsCAGR}>CAGR (%): {companyFundamentals.summary.debtByAssetsCAGR}</h6>
                <p>{"< 0% : Green  ;  > 5% : Red  ; Rest : Yellow"}</p>
              </div>
          </div>   
      </>
    )
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

export default StockAnalyzerFundamentals