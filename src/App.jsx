import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './Layouts/MainLayout'
import StockAnalyzerLayout from './Layouts/StockAnalyzerLayout'
import './App.css'
import HomePage from './Pages/HomePage'
import Recommendations from './Pages/Recommendations'
import StockAnalyzerSummary from './Pages/StockAnalyzerSummary'
import StockAnalyzerFundamentals from './Pages/StockAnalyzerFundamentals'
import StockAnalyzerValuation from './Pages/StockAnalyzerValuation'
import sAndP500List from "./S&P500list";
import { useState } from 'react'

const formatRevenueOrIncome = (data) => {
  let companyDataFiltered = {time:[], val:[]};
  for (let index=0; index<data.end.length; index++){
      let normalizedData = data.val[index]*(90*24*3600*1000)/(Date.parse(data.end[index])-Date.parse(data.start[index]))
      companyDataFiltered.time.push(data.end[index])
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
              latestEPSArray.push(annualEPS)}
        }
    }
  const sharePriceTimeStamps = sharePrice.time.map((dateItem)=>Date.parse(dateItem))
  const maxSharePriceTimeStampIndex = sharePriceTimeStamps.reduce((iMax, timeStamp, timeStampIndex, arr)=> timeStamp>arr[iMax] ? timeStampIndex : iMax,0)
  const latestSharePrice = sharePrice.valRaw[maxSharePriceTimeStampIndex]
  let latestPE = "Inadequate Data"
  if ((latestEPSArray.length > 0.5) || ((Date.now()-sharePriceTimeStamps[maxSharePriceTimeStampIndex])<(94*24*3600*1000))) {
      const latestEPSArrayAvg = latestEPSArray.reduce((prev,current)=>prev+current,0)/latestEPSArray.length
      latestPE = (latestSharePrice/latestEPSArrayAvg).toFixed(1)        
  }  
  console.log([companyPE, latestPE])   
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
      latestPB = (latestSharePrice/latestBVArrayAvg).toFixed(1)
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



const calculatePublicYearCount = (revenueDates, incomeDates, sharePriceDates) => {
  const earliestRevenueDate = Math.min(...(revenueDates.map((dateItem)=>Date.parse(dateItem))))
  const earliestIncomeDate = Math.min(...(incomeDates.map((dateItem)=>Date.parse(dateItem))))
  const earliestSharePrice = Math.min(...(sharePriceDates.map((dateItem)=>Date.parse(dateItem))))
  const yearsSincePublic = ((Date.now()-(Math.min(earliestRevenueDate, earliestIncomeDate, earliestSharePrice)))/(365*24*3600*1000)).toFixed(1)
  return yearsSincePublic
}



  // Calculate CAGR ------------------------------------------------------------------
const calculateCAGR = (data) => {
  const dataUnixTime = data.time.map((dateItem)=>Date.parse(dateItem))
  const startTime = Math.min(...dataUnixTime)
  const endTime = Math.max(...dataUnixTime)
  if ((endTime-startTime)<(4*365*24*3600*1000)){
      return "Inadequate Data"
  } else {
      const dataInitial = data.val.filter((itemVal, index)=>(Date.parse(data.time[index])<(startTime+(2*365*24*3600*1000))))
      const dataInitialAvg = dataInitial.reduce((prev, current)=>(prev+current),0)/dataInitial.length
      const dataFinal = data.val.filter((val, index)=>(Date.parse(data.time[index])>(endTime)-(2*365*24*3600*1000)))
      const dataFinalAvg = dataFinal.reduce((prev, current)=>(prev+current),0)/dataFinal.length
      const timePeriodYrs = (endTime-startTime)/(365*24*3600*1000) - 2
      const CAGR = ((((dataFinalAvg/dataInitialAvg)**(1/timePeriodYrs))-1)*100).toFixed(1)
      return CAGR
  }
}



// Calculate KPI Score ----------------------------------------------------------------------
const kpiScoreCutOff = {
  revenueCAGR: [0,5], incomeCAGR:[0,5], debtByAssetsCAGR:[0, 5], PECurrent: [0.95, 1.05], PBCurrent: [0.95, 1.05], yearCount: [5, 10], stockPrice:[5,10]
}

