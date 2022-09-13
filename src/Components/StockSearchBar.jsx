import { useState, useEffect, useRef } from "react";
import sAndP500List from "../S&P500list";
// import getHistoricalPrices from 'yahoo-stock-api'
// import {getHistoricalPrices} from 'yahoo-stock-api'
// import yahooStockAPI from 'yahoo-stock-api'

const companyParaList = [{ParaName: "Revenues", Units:"USD"}, {ParaName: "NetIncomeLoss", Units:"USD"}, {ParaName: "Assets", Units:"USD"}, {ParaName: "Liabilities", Units:"USD"}, {ParaName: "StockholdersEquity", Units:"USD"}, {ParaName: "EarningsPerShareDiluted", Units:"USD/shares"}, {ParaName: "CommonStockSharesIssued", Units:"shares"}];
// "LiabilitiesAndStockholdersEquity", "StockholdersEquity", "SalesRevenueGoodsNet", "SalesRevenueServicesNet", "EarningsPerShareBasicAndDiluted"

const StockSearchBar = ({selectedStock, setSelectedStock, setCompanyData, companyData, calculatedCompanyData, setCalculatedCompanyData}) => {

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
        (sAndP500List.findIndex((tickerItem) => (tickerItem === selectedStock.ticker)) === -1)? setCalculatedCompanyData({...calculatedCompanyData, safeguardsSummary:{...calculatedCompanyData.safeguardsSummary, indexConstituent: "No"}}) : setCalculatedCompanyData({...calculatedCompanyData, safeguardsSummary:{...calculatedCompanyData.safeguardsSummary, indexConstituent: "Yes"}})
        inputRef.current.value = selectedStock.title        
    }, [selectedStock])


// Calculate Revenue in a format suitable for graph --------------------------------------------------
    useEffect(()=>{
        if (selectedStock.cik !== "-1"){
            setCalculatedCompanyData((calculatedCompanyData)=>{
                let companyRevenueFiltered = {timeStamp:[], val:[]};
                for (let index=0; index<companyData.Revenues.end.length; index++){
                    let normalizedRevenue = companyData.Revenues.val[index]*(90*24*3600*1000)/(Date.parse(companyData.Revenues.end[index])-Date.parse(companyData.Revenues.start[index]))
                    companyRevenueFiltered.timeStamp.push(companyData.Revenues.end[index])
                    companyRevenueFiltered.val.push(normalizedRevenue)   
                }
                return {...calculatedCompanyData, fundamentalsDetails:{...calculatedCompanyData.fundamentalsDetails, revenue: {time:companyRevenueFiltered.timeStamp, val:companyRevenueFiltered.val}}}
                })
            }
    },[companyData.Revenues])


// Calculate Income in a format suitable for graph --------------------------------------------------
    useEffect(()=>{
        if (selectedStock.cik !== "-1"){
            setCalculatedCompanyData((calculatedCompanyData)=>{
                // return {...calculatedCompanyData, fundamentalsDetails:{...calculatedCompanyData.fundamentalsDetails, income: {time:companyData.NetIncomeLoss.end.map((timeStamp)=>Date.parse(timeStamp)), val:companyData.NetIncomeLoss.val}}}
                let companyIncomeAdjusted = {timeStamp:[], val:[]};
                for (let index=0; index<companyData.NetIncomeLoss.end.length; index++){
                    let normalizedIncome = companyData.NetIncomeLoss.val[index]*(90*24*3600*1000)/(Date.parse(companyData.NetIncomeLoss.end[index])-Date.parse(companyData.NetIncomeLoss.start[index]))
                    companyIncomeAdjusted.timeStamp.push(companyData.NetIncomeLoss.end[index])
                    companyIncomeAdjusted.val.push(normalizedIncome)
                }
                return {...calculatedCompanyData, fundamentalsDetails:{...calculatedCompanyData.fundamentalsDetails, income: {time:companyIncomeAdjusted.timeStamp, val:companyIncomeAdjusted.val}}}
                })
            }
    },[companyData.NetIncomeLoss])

    
