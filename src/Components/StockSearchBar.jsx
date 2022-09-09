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
  
    //  const yahooStockAPI  = require('yahoo-stock-api');
    // const yahooStockAPI  = import('yahoo-stock-api');
    // console.log("yahoo",yahooStockAPI)
    // async function getStockPrice()  {
    //     const startDate = new Date('08/21/2010');
    //     const endDate = new Date('08/26/2020');
    //     // console.log(await yahooStockAPI.getHistoricalPrices(startDate, endDate, 'AAPL', '1mo'));
// }
  
// Load list of stocks
    
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

    // Load financial data of stock selected
    useEffect(()=>{
        if (selectedStock.cik !== "-1"){
            for (let para of companyParaList){
                fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://data.sec.gov/api/xbrl/companyconcept/CIK'+String(selectedStock.cik)+'/us-gaap/'+(para.ParaName)+'.json')}`)
                .then(response => {
                    if (response.ok) return response.json()
                    throw new Error('Network response was not ok.')
                })
                .then(data => {
                    let tempdata = {start:[], end:[], val:[]};
                    // let templabel = ((JSON.parse(data.contents)).label)
                    // console.log(templabel)
                    let tempParaData = (JSON.parse(data.contents)).units[para.Units]
                    tempParaData.forEach(element => {
                        if (element.start) tempdata.start.push(element.start)
                        tempdata.end.push(element.end)
                        tempdata.val.push(element.val)
                    });
                    setCompanyData((companyData)=> {return {...companyData, [para.ParaName]:tempdata}})
                })
            }
            // getStockPrice()
        }
    }, [selectedStock])


    // Load share prices of stock selected

    const handleChange = (event) => {
    stockSearchText = (event.target.value);
    setStockSearchResults(companyList.filter((company)=>{
        return ((company.title.toLowerCase().search(stockSearchText.toLowerCase()) !== -1) || (company.ticker.toLowerCase().search(stockSearchText.toLowerCase()) !== -1))
    }))
    }
  
    const handleListClick=({cik, ticker, title})=>{
    return () => {
        if (cik > 999999999){
            setSelectedStock({cik: String(cik), ticker: ticker})
        } else if (cik > 99999999){
            setSelectedStock({cik: "0"+String(cik), ticker: ticker})
        } else if (cik > 9999999){
            setSelectedStock({cik: "00"+String(cik), ticker: ticker})
        } else if (cik > 999999){
            setSelectedStock({cik: "000"+String(cik), ticker: ticker})
        } else if (cik > 99999){
            setSelectedStock({cik: "0000"+String(cik), ticker: ticker})
        } else if (cik > 9999){
            setSelectedStock({cik: "00000"+String(cik), ticker: ticker})
        } else if (cik > 999){
            setSelectedStock({cik: "000000"+String(cik), ticker: ticker})
        } else if (cik > 99){
            setSelectedStock({cik: "0000000"+String(cik), ticker: ticker})
        } else if (cik > 9){
            setSelectedStock({cik: "00000000"+String(cik), ticker: ticker})
        } else{
            setSelectedStock({cik: "000000000"+String(cik), ticker: ticker})        
        }
        inputRef.current.value = title
        }
    }

    console.log(companyData)

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