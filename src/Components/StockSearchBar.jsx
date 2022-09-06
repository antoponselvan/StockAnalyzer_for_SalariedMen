import { useState, useEffect } from "react";
// const companyParaList = [{ParaName: "Revenues", Units:"USD"}]
const companyParaList = [{ParaName: "Revenues", Units:"USD"}, {ParaName: "NetIncomeLoss", Units:"USD"}, {ParaName: "Assets", Units:"USD"}, {ParaName: "Liabilities", Units:"USD"}, {ParaName: "StockholdersEquity", Units:"USD"}, {ParaName: "EarningsPerShareDiluted", Units:"USD/shares"}, {ParaName: "CommonStockSharesIssued", Units:"shares"}];
// "LiabilitiesAndStockholdersEquity", "StockholdersEquity", "SalesRevenueGoodsNet", "SalesRevenueServicesNet", "EarningsPerShareBasicAndDiluted"

const StockSearchBar = ({selectedStockCIK, setSelectedStockCIK, setCompanyData, companyData}) => {
//   const [stockSearchText, setStockSearchText] = useState("");
  let stockSearchText = "";
  const [stockSearchResults, setStockSearchResults] = useState([{Name:"", CIK:"0"}])
  
  const [companyList, setcompanyList] = useState([{name:"", CIK:"0000320193"}]) 
  // useEffect Fn to load list of stocks
 
    useEffect(()=>{
        fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://data.sec.gov/api/xbrl/frames/us-gaap/NetIncomeLoss/USD/CY2021.json')}`)
        .then(response => {
            if (response.ok) return response.json()
            throw new Error('Network response was not ok.')
        })
        .then(data => {
            setcompanyList((JSON.parse(data.contents)).data.map((companyInfo)=>{return {"Name":companyInfo.entityName, "CIK":companyInfo.cik}}))
        })
    },[])

    useEffect(()=>{
        if (selectedStockCIK !== "-1"){
            for (let para of companyParaList){
                fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://data.sec.gov/api/xbrl/companyconcept/CIK'+String(selectedStockCIK)+'/us-gaap/'+(para.ParaName)+'.json')}`)
                .then(response => {
                    if (response.ok) return response.json()
                    throw new Error('Network response was not ok.')
                })
                .then(data => {
                    // console.log(data)
                    let tempdata = {start:[], end:[], val:[]};
                    let templabel = ((JSON.parse(data.contents)).label)
                    console.log(templabel)
                    let tempParaData = (JSON.parse(data.contents)).units[para.Units]
                    tempParaData.forEach(element => {
                        if (element.start) tempdata.start.push(element.start)
                        tempdata.end.push(element.end)
                        tempdata.val.push(element.val)
                    });
                    // console.log(tempdata)
                    // companyData["Revenues"] = tempdata
                    // setCompanyData(()=> { return {...companyData, [para.ParaName]:tempdata}})
                    setCompanyData({...companyData, [para.ParaName]:tempdata})
                })
            }
        }
    }, [selectedStockCIK])

    const handleChange = (event) => {
    stockSearchText = (event.target.value);
    // setStockSearchText(event.target.value)
    setStockSearchResults(companyList.filter((company)=>{
        return (company.Name.toLowerCase().search(stockSearchText.toLowerCase()) !== -1)
    }))
    }
  
    const handleListClick=(CIK)=>{
    return () => {
        // console.log(CIK)
        if (CIK > 999999999){
            setSelectedStockCIK(String(CIK))
        } else if (CIK > 99999999){
            setSelectedStockCIK("0"+String(CIK))
        } else if (CIK > 9999999){
            setSelectedStockCIK("00"+String(CIK))
        } else if (CIK > 999999){
            setSelectedStockCIK("000"+String(CIK))
        } else if (CIK > 99999){
            setSelectedStockCIK("0000"+String(CIK))
        } else if (CIK > 9999){
            setSelectedStockCIK("00000"+String(CIK))
        } else if (CIK > 999){
            setSelectedStockCIK("000000"+String(CIK))
        } else if (CIK > 99){
            setSelectedStockCIK("0000000"+String(CIK))
        } else if (CIK > 9){
            setSelectedStockCIK("00000000"+String(CIK))
        } else{
            setSelectedStockCIK("000000000"+String(CIK))        
        }
        // console.log(selectedStockCIK)        
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
                    stockSearchResults.map((company)=> (<li key={company.CIK} onClick={handleListClick(company.CIK)}><button className="dropdown-item" type="button">{company.Name}</button></li>))
                }
            </ul>
        </div>             
        <input onChange={handleChange} className="form-control" placeholder="Search Stock"/>                
    </div>
    )
    }

export default StockSearchBar