// Calculate D/E in a format suitable for graph --------------------------------------------------
    useEffect(()=>{
        setCalculatedCompanyData((calculatedCompanyData)=>{
            let companyDebtByEquity = {time:[],val:[]}
            for (let index=0; index<companyData.Assets.end.length; index++){
                let tempDebtByEquity = 1.3
                const debtIndex = companyData.Liabilities.end.findIndex((dateItem)=>{
                    return (Math.abs(Date.parse(dateItem) - Date.parse(companyData.Assets.end[index])) < (5*24*3600*1000))
                })
                if (debtIndex !== -1){
                    companyDebtByEquity.time.push(companyData.Assets.end[index])
                    let tempAssetItem = companyData.Assets.val[index]
                    let tempDebtItem = companyData.Liabilities.val[debtIndex]
                    // tempDebtByEquity = tempDebtItem/(Math.min((tempAssetItem-tempDebtItem),1))
                    tempDebtByEquity = tempDebtItem/tempAssetItem
                    companyDebtByEquity.val.push(tempDebtByEquity)
                }                
            }
            return {...calculatedCompanyData, fundamentalsDetails:{...calculatedCompanyData.fundamentalsDetails , debtByEquity:companyDebtByEquity}}
        })
    },[companyData.Assets, companyData.Liabilities])

// Calculate P/E in a format suitable for graph --------------------------------------------------

// useEffect(()=>{
//     setCalculatedCompanyData((calculatedCompanyData)=>{
//         let companyPE = {time:[],val:[]}
//         for (let index=0; index<calculatedCompanyData.fundamentalsDetails.income.time.length; index++){
//             let tempPE = 23
//             const sharePriceArray = companyData.SharePrice.val.filter((val, index2)=>{
//                 let tempTimeDiff = Math.abs((Date.parse(calculatedCompanyData.fundamentalsDetails.income.time[index]) - Date.parse(companyData.SharePrice.time[index2]))/(24*3600*1000) )
//                 return (tempTimeDiff<50)
//             })
//             const shareCountArray = companyData.CommonStockSharesIssued.val.filter((val, index2)=>{
//                 let tempTimeDiff = Math.abs((Date.parse(calculatedCompanyData.fundamentalsDetails.income.time[index]) - Date.parse(companyData.CommonStockSharesIssued.end[index2]))/(24*3600*1000) )
//                 return (tempTimeDiff<50)
//             })            

//             if ((sharePriceArray.length > 0.5)&(shareCountArray.length>0.5)){
//                 const sharePriceAvg = sharePriceArray.reduce((prev, num) => prev+num)/sharePriceArray.length
//                 const shareCountAvg = shareCountArray.reduce((prev, num) => prev+num)/shareCountArray.length
//                 const EPS = calculatedCompanyData.fundamentalsDetails.income.val[index]/shareCountAvg
//                 tempPE = sharePriceAvg/EPS
//                 companyPE.time.push(calculatedCompanyData.fundamentalsDetails.income.time[index])
//                 companyPE.val.push(tempPE)
//             }
//         }
//         return {...calculatedCompanyData, valuationDetails:{...calculatedCompanyData.valuationDetails , PE:companyPE}}
//     })
// },[calculatedCompanyData.fundamentalsDetails.income])


useEffect(()=>{
    setCalculatedCompanyData((calculatedCompanyData)=>{
        let companyPE = {time:[],val:[]}
        for (let index=0; index<companyData.EarningsPerShareDiluted.end.length; index++){
            let tempPE = 23
            const sharePriceArray = companyData.SharePrice.valRaw.filter((val, index2)=>{
                let tempTimeDiff = Math.abs((Date.parse(companyData.EarningsPerShareDiluted.end[index]) - Date.parse(companyData.SharePrice.time[index2]))/(24*3600*1000) )
                return (tempTimeDiff<46)
            }) 

            if ((sharePriceArray.length > 0.5)){
                const sharePriceAvg = sharePriceArray.reduce((prev, num) => prev+num)/sharePriceArray.length
                // const shareCountAvg = shareCountArray.reduce((prev, num) => prev+num)/shareCountArray.length
                const annualizationFactor = (365*24*3600*1000)/(Date.parse(companyData.EarningsPerShareDiluted.end[index])-Date.parse(companyData.EarningsPerShareDiluted.start[index]))
                const annualEPS = companyData.EarningsPerShareDiluted.val[index]*annualizationFactor
                tempPE = sharePriceAvg/annualEPS
                companyPE.time.push(companyData.EarningsPerShareDiluted.end[index])
                companyPE.val.push(tempPE)
            }
        }
        return {...calculatedCompanyData, valuationDetails:{...calculatedCompanyData.valuationDetails , PE:companyPE}}
    })
},[companyData.EarningsPerShareDiluted, companyData.SharePrice])

