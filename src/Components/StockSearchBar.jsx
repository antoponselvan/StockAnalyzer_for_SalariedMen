import { useState, useEffect, useRef } from "react";
import sAndP500List from "../S&P500list";

const companyParaList = [{ParaName: "Revenues", Units:"USD"}, {ParaName: "NetIncomeLoss", Units:"USD"}, {ParaName: "Assets", Units:"USD"}, {ParaName: "Liabilities", Units:"USD"}, {ParaName: "StockholdersEquity", Units:"USD"}, {ParaName: "EarningsPerShareDiluted", Units:"USD/shares"}, {ParaName: "CommonStockSharesIssued", Units:"shares"}];
// "LiabilitiesAndStockholdersEquity", "StockholdersEquity", "SalesRevenueGoodsNet", "SalesRevenueServicesNet", "EarningsPerShareBasicAndDiluted"

const StockSearchBar = ({selectedStock, setSelectedStock, setCompanyData, companyData}) => {

  const [stockSearchText, setStockSearchText] = useState("");
  const [stockSearchResults, setStockSearchResults] = useState([{Name:"", CIK:"0"}])  
  const [companyList, setcompanyList] = useState([{title:"", ticker:"" ,CIK:"0000320193"}]) 
  const [stockSearchTextBoxFocus, setStockSearchTextBoxFocus] = useState(false);
  
  const inputRef = useRef();

// Load list of stocks -----------------------------------------------------
    
    useEffect(()=>{       
        fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://www.sec.gov/files/company_tickers.json')}`)
        .then(response => {
            if (response.ok) return response.json()
            throw new Error('Network response was not ok.')
        })
        .then(data => {
            setcompanyList(Object.values(JSON.parse(data.contents)))
            //cik_str, ticker, title
        })

    },[])

// Load basic financial data of stock selected ----------------------------------------------------
    useEffect(()=>{
        if (selectedStock.cik !== "-1"){
            for (let para of companyParaList){
                fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://data.sec.gov/api/xbrl/companyconcept/CIK'+String(selectedStock.cik)+'/us-gaap/'+(para.ParaName)+'.json')}`)
                .then(response => {
                    if (response.ok) return response.json()
                    throw new Error('Network response was not ok.')
                })
                .then(data => {
                    let tempdata = {fy:[], fp:[], start:[], end:[], val:[]};
                    let tempParaData = (JSON.parse(data.contents)).units[para.Units]
                    tempParaData.forEach(element => {
                        tempdata.start.push(element.start)
                        tempdata.end.push(element.end)
                        tempdata.val.push(element.val)
                        tempdata.fy.push(element.fy)
                        tempdata.fp.push(element.fp)
                    });
                    setCompanyData((companyData)=> {return {...companyData, [para.ParaName]:tempdata}})                    
                })
            }
            fetch('https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol='+(selectedStock.ticker)+'&apikey=TFCI3JPMM2ST2IA2')
            .then(res => res.json())
            .then(data=>{
                let tempData = (data["Monthly Adjusted Time Series"])
                let tempTimeStamps = Object.keys(tempData)
                let tempStockVal = tempTimeStamps.map((timestamp)=>{
                    // return ((Number(tempData[timestamp]["1. open"]) + Number(tempData[timestamp]["2. high"]) + Number(tempData[timestamp]["3. low"])+ Number(tempData[timestamp]["4. close"]))/4)
                    return (Number(tempData[timestamp]["5. adjusted close"]))
                })
                let tempStockValRaw = tempTimeStamps.map((timestamp)=>{
                    return (Number(tempData[timestamp]["4. close"]))
                })
                setCompanyData((companyData)=>{
                    return {...companyData, SharePrice:{time: tempTimeStamps, val: tempStockVal, valRaw: tempStockValRaw} }
                })
            })
        }        
        // (sAndP500List.findIndex((tickerItem) => (tickerItem === selectedStock.ticker)) === -1)? setCalculatedCompanyData({...calculatedCompanyData, safeguardsSummary:{...calculatedCompanyData.safeguardsSummary, indexConstituent: "No"}}) : setCalculatedCompanyData({...calculatedCompanyData, safeguardsSummary:{...calculatedCompanyData.safeguardsSummary, indexConstituent: "Yes"}})
        inputRef.current.value = selectedStock.title        
    }, [selectedStock])


// Calculate Revenue in a format suitable for graph --------------------------------------------------
    // useEffect(()=>{
    //     if (selectedStock.cik !== "-1"){
    //         setCalculatedCompanyData((calculatedCompanyData)=>{
    //             let companyRevenueFiltered = {timeStamp:[], val:[]};
    //             for (let index=0; index<companyData.Revenues.end.length; index++){
    //                 let normalizedRevenue = companyData.Revenues.val[index]*(90*24*3600*1000)/(Date.parse(companyData.Revenues.end[index])-Date.parse(companyData.Revenues.start[index]))
    //                 companyRevenueFiltered.timeStamp.push(companyData.Revenues.end[index])
    //                 companyRevenueFiltered.val.push(normalizedRevenue)   
    //             }
    //             return {...calculatedCompanyData, fundamentalsDetails:{...calculatedCompanyData.fundamentalsDetails, revenue: {time:companyRevenueFiltered.timeStamp, val:companyRevenueFiltered.val}}}
    //             })
    //         }
    // },[companyData.Revenues])


// Calculate Income in a format suitable for graph --------------------------------------------------
    // useEffect(()=>{
    //     if (selectedStock.cik !== "-1"){
    //         setCalculatedCompanyData((calculatedCompanyData)=>{
    //             let companyIncomeAdjusted = {timeStamp:[], val:[]};
    //             for (let index=0; index<companyData.NetIncomeLoss.end.length; index++){
    //                 let normalizedIncome = companyData.NetIncomeLoss.val[index]*(90*24*3600*1000)/(Date.parse(companyData.NetIncomeLoss.end[index])-Date.parse(companyData.NetIncomeLoss.start[index]))
    //                 companyIncomeAdjusted.timeStamp.push(companyData.NetIncomeLoss.end[index])
    //                 companyIncomeAdjusted.val.push(normalizedIncome)
    //             }
    //             return {...calculatedCompanyData, fundamentalsDetails:{...calculatedCompanyData.fundamentalsDetails, income: {time:companyIncomeAdjusted.timeStamp, val:companyIncomeAdjusted.val}}}
    //             })
    //         }
    // },[companyData.NetIncomeLoss])

    
// Calculate D/A in a format suitable for graph --------------------------------------------------
    // useEffect(()=>{
    //     setCalculatedCompanyData((calculatedCompanyData)=>{
    //         let companyDebtByEquity = {time:[],val:[]}
    //         for (let index=0; index<companyData.Assets.end.length; index++){
    //             let tempDebtByEquity = 1.3
    //             const debtIndex = companyData.Liabilities.end.findIndex((dateItem)=>{
    //                 return (Math.abs(Date.parse(dateItem) - Date.parse(companyData.Assets.end[index])) < (5*24*3600*1000))
    //             })
    //             if (debtIndex !== -1){
    //                 companyDebtByEquity.time.push(companyData.Assets.end[index])
    //                 let tempAssetItem = companyData.Assets.val[index]
    //                 let tempDebtItem = companyData.Liabilities.val[debtIndex]
    //                 tempDebtByEquity = tempDebtItem/tempAssetItem
    //                 companyDebtByEquity.val.push(tempDebtByEquity)
    //             }                
    //         }
    //         return {...calculatedCompanyData, fundamentalsDetails:{...calculatedCompanyData.fundamentalsDetails , debtByEquity:companyDebtByEquity}}
    //     })
    // },[companyData.Assets, companyData.Liabilities])

// Calculate P/E in a format suitable for graph --------------------------------------------------

// useEffect(()=>{
//     // PE Trend ---
//     let companyPE = {time:[],val:[]}
//     let latestEPSArray = []
//     for (let index=0; index<companyData.EarningsPerShareDiluted.end.length; index++){
//         let tempPE = 23
//         const sharePriceArray = companyData.SharePrice.valRaw.filter((val, index2)=>{
//             let tempTimeDiff = Math.abs((Date.parse(companyData.EarningsPerShareDiluted.end[index]) - Date.parse(companyData.SharePrice.time[index2]))/(24*3600*1000) )
//             return (tempTimeDiff<46)
//         }) 

//         if ((sharePriceArray.length > 0.5)){
//             const sharePriceAvg = sharePriceArray.reduce((prev, num) => prev+num)/sharePriceArray.length
//             const annualizationFactor = (365*24*3600*1000)/(Date.parse(companyData.EarningsPerShareDiluted.end[index])-Date.parse(companyData.EarningsPerShareDiluted.start[index]))
//             const annualEPS = companyData.EarningsPerShareDiluted.val[index]*annualizationFactor
//             tempPE = sharePriceAvg/annualEPS
//             companyPE.time.push(companyData.EarningsPerShareDiluted.end[index])
//             companyPE.val.push(tempPE)

//             if ((Date.now() - Date.parse(companyData.EarningsPerShareDiluted.end[index]))< (2*365*24*3600*1000)){
//                 latestEPSArray.push(annualEPS)
//             }
//         }
//     }
//     const sharePriceTimeStamps = companyData.SharePrice.time.map((dateItem)=>Date.parse(dateItem))
//     const maxSharePriceTimeStampIndex = sharePriceTimeStamps.reduce((iMax, timeStamp, timeStampIndex, arr)=> timeStamp>arr[iMax] ? timeStampIndex : iMax,0)
//     const latestSharePrice = companyData.SharePrice.valRaw[maxSharePriceTimeStampIndex]
//     if ((latestEPSArray.length > 0.5) || ((Date.now()-sharePriceTimeStamps[maxSharePriceTimeStampIndex])<(94*24*3600*1000))) {
//         const latestEPSArrayAvg = latestEPSArray.reduce((prev,current)=>prev+current,0)/latestEPSArray.length
//         const latestPE = (latestSharePrice/latestEPSArrayAvg).toFixed(2)
//         setCalculatedCompanyData((calculatedCompanyData)=>{
//             return {...calculatedCompanyData, valuationSummary: {...calculatedCompanyData.valuationSummary, PE:latestPE}}
//         })
//     } else {
//         setCalculatedCompanyData((calculatedCompanyData)=>{
//             return {...calculatedCompanyData, valuationSummary: {...calculatedCompanyData.valuationSummary, PE:"Inadeqaute Data"}}
//         })
//     }
    
//     setCalculatedCompanyData((calculatedCompanyData)=>{
//         return {...calculatedCompanyData, valuationDetails:{...calculatedCompanyData.valuationDetails , PE:companyPE}}
//     }) 

// },[companyData.EarningsPerShareDiluted, companyData.SharePrice])


// Calculate PE Moving Avg---------------------------------------------
// useEffect(()=>{
//     let companyPEMovingAvg = {time:[],val:[20]}
//     for (let index=0; index<calculatedCompanyData.valuationDetails.PE.time.length; index++){
//         const adjacentPEArray = calculatedCompanyData.valuationDetails.PE.val.filter((val, index2)=>{
//             let tempTimeDiff = (Date.parse(calculatedCompanyData.valuationDetails.PE.time[index]) - Date.parse(calculatedCompanyData.valuationDetails.PE.time[index2]))/(24*3600*1000)
//             return ((tempTimeDiff>0)&(tempTimeDiff<1000))
//         }) 
//         companyPEMovingAvg.time.push(calculatedCompanyData.valuationDetails.PE.time[index])
//         const tempMovingAvg = adjacentPEArray.reduce((prev, element)=> prev+element,0)/adjacentPEArray.length
//         companyPEMovingAvg.val.push(tempMovingAvg)
//     }
//     setCalculatedCompanyData((calculatedCompanyData)=>{
//         return {...calculatedCompanyData, valuationDetails:{...calculatedCompanyData.valuationDetails , PEMovingAvg:companyPEMovingAvg}}
//     })
//     setCalculatedCompanyData((calculatedCompanyData)=>{
//         return {...calculatedCompanyData, valuationSummary:{...calculatedCompanyData.valuationSummary, PEIdeal:(companyPEMovingAvg.val[companyPEMovingAvg.val.length-1]).toFixed(2)}}
//     })
// },[calculatedCompanyData.valuationDetails.PE])


// Calculate P/B in a format suitable for graph --------------------------------------------------
// useEffect(()=>{    
//     let companyPB = {time:[],val:[]}
//     let latestBVArray = []
//     for (let index=0; index<companyData.Assets.end.length; index++){
//         let tempPB = 1.3
//         const sharePriceArray = companyData.SharePrice.valRaw.filter((val, index2)=>{
//             let tempTimeDiff = Math.abs((Date.parse(companyData.Assets.end[index]) - Date.parse(companyData.SharePrice.time[index2]))/(24*3600*1000) )
//             return (tempTimeDiff<50)
//         })
//         const shareCountArray = companyData.CommonStockSharesIssued.val.filter((val, index2)=>{
//             let tempTimeDiff = (Date.parse(companyData.Assets.end[index]) - Date.parse(companyData.CommonStockSharesIssued.end[index2]))/(24*3600*1000)
//             return ((tempTimeDiff<180)&(tempTimeDiff>0))
//         })
//         const liabilitiesArray = companyData.Liabilities.val.filter((val, index2)=>{
//             let tempTimeDiff = Math.abs((Date.parse(companyData.Assets.end[index]) - Date.parse(companyData.Liabilities.end[index2]))/(24*3600*1000) )
//             return (tempTimeDiff<10)
//         })

//         if ((sharePriceArray.length > 0.5)&(shareCountArray.length>0.5)&(liabilitiesArray.length>0.5)){
//             const sharePriceAvg = sharePriceArray.reduce((prev, num) => prev+num)/sharePriceArray.length
//             const shareCountAvg = shareCountArray.reduce((prev, num) => prev+num)/shareCountArray.length
//             const liabilitiesAvg = liabilitiesArray.reduce((prev, num) => prev+num)/liabilitiesArray.length
//             const BV = (companyData.Assets.val[index]-liabilitiesAvg)/shareCountAvg
//             tempPB = sharePriceAvg/BV
//             companyPB.time.push(companyData.Assets.end[index])
//             companyPB.val.push(tempPB)

//             if ((Date.now() - Date.parse(companyData.Assets.end[index]))< (2*365*24*3600*1000)){
//                 latestBVArray.push(BV)
//         }
//     }
    
//     const sharePriceTimeStamps = companyData.SharePrice.time.map((dateItem)=>Date.parse(dateItem))
//     const maxSharePriceTimeStampIndex = sharePriceTimeStamps.reduce((iMax, timeStamp, timeStampIndex, arr)=> timeStamp>arr[iMax] ? timeStampIndex : iMax,0)
//     const latestSharePrice = companyData.SharePrice.valRaw[maxSharePriceTimeStampIndex]
//     if ((latestBVArray.length > 0.5) || ((Date.now()-sharePriceTimeStamps[maxSharePriceTimeStampIndex])<(94*24*3600*1000))) {
//         const latestBVArrayAvg = latestBVArray.reduce((prev,current)=>prev+current,0)/latestBVArray.length
//         const latestPB = (latestSharePrice/latestBVArrayAvg).toFixed(2)
//         setCalculatedCompanyData((calculatedCompanyData)=>{
//             return {...calculatedCompanyData, valuationSummary: {...calculatedCompanyData.valuationSummary, PB:latestPB}}
//         })
//     } else {
//         setCalculatedCompanyData((calculatedCompanyData)=>{
//             return {...calculatedCompanyData, valuationSummary: {...calculatedCompanyData.valuationSummary, PB:"Inadeqaute Data"}}
//         })
//     }

//     setCalculatedCompanyData((calculatedCompanyData)=>{
//         return {...calculatedCompanyData, valuationDetails:{...calculatedCompanyData.valuationDetails , PB:companyPB}}
//     })}
// },[companyData.Assets, companyData.Liabilities, companyData.CommonStockSharesIssued, companyData.SharePrice])

// Calculate PB Moving Avg---------------------------------------------
// useEffect(()=>{    
//     let companyPBMovingAvg = {time:[],val:[2]}
//     for (let index=0; index<calculatedCompanyData.valuationDetails.PB.time.length; index++){
//         const adjacentPBArray = calculatedCompanyData.valuationDetails.PB.val.filter((val, index2)=>{
//             let tempTimeDiff = (Date.parse(calculatedCompanyData.valuationDetails.PB.time[index]) - Date.parse(calculatedCompanyData.valuationDetails.PB.time[index2]))/(24*3600*1000)
//             return ((tempTimeDiff>0)&(tempTimeDiff<1000))
//         }) 
//         companyPBMovingAvg.time.push(calculatedCompanyData.valuationDetails.PB.time[index])
//         const tempMovingAvg = adjacentPBArray.reduce((prev, element)=> prev+element,0)/adjacentPBArray.length
//         companyPBMovingAvg.val.push(tempMovingAvg)
//     }
//     setCalculatedCompanyData((calculatedCompanyData)=>{
//         return {...calculatedCompanyData, valuationDetails:{...calculatedCompanyData.valuationDetails , PBMovingAvg:companyPBMovingAvg}}
//     })
//     setCalculatedCompanyData((calculatedCompanyData)=>{
//         return {...calculatedCompanyData, valuationSummary:{...calculatedCompanyData.valuationSummary, PBIdeal:(companyPBMovingAvg.val[companyPBMovingAvg.val.length-1]).toFixed(2)}}
//     })
// },[calculatedCompanyData.valuationDetails.PB])

// Calculate Year since company public data is available ----------------------------
// useEffect(()=>{
//     const earliestRevenueDate = Math.min(...(companyData.Revenues.end.map((dateItem)=>Date.parse(dateItem))))
//     const earliestIncomeDate = Math.min(...(companyData.NetIncomeLoss.end.map((dateItem)=>Date.parse(dateItem))))
//     const earliestSharePrice = Math.min(...(companyData.SharePrice.time.map((dateItem)=>Date.parse(dateItem))))
//     const yearsSincePublic = ((Date.now()-(Math.min(earliestRevenueDate, earliestIncomeDate, earliestSharePrice)))/(365*24*3600*1000)).toFixed(1)
//     setCalculatedCompanyData((calculatedCompanyData)=>{ return {...calculatedCompanyData, safeguardsSummary:{...calculatedCompanyData.safeguardsSummary, publicYearCount: yearsSincePublic}}})
// }, [companyData])


// Calculate CAGR ------------------------------------------------------------------
// const calculateCAGR = (timeStamps, data) => {
//     const dataUnixTime = timeStamps.map((dateItem)=>Date.parse(dateItem))
//     const startTime = Math.min(...dataUnixTime)
//     const endTime = Math.max(...dataUnixTime)
//     if ((endTime-startTime)<(4*365*24*3600*1000)){
//         return "Inadequate Data"
//     } else {
//         const dataInitial = data.filter((val, index)=>(Date.parse(timeStamps[index])<(startTime+(2*365*24*3600*1000))))
//         const dataInitialAvg = dataInitial.reduce((prev, current)=>(prev+current),0)/dataInitial.length
//         const dataFinal = data.filter((val, index)=>(Date.parse(timeStamps[index])>(endTime)-(2*365*24*3600*1000)))
//         const dataFinalAvg = dataFinal.reduce((prev, current)=>(prev+current),0)/dataFinal.length
//         const timePeriodYrs = (endTime-startTime)/(365*24*3600*1000) - 2
//         const CAGR = ((((dataFinalAvg/dataInitialAvg)**(1/timePeriodYrs))-1)*100).toFixed(1)
//         return CAGR
//     }
// }

// // Revenue CAGR 
// useEffect(()=>{
//     const CAGR = calculateCAGR(calculatedCompanyData.fundamentalsDetails.revenue.time, calculatedCompanyData.fundamentalsDetails.revenue.val)
//     setCalculatedCompanyData((calculatedCompanyData)=> {return {...calculatedCompanyData, fundamentalsSummary: {...calculatedCompanyData.fundamentalsSummary, revenueCAGR: CAGR}}})
//     }
// ,[calculatedCompanyData.fundamentalsDetails.revenue])

// // Income CAGR
// useEffect(()=>{
//     const CAGR = calculateCAGR(calculatedCompanyData.fundamentalsDetails.income.time, calculatedCompanyData.fundamentalsDetails.income.val)
//     setCalculatedCompanyData((calculatedCompanyData)=> {return {...calculatedCompanyData, fundamentalsSummary: {...calculatedCompanyData.fundamentalsSummary, incomeCAGR: CAGR}}})
//     }
// ,[calculatedCompanyData.fundamentalsDetails.income])

// // DebtByAssets CAGR
// useEffect(()=>{
//     const CAGR = calculateCAGR(calculatedCompanyData.fundamentalsDetails.debtByEquity.time, calculatedCompanyData.fundamentalsDetails.debtByEquity.val)
//     setCalculatedCompanyData((calculatedCompanyData)=> {return {...calculatedCompanyData, fundamentalsSummary: {...calculatedCompanyData.fundamentalsSummary, debtByEquityCAGR: CAGR}}})
//     }
// ,[calculatedCompanyData.fundamentalsDetails.debtByEquity])

// // Share Price CAGR
// useEffect(()=>{
//     const CAGR = calculateCAGR(companyData.SharePrice.time, companyData.SharePrice.val)
//     setCalculatedCompanyData((calculatedCompanyData)=> {return {...calculatedCompanyData, safeguardsSummary: {...calculatedCompanyData.safeguardsSummary, sharePriceCAGR: CAGR}}})
//     }
// ,[companyData.SharePrice])


// Calculate KPI Score ----------------------------------------------------------------------
// const kpiScoreCutOff = {
//     revenueCAGR: [0,5], incomeCAGR:[0,5], debtByEquityCAGR:[0, 5], PECurrent: [0.95, 1.05], PBCurrent: [0.95, 1.05], yearCount: [5, 10], stockPrice:[5,10]
// }

// const calculateScore = (kpiType, kpiVal) => {
//     let score = 1
//     if (kpiVal > kpiScoreCutOff[kpiType][1]){
//         score = 2
//     } else if (kpiVal < kpiScoreCutOff[kpiType][0]){
//         score = 0
//     } else {
//         score = 1
//     }
//     return score
// }

// useEffect(()=>{
//     const score = calculateScore("revenueCAGR", calculatedCompanyData.fundamentalsSummary.revenueCAGR)
//     setKpiScore((kpiScore)=> {return {...kpiScore, revenueCAGR:score}})
// }, [calculatedCompanyData.fundamentalsSummary.revenueCAGR])

// useEffect(()=>{
//     const score = calculateScore("incomeCAGR", calculatedCompanyData.fundamentalsSummary.incomeCAGR)
//     setKpiScore((kpiScore)=> {return {...kpiScore, incomeCAGR:score}})
// }, [calculatedCompanyData.fundamentalsSummary.incomeCAGR])

// useEffect(()=>{
//     const score = 2 - calculateScore("debtByEquityCAGR", calculatedCompanyData.fundamentalsSummary.debtByEquityCAGR)
//     setKpiScore((kpiScore)=> {return {...kpiScore, debtByEquityCAGR:score}})
// }, [calculatedCompanyData.fundamentalsSummary.debtByEquityCAGR])


// useEffect(()=>{
//     const score = calculateScore("PECurrent", (calculatedCompanyData.valuationSummary.PEIdeal/calculatedCompanyData.valuationSummary.PE))
//     setKpiScore((kpiScore)=> {return {...kpiScore, PECurrent:score}})
// }, [calculatedCompanyData.valuationSummary.PE, calculatedCompanyData.valuationSummary.PEIdeal])


// useEffect(()=>{
//     const score = calculateScore("PBCurrent", (calculatedCompanyData.valuationSummary.PBIdeal/calculatedCompanyData.valuationSummary.PB))
//     setKpiScore((kpiScore)=> {return {...kpiScore, PBCurrent:score}})
// }, [calculatedCompanyData.valuationSummary.PB, calculatedCompanyData.valuationSummary.PBIdeal])


// useEffect(()=>{
//     if (calculatedCompanyData.safeguardsSummary.indexConstituent === "Yes"){
//         setKpiScore((kpiScore)=> {return {...kpiScore, indexConstituent:2}})
//     } else {
//         setKpiScore((kpiScore)=> {return {...kpiScore, indexConstituent:0}})
//     }
// }, [calculatedCompanyData.safeguardsSummary.sharePriceCAGR])

// useEffect(()=>{
//     const score = calculateScore("yearCount", calculatedCompanyData.safeguardsSummary.publicYearCount)
//     setKpiScore((kpiScore)=> {return {...kpiScore, yearCount:score}})
// }, [calculatedCompanyData.safeguardsSummary.publicYearCount])

// useEffect(()=>{
//     const score = calculateScore("stockPrice", calculatedCompanyData.safeguardsSummary.sharePriceCAGR)
//     setKpiScore((kpiScore)=> {return {...kpiScore, stockPrice:score}})
// }, [calculatedCompanyData.safeguardsSummary.sharePriceCAGR])

// useEffect(()=>{
//     const fundamentalsScore = (kpiScore.revenueCAGR + kpiScore.incomeCAGR + kpiScore.debtByEquityCAGR)*(10/6)
//     const valuationScore = (kpiScore.PECurrent + kpiScore.PBCurrent)*(10/4)
//     const safeguardsScore = (kpiScore.indexConstituent + kpiScore.yearCount + kpiScore.stockPrice)*(10/6)
//     setCalculatedCompanyData((calculatedCompanyData)=> {return {...calculatedCompanyData, scoreSummary:{fundamentals:fundamentalsScore, valuation: valuationScore, safeguard:safeguardsScore}}})
// },[kpiScore])


// Event Handlers ---------------------------------------------------------------------------------- 
// TxtBox change triggers search of stock (ticker code or company name) matching input
    const handleChange = (event) => {
    setStockSearchText((stockSearchText)=>event.target.value);    
    }
    useEffect(()=>{
        setStockSearchResults(companyList.filter((company)=>{
            return ((company.title.toLowerCase().search(stockSearchText.toLowerCase()) !== -1) || (company.ticker.toLowerCase().search(stockSearchText.toLowerCase()) !== -1))
        }))
    },[stockSearchText])
// Click triggers fetch and all calc of company data
    const handleListClick=({cik, ticker, title})=>{
        const cikAddendum = ["000000000","00000000","0000000","000000","00000","0000","000","00","0"]
        const cikStr = cikAddendum[Math.floor(Math.log10(cik))] + String(cik)
        return () => {
            setStockSearchTextBoxFocus(false)
            setSelectedStock({cik:cikStr, ticker, title})}
    }

    const handleInputBoxFocus = () => {
        setStockSearchTextBoxFocus(true)
    }
    const handleInputBoxBlur = () => {
        if ((stockSearchResults.length < 0.5) || (stockSearchText === ""))  {
        setStockSearchTextBoxFocus(false)
        }
    }


// Final Component return to HTML -----------------------------------------------------------------
    return (
    <div className="mb-3 d-flex">  
        <div className="dropdown">
            <button className="dropdown-toggle btn" data-bs-toggle="dropdown">
            <i className="bi bi-search lg m-3"></i>
            </button>
            <ul className={"dropdown-menu"+ ((stockSearchTextBoxFocus) ? " d-block" : "")}>
                {
                    stockSearchResults.map((company, index)=> ((index < 20) && (<li key={index} onClick={handleListClick({cik: company.cik_str, ticker:company.ticker, title:company.title})}><button className="dropdown-item" type="button">{company.ticker} : {company.title}</button></li>)))
                }
            </ul>
        </div>             
        <input onChange={handleChange} onFocus={handleInputBoxFocus} onBlur={handleInputBoxBlur} ref={inputRef} className="form-control" placeholder="Search Stock"/>                
    </div>
    )
    }

export default StockSearchBar