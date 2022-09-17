import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './Layouts/MainLayout'
import StockAnalyzerLayout from './Layouts/StockAnalyzerLayout'
import './App.css'
import HomePage from './Pages/HomePage'
import Recommendations from './Pages/Recommendations'
import StockAnalyzerSummary from './Pages/StockAnalyzerSummary'
import StockAnalyzerFundamentals from './Pages/StockAnalyzerFundamentals'
import StockAnalyzerValuation from './Pages/StockAnalyzerValuation'
import { useState } from 'react'

const formatRevenueOrIncome = (data) => {
  let companyDataFiltered = {timeStamp:[], val:[]};
  for (let index=0; index<data.end.length; index++){
      let normalizedData = data.val[index]*(90*24*3600*1000)/(Date.parse(data.end[index])-Date.parse(data.start[index]))
      companyDataFiltered.timeStamp.push(data.end[index])
      companyDataFiltered.val.push(normalizedData)   
  }
  return companyDataFiltered
  }

const calculateDebtByAssets = (assets, liabilities) => {
  let companyDebtByAssets = {time:[],val:[]}
  for (let index=0; index<assets.end.length; index++){
      let tempDebtByAssets = 1.3
      const debtIndex = liabilities.end.findIndex((dateItem)=>{
          return (Math.abs(Date.parse(dateItem) - Date.parse(assets.end[index])) < (5*24*3600*1000))
      })
      if (debtIndex !== -1){
          companyDebtByAssets.time.push(assets.end[index])
          let tempAssetItem = assets.val[index]
          let tempDebtItem = liabilities.val[debtIndex]
          tempDebtByAssets = tempDebtItem/tempAssetItem
          companyDebtByAssets.val.push(tempDebtByAssets)
      }                
  }
  return companyDebtByAssets
}

const calculatePE = (earningsPerShareDiluted, sharePrice) => {
  let companyPE = {time:[],val:[]}
  let latestEPSArray = []
  for (let index=0; index<earningsPerShareDiluted.end.length; index++){
      let tempPE = 23
      const sharePriceArray = sharePrice.valRaw.filter((val, index2)=>{
          let tempTimeDiff = Math.abs((Date.parse(earningsPerShareDiluted.end[index]) - Date.parse(sharePrice.time[index2]))/(24*3600*1000) )
          return (tempTimeDiff<46)
      }) 

      if ((sharePriceArray.length > 0.5)){
          const sharePriceAvg = sharePriceArray.reduce((prev, num) => prev+num)/sharePriceArray.length
          const annualizationFactor = (365*24*3600*1000)/(Date.parse(earningsPerShareDiluted.end[index])-Date.parse(earningsPerShareDiluted.start[index]))
          const annualEPS = earningsPerShareDiluted.val[index]*annualizationFactor
          tempPE = sharePriceAvg/annualEPS
          companyPE.time.push(earningsPerShareDiluted.end[index])
          companyPE.val.push(tempPE)

          if ((Date.now() - Date.parse(earningsPerShareDiluted.end[index]))< (2*365*24*3600*1000)){
              latestEPSArray.push(annualEPS)
          }
      }
  }
  const sharePriceTimeStamps = sharePrice.time.map((dateItem)=>Date.parse(dateItem))
  const maxSharePriceTimeStampIndex = sharePriceTimeStamps.reduce((iMax, timeStamp, timeStampIndex, arr)=> timeStamp>arr[iMax] ? timeStampIndex : iMax,0)
  const latestSharePrice = sharePrice.valRaw[maxSharePriceTimeStampIndex]
  let latestPE = "Inadequate Data"
  if ((latestEPSArray.length > 0.5) || ((Date.now()-sharePriceTimeStamps[maxSharePriceTimeStampIndex])<(94*24*3600*1000))) {
      const latestEPSArrayAvg = latestEPSArray.reduce((prev,current)=>prev+current,0)/latestEPSArray.length
      latestPE = (latestSharePrice/latestEPSArrayAvg).toFixed(2)        
  }     
  return [companyPE, latestPE]
}