// Calculate PE Moving Avg---------------------------------------------
useEffect(()=>{
    setCalculatedCompanyData((calculatedCompanyData)=>{
        let companyPEMovingAvg = {time:[],val:[]}
        for (let index=0; index<calculatedCompanyData.valuationDetails.PE.time.length; index++){
            const adjacentPEArray = calculatedCompanyData.valuationDetails.PE.val.filter((val, index2)=>{
                let tempTimeDiff = (Date.parse(calculatedCompanyData.valuationDetails.PE.time[index]) - Date.parse(calculatedCompanyData.valuationDetails.PE.time[index2]))/(24*3600*1000)
                // console.log("timeDiff", tempTimeDiff)
                return ((tempTimeDiff>0)&(tempTimeDiff<1000))
            }) 
            companyPEMovingAvg.time.push(calculatedCompanyData.valuationDetails.PE.time[index])
            const tempMovingAvg = adjacentPEArray.reduce((prev, element)=> prev+element,0)/adjacentPEArray.length
            companyPEMovingAvg.val.push(tempMovingAvg)
        }
        return {...calculatedCompanyData, valuationDetails:{...calculatedCompanyData.valuationDetails , PEMovingAvg:companyPEMovingAvg}}
    })
},[calculatedCompanyData.valuationDetails.PE])


// Calculate P/B in a format suitable for graph --------------------------------------------------

useEffect(()=>{
    setCalculatedCompanyData((calculatedCompanyData)=>{
        let companyPB = {time:[],val:[]}
        for (let index=0; index<companyData.Assets.end.length; index++){
            let tempPB = 1.3
            const sharePriceArray = companyData.SharePrice.valRaw.filter((val, index2)=>{
                let tempTimeDiff = Math.abs((Date.parse(companyData.Assets.end[index]) - Date.parse(companyData.SharePrice.time[index2]))/(24*3600*1000) )
                return (tempTimeDiff<50)
            })
            const shareCountArray = companyData.CommonStockSharesIssued.val.filter((val, index2)=>{
                let tempTimeDiff = (Date.parse(companyData.Assets.end[index]) - Date.parse(companyData.CommonStockSharesIssued.end[index2]))/(24*3600*1000)
                return ((tempTimeDiff<180)&(tempTimeDiff>0))
            })
            const liabilitiesArray = companyData.Liabilities.val.filter((val, index2)=>{
                let tempTimeDiff = Math.abs((Date.parse(companyData.Assets.end[index]) - Date.parse(companyData.Liabilities.end[index2]))/(24*3600*1000) )
                return (tempTimeDiff<10)
            })

            if ((sharePriceArray.length > 0.5)&(shareCountArray.length>0.5)&(liabilitiesArray.length>0.5)){
                const sharePriceAvg = sharePriceArray.reduce((prev, num) => prev+num)/sharePriceArray.length
                const shareCountAvg = shareCountArray.reduce((prev, num) => prev+num)/shareCountArray.length
                const liabilitiesAvg = liabilitiesArray.reduce((prev, num) => prev+num)/liabilitiesArray.length
                const BV = (companyData.Assets.val[index]-liabilitiesAvg)/shareCountAvg
                tempPB = sharePriceAvg/BV
                companyPB.time.push(companyData.Assets.end[index])
                companyPB.val.push(tempPB)
            }
        }
        return {...calculatedCompanyData, valuationDetails:{...calculatedCompanyData.valuationDetails , PB:companyPB}}
    })
},[companyData.Assets, companyData.Liabilities, companyData.CommonStockSharesIssued, companyData.SharePrice])

