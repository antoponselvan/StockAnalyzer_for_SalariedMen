import { useState, useEffect, useRef } from "react";
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
        inputRef.current.value = selectedStock.title        
    }, [selectedStock])

// Event Handlers ---------------------------------------------------------------------------------- 
// TxtBox change triggers search of stock (ticker code or company name) matching input
    const handleChange = (event) => {
    setStockSearchText(event.target.value);    
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
        <input onChange={handleChange} onFocus={handleInputBoxFocus} onBlur={handleInputBoxBlur} ref={inputRef} className="form-control" placeholder="Search (Name or Ticker Code)"/>                
    </div>
    )
    }

export default StockSearchBar