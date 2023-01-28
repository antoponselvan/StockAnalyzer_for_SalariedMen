import { useEffect, useState } from "react"

const Recommendations = () => {
  const [companiesList, setCompaniesList] = useState([{"name": "Apple","ticker": "AAPL","revenueCAGR": 5,"incomeCAGR": 28,"debtByEquityCAGR": 1,"PECurrent":10,"PEIdeal":9,"PBCurrent":10,"PBIdeal":9,"indexConstituent": "Yes","publicYearCount": 10,"sharePriceCAGR": 5 }])
  const [analysisDate, setAnalysisDate] = useState("Jan 2023")
  const [isloading, setIsLoading] = useState(false)

 useEffect(()=>{
  setIsLoading(true)
  fetch('https://salariedmanstockanalyzer.s3.amazonaws.com/RecommendedCompanies_top3.json')
  .then((res)=>res.json())
  .then((data)=>{
    setIsLoading(false)
    setCompaniesList(data.companies)
    setAnalysisDate(data.date)
    console.log(data)
  })
  .catch((error)=>{
    console.log(error)
    setIsLoading(false)
  })

 },[])

  const companiesKPI = Object.keys(companiesList[0])
  return (
    <>
    <h3 className="text-center mt-3">Recommendations</h3>
    <p className="text-center">Below are the higest scoring top 3 companies (amongst top 10 S&P500 companies by market cap) </p>
    <p className="text-center">Date of Analysis: {analysisDate}</p>
    {
    isloading? 
      <div className="row justify-content-center">
        <div class="spinner-grow" role="status"></div>
        <div class="spinner-grow" role="status"></div>
        <div class="spinner-grow" role="status"></div>
      </div>
    :
    <div className="container-fluid row">
      <div className="col-sm-1"></div>
      <div className="col-sm-10 table-responsive">
        <table className="table table-hover text-center m-2 table-secondary">
          <thead>
            <tr>
              <th colSpan={3} className="bg-secondary text-white">Name</th>
              <th colSpan={3}>Financial Fundamentals (CAGR)</th>
              <th colSpan={4} className="bg-secondary text-white">Valuation</th>
              <th colSpan={3}>Safeguarding</th>
            </tr>
            <tr>
            <th className="bg-secondary text-white" scope="col">Sl#</th>
              {companiesKPI.map((companyKPI, index)=>{
              if ((index===0)||(index===1)||((index<9)&(index>4))){
              return <th className="bg-secondary text-white" scope="col" key={index}>{companyKPI}</th>
              } else {
                return <th scope="col" key={index}>{companyKPI}</th>
              }  
            })}
            </tr>
          </thead>
          <tbody>
            {companiesList.map((companyDetail, index) =>
            <tr key={index}>
              <th className="bg-secondary text-white" scope="row">{index+1}</th>
              <td className="bg-secondary text-white">{companyDetail.name}</td>
              <td className="bg-secondary text-white">{companyDetail.ticker}</td>
              <td>{companyDetail.revenueCAGR}</td>
              <td>{companyDetail.incomeCAGR}</td>
              <td>{companyDetail.debtByEquityCAGR}</td>
              <td className="bg-secondary text-white">{companyDetail.PECurrent}</td>
              <td className="bg-secondary text-white">{companyDetail.PEIdeal}</td>
              <td className="bg-secondary text-white">{companyDetail.PBCurrent}</td>
              <td className="bg-secondary text-white">{companyDetail.PBIdeal}</td>
              <td>{companyDetail.indexConstituent}</td>
              <td>{companyDetail.publicYearCount}</td>
              <td>{companyDetail.sharePriceCAGR}</td>            
            </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    }
    {/* <div className="text-center">
    <div className="spinner-grow text-secondary" role="status"></div>
    <div className="spinner-grow text-secondary" role="status"></div>
    <div className="spinner-grow text-secondary" role="status"></div>
    </div> */}
    </>
  )
}

export default Recommendations