const calculateScore = (kpiType, kpiVal) => {
  let score = 1
  if (kpiVal > kpiScoreCutOff[kpiType][1]){
      score = 2
  } else if (kpiVal < kpiScoreCutOff[kpiType][0]){
      score = 0
  } else {
      score = 1
  }
  return score
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
    CommonStockSharesIssued:{fy:[2011], fp:["Q4"], start:[0],  end:[0], val:[0]},
    LoadedAPICount:0})
  
  let formattedCompanyData = {
    safeguardsSummary: {indexConstituent: "Yes", publicYearCount: 10, sharePriceCAGR: 5},
    fundamentalsSummary: {revenueCAGR: 5, incomeCAGR: 4, debtByAssetsCAGR:5},
    valuationSummary: {PE:10, PEIdeal:13, PB:2, PBIdeal:2.1},
    kpiScore:{revenueCAGR:0, incomeCAGR:1, debtByAssetsCAGR:1, PECurrent:1, PBCurrent:1,indexConstituent:1, yearCount:1, stockPrice:1},
    scoreSummary:{fundamentals:8, valuation:8, safeguard:10},
    fundamentalsDetails: {revenue: {time:[1,2,3], val:[1000,2000,3000]},
                          income: {time:[1,2,3], val:[100,200,300]},
                          debtByAssets:{time:[1,2,3,4], val:[1.1,1.2,1.3,1.4]}},
    valuationDetails: {PE: {time:[1,2,3], val:[12,13,14]},
                      PEMovingAvg: {time:[1,2,3], val:[11,13,16]},
                      PB: {time:[1,2,3], val:[2.1,2.2,2.3]},
                      PBMovingAvg: {time:[1,2,3], val:[2,2.25,2.5]}
                    },
    allDataLoaded: false
  }
  if (selectedStock.cik !== "-1"){
    // Trigger functions to calculate/format KPI related to financial fundamentals ------- 
    formattedCompanyData.fundamentalsDetails.revenue = formatRevenueOrIncome(companyData.Revenues);
    formattedCompanyData.fundamentalsDetails.income = formatRevenueOrIncome(companyData.NetIncomeLoss);
    formattedCompanyData.fundamentalsDetails.debtByAssets = calculateDebtByAssets(companyData.Assets, companyData.Liabilities);
    formattedCompanyData.fundamentalsSummary.revenueCAGR = calculateCAGR(formattedCompanyData.fundamentalsDetails.revenue);
    formattedCompanyData.fundamentalsSummary.incomeCAGR = calculateCAGR(formattedCompanyData.fundamentalsDetails.income);
    formattedCompanyData.fundamentalsSummary.debtByAssetsCAGR = calculateCAGR(formattedCompanyData.fundamentalsDetails.debtByAssets);
    // Trigger functions to calculate/format KPI related to valuation -------
    [formattedCompanyData.valuationDetails.PE, formattedCompanyData.valuationSummary.PE] = calculatePE(companyData.EarningsPerShareDiluted, companyData.SharePrice);
    formattedCompanyData.valuationDetails.PEMovingAvg = calculatePEMovingAvg(formattedCompanyData.valuationDetails.PE)
    formattedCompanyData.valuationSummary.PEIdeal = formattedCompanyData.valuationDetails.PEMovingAvg.val[(formattedCompanyData.valuationDetails.PEMovingAvg.val.length -1)].toFixed(1);
    [formattedCompanyData.valuationDetails.PB, formattedCompanyData.valuationSummary.PB] = calculatePB(companyData.Assets, companyData.Liabilities, companyData.CommonStockSharesIssued, companyData.SharePrice);
    formattedCompanyData.valuationDetails.PBMovingAvg = calculatePBMovingAvg(formattedCompanyData.valuationDetails.PB)
    if (formattedCompanyData.valuationDetails.PBMovingAvg.val.length>0.5){
    formattedCompanyData.valuationSummary.PBIdeal = formattedCompanyData.valuationDetails.PBMovingAvg.val[(formattedCompanyData.valuationDetails.PBMovingAvg.val.length -1)].toFixed(1);}
    // Trigger functions to calculate/format KPI related to safeguard factors -------
    (sAndP500List.findIndex((tickerItem) => (tickerItem === selectedStock.ticker)) === -1)? (formattedCompanyData.safeguardsSummary.indexConstituent = "No") : (formattedCompanyData.safeguardsSummary.indexConstituent = "Yes")
    formattedCompanyData.safeguardsSummary.publicYearCount = calculatePublicYearCount(companyData.Revenues.end, companyData.NetIncomeLoss.end, companyData.SharePrice.time)    
    formattedCompanyData.safeguardsSummary.sharePriceCAGR = calculateCAGR(companyData.SharePrice)
    // Calculate score for all KPI - To be used for coloring purpose ----------------    
    formattedCompanyData.kpiScore.revenueCAGR = calculateScore("revenueCAGR", formattedCompanyData.fundamentalsSummary.revenueCAGR);
    formattedCompanyData.kpiScore.incomeCAGR = calculateScore("incomeCAGR", formattedCompanyData.fundamentalsSummary.incomeCAGR);
    formattedCompanyData.kpiScore.debtByAssetsCAGR = 2 - calculateScore("debtByAssetsCAGR", formattedCompanyData.fundamentalsSummary.debtByAssetsCAGR)
    formattedCompanyData.kpiScore.PECurrent = calculateScore("PECurrent", (formattedCompanyData.valuationSummary.PEIdeal/formattedCompanyData.valuationSummary.PE))
    formattedCompanyData.kpiScore.PBCurrent = calculateScore("PBCurrent", (formattedCompanyData.valuationSummary.PBIdeal/formattedCompanyData.valuationSummary.PB))
    formattedCompanyData.kpiScore.yearCount = calculateScore("yearCount", formattedCompanyData.safeguardsSummary.publicYearCount)
    formattedCompanyData.kpiScore.stockPrice = calculateScore("stockPrice", formattedCompanyData.safeguardsSummary.sharePriceCAGR)
    if (formattedCompanyData.safeguardsSummary.indexConstituent === "Yes"){
      formattedCompanyData.kpiScore.indexConstituent = 2
    } else {
      formattedCompanyData.kpiScore.indexConstituent = 0
    }
    (companyData.LoadedAPICount > 7) ? (formattedCompanyData.allDataLoaded = true) : (formattedCompanyData.allDataLoaded = false)
    
    // Calculate overall score in 3 key categories
    const fundamentalsScore = (formattedCompanyData.kpiScore.revenueCAGR + formattedCompanyData.kpiScore.incomeCAGR + formattedCompanyData.kpiScore.debtByAssetsCAGR)*(10/6)
    const valuationScore = (formattedCompanyData.kpiScore.PECurrent + formattedCompanyData.kpiScore.PBCurrent)*(10/4)
    const safeguardsScore = (formattedCompanyData.kpiScore.indexConstituent + formattedCompanyData.kpiScore.yearCount + formattedCompanyData.kpiScore.stockPrice)*(10/6)
    formattedCompanyData.scoreSummary = {fundamentals:fundamentalsScore, valuation: valuationScore, safeguard:safeguardsScore}

  }
  
  // Create Object variables in a format that contains just relevant information to be passed to each page
  const companyFundamentals={summary:formattedCompanyData.fundamentalsSummary, details:formattedCompanyData.fundamentalsDetails, allDataLoaded: formattedCompanyData.allDataLoaded}
  const companyValuation = {summary:formattedCompanyData.valuationSummary, 
    details:formattedCompanyData.valuationDetails, allDataLoaded: formattedCompanyData.allDataLoaded}
  const companySummary={
    safeguardsSummary: formattedCompanyData.safeguardsSummary,
    fundamentalsSummary:formattedCompanyData.fundamentalsSummary, 
    valuationSummary:formattedCompanyData.valuationSummary, 
    scoreSummary:formattedCompanyData.scoreSummary,
    allDataLoaded: formattedCompanyData.allDataLoaded}

  return ( 
    <>
      <h1 className='ms-auto text-center bg-dark text-white p-3'>SalaryMan's Stock Analyzer!</h1>      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout/>}>
            <Route index element={<HomePage/>}/>
            <Route path="/StockAnalyzer" element={<StockAnalyzerLayout 
            companyData={companyData} setCompanyData={setCompanyData} 
            selectedStock={selectedStock} setSelectedStock={setSelectedStock} />}>

              <Route path="/StockAnalyzer/Summary" element={<StockAnalyzerSummary 
              companySharePrice={companyData.SharePrice} kpiScore={formattedCompanyData.kpiScore} companySummary={companySummary}/>}/>

              <Route path="/StockAnalyzer/Fundamentals" element={<StockAnalyzerFundamentals 
              kpiScore={formattedCompanyData.kpiScore} companyFundamentals={companyFundamentals}/>}/>
              
              <Route path="/StockAnalyzer/Valuation" element={<StockAnalyzerValuation 
              kpiScore={formattedCompanyData.kpiScore} companyValuation={companyValuation}/>}/>
            </Route>
            <Route path="/Recommendations" element={<Recommendations/>}/>
          </Route>
        </Routes>      
      </BrowserRouter>
    </>
  )
}

export default App