// Calculate PB Moving Avg---------------------------------------------
useEffect(()=>{
    setCalculatedCompanyData((calculatedCompanyData)=>{
        let companyPBMovingAvg = {time:[],val:[]}
        for (let index=0; index<calculatedCompanyData.valuationDetails.PB.time.length; index++){
            const adjacentPBArray = calculatedCompanyData.valuationDetails.PB.val.filter((val, index2)=>{
                let tempTimeDiff = (Date.parse(calculatedCompanyData.valuationDetails.PB.time[index]) - Date.parse(calculatedCompanyData.valuationDetails.PB.time[index2]))/(24*3600*1000)
                // console.log("timeDiff", tempTimeDiff)
                return ((tempTimeDiff>0)&(tempTimeDiff<1000))
            }) 
            companyPBMovingAvg.time.push(calculatedCompanyData.valuationDetails.PB.time[index])
            const tempMovingAvg = adjacentPBArray.reduce((prev, element)=> prev+element,0)/adjacentPBArray.length
            companyPBMovingAvg.val.push(tempMovingAvg)
        }
        return {...calculatedCompanyData, valuationDetails:{...calculatedCompanyData.valuationDetails , PBMovingAvg:companyPBMovingAvg}}
    })
},[calculatedCompanyData.valuationDetails.PB])

// Calculate Year since company public data is available ----------------------------
useEffect(()=>{
    const earliestRevenueDate = Math.min(...(companyData.Revenues.end.map((dateItem)=>Date.parse(dateItem))))
    const earliestIncomeDate = Math.min(...(companyData.NetIncomeLoss.end.map((dateItem)=>Date.parse(dateItem))))
    // const earliestAssetsDate = Math.min 
    const yearsSincePublic = ((Date.now()-(Math.min(earliestRevenueDate, earliestIncomeDate)))/(365*24*3600*1000)).toFixed(1)
    setCalculatedCompanyData((calculatedCompanyData)=>{ return {...calculatedCompanyData, safeguardsSummary:{...calculatedCompanyData.safeguardsSummary, publicYearCount: yearsSincePublic}}})
}, [companyData])


// Calculate CAGR ------------------------------------------------------------------
const calculateCAGR = (timeStamps, data) => {
    const dataUnixTime = timeStamps.map((dateItem)=>Date.parse(dateItem))
    const startTime = Math.min(...dataUnixTime)
    const endTime = Math.max(...dataUnixTime)
    if ((endTime-startTime)<(4*365*24*3600*1000)){
        return "Inadequate Data"
    } else {
        const dataInitial = data.filter((val, index)=>(Date.parse(timeStamps[index])<(startTime+(2*365*24*3600*1000))))
        const dataInitialAvg = dataInitial.reduce((prev, current)=>(prev+current),0)/dataInitial.length
        const dataFinal = data.filter((val, index)=>(Date.parse(timeStamps[index])>(endTime)-(2*365*24*3600*1000)))
        const dataFinalAvg = dataFinal.reduce((prev, current)=>(prev+current),0)/dataFinal.length
        const timePeriodYrs = (endTime-startTime)/(365*24*3600*1000) - 2
        const CAGR = ((((dataFinalAvg/dataInitialAvg)**(1/timePeriodYrs))-1)*100).toFixed(1)
        console.log(dataInitial, dataFinal,timePeriodYrs)
        return CAGR
    }
}

// Revenue CAGR 
useEffect(()=>{
    const CAGR = calculateCAGR(calculatedCompanyData.fundamentalsDetails.revenue.time, calculatedCompanyData.fundamentalsDetails.revenue.val)
    setCalculatedCompanyData((calculatedCompanyData)=> {return {...calculatedCompanyData, fundamentalsSummary: {...calculatedCompanyData.fundamentalsSummary, revenueCAGR: CAGR}}})
    }
,[calculatedCompanyData.fundamentalsDetails.revenue])