const calculatePEMovingAvg = (PE) => {
  let companyPEMovingAvg = {time:[],val:[20]}
  for (let index=0; index<PE.time.length; index++){
      const adjacentPEArray = PE.val.filter((val, index2)=>{
          let tempTimeDiff = (Date.parse(PE.time[index]) - Date.parse(PE.time[index2]))/(24*3600*1000)
          return ((tempTimeDiff>0)&(tempTimeDiff<1000))
      }) 
      companyPEMovingAvg.time.push(PE.time[index])
      const tempMovingAvg = adjacentPEArray.reduce((prev, element)=> prev+element,0)/adjacentPEArray.length
      companyPEMovingAvg.val.push(tempMovingAvg)
  }
  return companyPEMovingAvg
  }


  const calculatePB = (assets, liabilities, commonStockSharesIssued, sharePrice) => {
    let companyPB = {time:[],val:[]}
    let latestBVArray = []
    for (let index=0; index<assets.end.length; index++){
        let tempPB = 1.3
        const sharePriceArray = sharePrice.valRaw.filter((val, index2)=>{
            let tempTimeDiff = Math.abs((Date.parse(assets.end[index]) - Date.parse(sharePrice.time[index2]))/(24*3600*1000) )
            return (tempTimeDiff<50)
        })
        const shareCountArray = commonStockSharesIssued.val.filter((val, index2)=>{
            let tempTimeDiff = (Date.parse(assets.end[index]) - Date.parse(commonStockSharesIssued.end[index2]))/(24*3600*1000)
            return ((tempTimeDiff<180)&(tempTimeDiff>0))
        })
        const liabilitiesArray = liabilities.val.filter((val, index2)=>{
            let tempTimeDiff = Math.abs((Date.parse(assets.end[index]) - Date.parse(liabilities.end[index2]))/(24*3600*1000) )
            return (tempTimeDiff<10)
        })

        if ((sharePriceArray.length > 0.5)&(shareCountArray.length>0.5)&(liabilitiesArray.length>0.5)){
            const sharePriceAvg = sharePriceArray.reduce((prev, num) => prev+num)/sharePriceArray.length
            const shareCountAvg = shareCountArray.reduce((prev, num) => prev+num)/shareCountArray.length
            const liabilitiesAvg = liabilitiesArray.reduce((prev, num) => prev+num)/liabilitiesArray.length
            const BV = (assets.val[index]-liabilitiesAvg)/shareCountAvg
            tempPB = sharePriceAvg/BV
            companyPB.time.push(assets.end[index])
            companyPB.val.push(tempPB)

            if ((Date.now() - Date.parse(assets.end[index]))< (2*365*24*3600*1000)){
                latestBVArray.push(BV)}
        }
    }
    
    const sharePriceTimeStamps = sharePrice.time.map((dateItem)=>Date.parse(dateItem))
    const maxSharePriceTimeStampIndex = sharePriceTimeStamps.reduce((iMax, timeStamp, timeStampIndex, arr)=> timeStamp>arr[iMax] ? timeStampIndex : iMax,0)
    const latestSharePrice = sharePrice.valRaw[maxSharePriceTimeStampIndex]
    let latestPB = "Inadequate Data"
    if ((latestBVArray.length > 0.5) || ((Date.now()-sharePriceTimeStamps[maxSharePriceTimeStampIndex])<(94*24*3600*1000))) {
        const latestBVArrayAvg = latestBVArray.reduce((prev,current)=>prev+current,0)/latestBVArray.length
        latestPB = (latestSharePrice/latestBVArrayAvg).toFixed(2)
    }
    return [companyPB, latestPB]
  }

  const calculatePBMovingAvg = (PB) => {
    let companyPBMovingAvg = {time:[],val:[]}
    for (let index=0; index< PB.time.length; index++){
        const adjacentPBArray = PB.val.filter((val, index2)=>{
            let tempTimeDiff = (Date.parse(PB.time[index]) - Date.parse(PB.time[index2]))/(24*3600*1000)
            return ((tempTimeDiff>0)&(tempTimeDiff<1000))
        }) 
        companyPBMovingAvg.time.push(PB.time[index])
        const tempMovingAvg = adjacentPBArray.reduce((prev, element)=> prev+element,0)/adjacentPBArray.length
        companyPBMovingAvg.val.push(tempMovingAvg)
    }    
    return companyPBMovingAvg
  }

