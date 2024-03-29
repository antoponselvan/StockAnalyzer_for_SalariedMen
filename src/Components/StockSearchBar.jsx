import { useState, useEffect, useRef } from "react";
import secCompaniesList from "../secCompaniesList";
const companyParaList = [{ParaName: "Revenues", Units:"USD"}, {ParaName: "NetIncomeLoss", Units:"USD"}, {ParaName: "Assets", Units:"USD"}, {ParaName: "Liabilities", Units:"USD"}, {ParaName: "StockholdersEquity", Units:"USD"}, {ParaName: "EarningsPerShareDiluted", Units:"USD/shares"}, {ParaName: "CommonStockSharesIssued", Units:"shares"}];
// "LiabilitiesAndStockholdersEquity", "StockholdersEquity", "SalesRevenueGoodsNet", "SalesRevenueServicesNet", "EarningsPerShareBasicAndDiluted"

const StockSearchBar = ({selectedStock, setSelectedStock, setCompanyData, companyData}) => {
    const secCompaniesListFormatted = Object.values(secCompaniesList)
    const [stockSearchResults, setStockSearchResults] = useState([{Name:"", CIK:"0"}])  
    const [companyList, setcompanyList] = useState(secCompaniesListFormatted)
    const [stockSearchTextBoxFocus, setStockSearchTextBoxFocus] = useState(false);
    const [isLoadingCompanies, setIsLoadingCompanies] = useState(false)
    const inputRef = useRef();


// Load list of stocks -----------------------------------------------------  
    useEffect(()=>{
        setIsLoadingCompanies(true)       
        fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://www.sec.gov/files/company_tickers.json')}`)
        .then(response => {
            setIsLoadingCompanies(false)
            if (response.ok) return response.json()
            throw new Error('Network response was not ok.')
        })
        .then(data => {
            setcompanyList(Object.values(JSON.parse(data.contents)))
            //cik_str, ticker, title
        })
        .catch((error)=>{
            setIsLoadingCompanies(false)
            console.log(error)
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
                    setCompanyData((companyData)=> {return {...companyData, [para.ParaName]:tempdata, LoadedAPICount:(companyData.LoadedAPICount+1)}})                    
                })
                .catch((error)=>{
                    let tempdata = {fy:[0], fp:['1Q'], start:[0], end:[0], val:[0]}
                    setCompanyData((companyData)=> {return {...companyData, [para.ParaName]:tempdata, LoadedAPICount:(companyData.LoadedAPICount+1)}})
                })
            }
            fetch('https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol='+(selectedStock.ticker)+'&apikey=TFCI3JPMM2ST2IA2')
            .then(res => res.json())
            .then(data=>{
                let tempData = (data["Monthly Adjusted Time Series"])
                let tempTimeStamps = Object.keys(tempData)
                let tempStockVal = tempTimeStamps.map((timestamp)=>{
                    return (Number(tempData[timestamp]["5. adjusted close"]))
                })
                let tempStockValRaw = tempTimeStamps.map((timestamp)=>{
                    return (Number(tempData[timestamp]["4. close"]))
                })
                setCompanyData((companyData)=>{
                    return {...companyData, SharePrice:{time: tempTimeStamps, val: tempStockVal, valRaw: tempStockValRaw}, LoadedAPICount:(companyData.LoadedAPICount+1)}
                })
            })
        }
        inputRef.current.value = selectedStock.title        
    }, [selectedStock])

// Event Handlers ---------------------------------------------------------------------------------- 
// TxtBox change triggers search of stock (ticker code or company name) matching input
    const handleChange = (event) => {
    const stockSearchTxt = event.target.value
    setStockSearchResults(companyList.filter((company)=>{
        return ((company.title.toLowerCase().search(stockSearchTxt.toLowerCase()) !== -1) || (company.ticker.toLowerCase().search(stockSearchTxt.toLowerCase()) !== -1))
    }))
    }

// Click triggers fetch and all calc of company data
    const handleListClick=({cik, ticker, title})=>{
        const cikAddendum = ["000000000","00000000","0000000","000000","00000","0000","000","00","0"]
        const cikStr = cikAddendum[Math.floor(Math.log10(cik))] + String(cik)
        return () => {
            setStockSearchTextBoxFocus(false)
            setSelectedStock({cik:cikStr, ticker, title})
            setCompanyData({...companyData, LoadedAPICount:0})}
    }

    const handleInputBoxFocus = () => {
        setStockSearchTextBoxFocus(true)
    }
    const handleInputBoxBlur = () => {
        setTimeout(()=>{setStockSearchTextBoxFocus(false)},200)
    }


// Final Component return to HTML -----------------------------------------------------------------
    return (
    <>
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
    {/* {
        isLoadingCompanies &&
        <div className="text-center">
            Checking for new Company Names
            <div className="row justify-content-center align-items-center mb-2">
                <div class="spinner-grow" role="status"></div>
                <div class="spinner-grow" role="status"></div>
                <div class="spinner-grow" role="status"></div>
            </div>            
        </div>
    } */}
    </>
    )
    }

export default StockSearchBar