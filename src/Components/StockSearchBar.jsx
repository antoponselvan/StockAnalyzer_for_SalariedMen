import { useState, useEffect, useRef } from "react";
// import getHistoricalPrices from 'yahoo-stock-api'
// import {getHistoricalPrices} from 'yahoo-stock-api'
// import yahooStockAPI from 'yahoo-stock-api'

const companyParaList = [{ParaName: "Revenues", Units:"USD"}, {ParaName: "NetIncomeLoss", Units:"USD"}, {ParaName: "Assets", Units:"USD"}, {ParaName: "Liabilities", Units:"USD"}, {ParaName: "StockholdersEquity", Units:"USD"}, {ParaName: "EarningsPerShareDiluted", Units:"USD/shares"}, {ParaName: "CommonStockSharesIssued", Units:"shares"}];
// "LiabilitiesAndStockholdersEquity", "StockholdersEquity", "SalesRevenueGoodsNet", "SalesRevenueServicesNet", "EarningsPerShareBasicAndDiluted"

const StockSearchBar = ({selectedStock, setSelectedStock, setCompanyData, companyData, calculatedCompanyData, setCalculatedCompanyData}) => {

  let stockSearchText = "";
  const [stockSearchResults, setStockSearchResults] = useState([{Name:"", CIK:"0"}])  
  const [companyList, setcompanyList] = useState([{name:"", CIK:"0000320193"}]) 
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
                console.log("timeDiff", tempTimeDiff)
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
                console.log("timeDiff", tempTimeDiff)
                return ((tempTimeDiff>0)&(tempTimeDiff<1000))
            }) 
            companyPBMovingAvg.time.push(calculatedCompanyData.valuationDetails.PB.time[index])
            const tempMovingAvg = adjacentPBArray.reduce((prev, element)=> prev+element,0)/adjacentPBArray.length
            companyPBMovingAvg.val.push(tempMovingAvg)
        }
        return {...calculatedCompanyData, valuationDetails:{...calculatedCompanyData.valuationDetails , PBMovingAvg:companyPBMovingAvg}}
    })
},[calculatedCompanyData.valuationDetails.PB])

// Event Handlers ---------------------------------------------------------------------------------- 
// TxtBox change triggers search of stock (ticker code or company name) matching input
    const handleChange = (event) => {
    stockSearchText = (event.target.value);
    setStockSearchResults(companyList.filter((company)=>{
        return ((company.title.toLowerCase().search(stockSearchText.toLowerCase()) !== -1) || (company.ticker.toLowerCase().search(stockSearchText.toLowerCase()) !== -1))
    }))
    }
// Click triggers fetch and all calc of company data
    const handleListClick=({cik, ticker, title})=>{
        const cikAddendum = ["000000000","00000000","0000000","000000","00000","0000","000","00","0"]
        const cikStr = cikAddendum[Math.floor(Math.log10(cik))] + String(cik)
        return () => {setSelectedStock({cik:cikStr, ticker, title})}
    }

// Final Component return to HTML -----------------------------------------------------------------
    return (
    <div className="mb-3 d-flex">  
        <div className="dropdown">
            <button className="dropdown-toggle btn" data-bs-toggle="dropdown">
            <i className="bi bi-search lg m-3"></i>
            </button>
            <ul className="dropdown-menu">
                {
                    stockSearchResults.map((company, index)=> (<li key={index} onClick={handleListClick({cik: company.cik_str, ticker:company.ticker, title:company.title})}><button className="dropdown-item" type="button">{company.ticker} : {company.title}</button></li>))
                }
            </ul>
        </div>             
        <input onChange={handleChange} ref={inputRef} className="form-control" placeholder="Search Stock"/>                
    </div>
    )
    }

export default StockSearchBar