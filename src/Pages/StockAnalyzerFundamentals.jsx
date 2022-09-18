import Plot from 'react-plotly.js';

const StockAnalyzerFundamentals = ({kpiScore, companyFundamentals}) => {
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

  return (
    <>    
        <div className="col border-start border-bottom border-end align-items-center">
          <div className="row align-items-center m-2 mt-5">
            <div className="col-md-9">
              <Plot data={[revenueData]} layout={{height: 300 , margin:{t:0} }}/>
            </div>
            <div className="col">
              <h4 className={colorCode.revenueCAGR}>CAGR (%): {companyFundamentals.summary.revenueCAGR}</h4>
            </div>
          </div>

          <div className="row align-items-center m-2">
            <div className="col-md-9">
              <Plot data={[incomeData]} layout={{height: 300 , margin:{t:0} }}/>
            </div>
            <div className="col">
              <h4 className={colorCode.incomeCAGR}>CAGR (%): {companyFundamentals.summary.incomeCAGR}</h4>
            </div>
          </div>

          <div className="row align-items-center m-2">
            <div className="col-md-9">
              <Plot data={[debtByAssetsData]} layout={{height: 300 , margin:{t:0} }}/>
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