// Income CAGR
useEffect(()=>{
    const CAGR = calculateCAGR(calculatedCompanyData.fundamentalsDetails.income.time, calculatedCompanyData.fundamentalsDetails.income.val)
    setCalculatedCompanyData((calculatedCompanyData)=> {return {...calculatedCompanyData, fundamentalsSummary: {...calculatedCompanyData.fundamentalsSummary, incomeCAGR: CAGR}}})
    }
,[calculatedCompanyData.fundamentalsDetails.income])

// DebtByEquity CAGR
useEffect(()=>{
    const CAGR = calculateCAGR(calculatedCompanyData.fundamentalsDetails.debtByEquity.time, calculatedCompanyData.fundamentalsDetails.debtByEquity.val)
    setCalculatedCompanyData((calculatedCompanyData)=> {return {...calculatedCompanyData, fundamentalsSummary: {...calculatedCompanyData.fundamentalsSummary, debtByEquityCAGR: CAGR}}})
    }
,[calculatedCompanyData.fundamentalsDetails.debtByEquity])

// Share Price CAGR
useEffect(()=>{
    const CAGR = calculateCAGR(companyData.SharePrice.time, companyData.SharePrice.val)
    setCalculatedCompanyData((calculatedCompanyData)=> {return {...calculatedCompanyData, safeguardsSummary: {...calculatedCompanyData.safeguardsSummary, sharePriceCAGR: CAGR}}})
    }
,[companyData.SharePrice])

// useEffect(()=>{
//     const revenueDataUnixTime = calculatedCompanyData.fundamentalsDetails.revenue.time.map((dateItem)=>Date.parse(dateItem))
//     const startTime = Math.min(...revenueDataUnixTime)
//     const endTime = Math.max(...revenueDataUnixTime)
//     console.log(startTime, endTime)
//     console.log(revenueDataUnixTime)
//     if ((endTime - startTime) < (4*365*24*3600*1000)){
//         setCalculatedCompanyData((calculatedCompanyData)=> {return {...calculatedCompanyData, fundamentalsSummary: {...calculatedCompanyData.fundamentalsSummary, revenueCAGR:"Inadequate Data"}}})
//     } else {
//         const revenueInitial = calculatedCompanyData.fundamentalsDetails.revenue.val.filter((val, index)=>(Date.parse(calculatedCompanyData.fundamentalsDetails.revenue.time[index])<(startTime+(2*365*24*3600*1000))))
//         const revenueInitialAvg = revenueInitial.reduce((prev,current)=>(prev+current),0)/revenueInitial.length
//         const revenueFinal = calculatedCompanyData.fundamentalsDetails.revenue.val.filter((val, index)=>(Date.parse(calculatedCompanyData.fundamentalsDetails.revenue.time[index])>(endTime-(2*365*24*3600*1000))))
//         const revenueFinalAvg = revenueFinal.reduce((prev,current)=>(prev+current),0)/revenueFinal.length
//         const timePeriod = ((endTime-startTime)/(365*24*3600*1000))-2
//         // const revenueCAGR = (Math.ceil((((revenueFinalAvg/revenueInitialAvg)**(1/timePeriod))-1)*100))
//         const revenueCAGR = ((((revenueFinalAvg/revenueInitialAvg)**(1/timePeriod))-1)*100).toFixed(1)
//         console.log(revenueInitial, revenueFinal, timePeriod)
//         setCalculatedCompanyData((calculatedCompanyData)=> {return {...calculatedCompanyData, fundamentalsSummary: {...calculatedCompanyData.fundamentalsSummary, revenueCAGR: revenueCAGR}}})
//     }
// },[calculatedCompanyData.fundamentalsDetails.revenue])

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
            // console.log("Clicked")
            setStockSearchTextBoxFocus(false)
            setSelectedStock({cik:cikStr, ticker, title})}
    }

    const handleInputBoxFocus = () => {
        console.log('Focus Event')
        setStockSearchTextBoxFocus(true)
    }
    const handleInputBoxBlur = () => {
        // console.log('Blur Event')
        // settimeout(()=>{setStockSearchTextBoxFocus(false)},100)
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