function App() {
  const [selectedStock, setSelectedStock] = useState({cik:"-1", ticker:"", title:""});
  const [companyData, setCompanyData] = useState({
    Revenues:{fy:[2011], fp:["Q4"], start:[0], end:[0], val:[0]}, 
    NetIncomeLoss:{fy:[2011], fp:["Q4"], start:[0],  end:[0], val:[0]}, 
    Assets:{fy:[2011], fp:["Q4"], start:[0],  end:[0], val:[0]}, 
    Liabilities:{fy:[2011], fp:["Q4"], start:[0],  end:[0], val:[0]}, 
    StockholdersEquity:{fy:[2011], fp:["Q4"], start:[0],  end:[0], val:[0]}, 
    SharePrice:{time:[1,2,3], val:[12,13,14], valRaw:[13,16,17]}, 
    EarningsPerShareDiluted:{fy:[2011], fp:["Q4"], start:[0],  end:[0], val:[0]}, 
    CommonStockSharesIssued:{fy:[2011], fp:["Q4"], start:[0],  end:[0], val:[0]}})
  
  let formattedCompanyData = {
    safeguardsSummary: {indexConstituent: "Yes", publicYearCount: 10, sharePriceCAGR: 5},
    fundamentalsSummary: {revenueCAGR: 5, incomeCAGR: 4, debtByEquityCAGR:5},
    valuationSummary: {PE:10, PEIdeal:13, PB:2, PBIdeal:2.1},
    kpiScore:{revenueCAGR:0, incomeCAGR:1, debtByEquityCAGR:1, PECurrent:1, PBCurrent:1,indexConstituent:1, yearCount:1, stockPrice:1},
    scoreSummary:{fundamentals:8, valuation:8, safeguard:10},
    fundamentalsDetails: {revenue: {time:[1,2,3], val:[1000,2000,3000]},
                          income: {time:[1,2,3], val:[100,200,300]},
                          debtByAssets:{time:[1,2,3,4], val:[1.1,1.2,1.3,1.4]}},
    valuationDetails: {PE: {time:[1,2,3], val:[12,13,14]},
                      PEMovingAvg: {time:[1,2,3], val:[11,13,16]},
                      PB: {time:[1,2,3], val:[2.1,2.2,2.3]},
                      PBMovingAvg: {time:[1,2,3], val:[2,2.25,2.5]}
                    }
  }
  if (selectedStock.cik !== "-1"){
    formattedCompanyData.fundamentalsDetails.revenue = formatRevenueOrIncome(companyData.Revenues);
    formattedCompanyData.fundamentalsDetails.income = formatRevenueOrIncome(companyData.NetIncomeLoss);
    formattedCompanyData.fundamentalsDetails.debtByAssets = calculateDebtByAssets(companyData.Assets, companyData.Liabilities);
    [formattedCompanyData.valuationDetails.PE, formattedCompanyData.valuationSummary.PE] = calculatePE(companyData.EarningsPerShareDiluted, companyData.SharePrice);
    formattedCompanyData.valuationDetails.PEMovingAvg = calculatePEMovingAvg(formattedCompanyData.valuationDetails.PE)
    formattedCompanyData.valuationSummary.PE = formattedCompanyData.valuationDetails.PEMovingAvg[(formattedCompanyData.valuationDetails.PEMovingAvg.length -1)];
    [formattedCompanyData.valuationDetails.PB, formattedCompanyData.valuationSummary.PB] = calculatePB(companyData.Assets, companyData.Liabilities, companyData.CommonStockSharesIssued, companyData.SharePrice);
    formattedCompanyData.valuationDetails.PBMovingAvg = calculatePBMovingAvg(formattedCompanyData.valuationDetails.PB)
    formattedCompanyData.valuationSummary.PBIdeal = formattedCompanyData.valuationDetails.PBMovingAvg[(formattedCompanyData.valuationDetails.PBMovingAvg.length -1)];
  }
  
  const [calculatedCompanyData, setCalculatedCompanyData] = useState(
    {
      safeguardsSummary: {indexConstituent: "Yes", publicYearCount: 10, sharePriceCAGR: 5},
      fundamentalsSummary: {revenueCAGR: 5, incomeCAGR: 4, debtByEquityCAGR:5},
      valuationSummary: {PE:10, PEIdeal:13, PB:2, PBIdeal:2.1},
      scoreSummary:{fundamentals:8, valuation:8, safeguard:10},
      fundamentalsDetails: {revenue: {time:[1,2,3], val:[1000,2000,3000]},
                            income: {time:[1,2,3], val:[100,200,300]},
                            debtByEquity:{time:[1,2,3,4], val:[1.1,1.2,1.3,1.4]}},
      valuationDetails: {PE: {time:[1,2,3], val:[12,13,14]},
                        PEMovingAvg: {time:[1,2,3], val:[11,13,16]},
                        PB: {time:[1,2,3], val:[2.1,2.2,2.3]},
                        PBMovingAvg: {time:[1,2,3], val:[2,2.25,2.5]}
                      }
    }
  )
  const [kpiScore, setKpiScore] = useState({
    revenueCAGR:0, incomeCAGR:1, debtByEquityCAGR:1, PECurrent:1, PBCurrent:1,indexConstituent:1, yearCount:1, stockPrice:1 
  })

  const companyFundamentals={summary:formattedCompanyData.fundamentalsSummary, details:formattedCompanyData.fundamentalsDetails}
  const companyValuation = {summary:formattedCompanyData.valuationSummary, 
    details:formattedCompanyData.valuationDetails}
  
  return ( 
    
    <>
      <h1 className='ms-auto text-center bg-dark text-white p-3'>SalaryMan's Stock Analyzer</h1>      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout/>}>
            <Route index element={<HomePage/>}/>
            <Route path="/StockAnalyzer" element={<StockAnalyzerLayout 
            companyData={companyData} setCompanyData={setCompanyData} 
            selectedStock={selectedStock} setSelectedStock={setSelectedStock} 
            calculatedCompanyData={calculatedCompanyData} setCalculatedCompanyData={setCalculatedCompanyData} kpiScore={kpiScore} setKpiScore={setKpiScore}/>}>

              <Route path="/StockAnalyzer/Summary" element={<StockAnalyzerSummary 
              companySummaryData={{safeguardsSummary: calculatedCompanyData.safeguardsSummary,          fundamentalsSummary:calculatedCompanyData.fundamentalsSummary, 
              valuationSummary:calculatedCompanyData.valuationSummary, 
              scoreSummary:calculatedCompanyData.scoreSummary}} 
              companySharePrice={companyData.SharePrice} kpiScore={kpiScore}/>}/>

              <Route path="/StockAnalyzer/Fundamentals" element={<StockAnalyzerFundamentals 
              companyfundamentalsData={{summary:calculatedCompanyData.fundamentalsSummary, details:calculatedCompanyData.fundamentalsDetails}}  kpiScore={kpiScore} companyFundamentals={companyFundamentals}/>}/>
              
              <Route path="/StockAnalyzer/Valuation" element={<StockAnalyzerValuation 
              companyvaluationData={{summary:calculatedCompanyData.valuationSummary, 
              details:calculatedCompanyData.valuationDetails}}  kpiScore={kpiScore} companyValuation={companyValuation}/>}/>
            </Route>
            <Route path="/Recommendations" element={<Recommendations/>}/>
          </Route>
        </Routes>      
      </BrowserRouter>
    </>
  )
}

export default App
