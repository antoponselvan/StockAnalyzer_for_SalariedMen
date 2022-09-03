import { useState } from "react";
const companyPara = ["Revenues", "SalesRevenueGoodsNet", "SalesRevenueServicesNet", "NetIncomeLoss", "LiabilitiesAndStockholdersEquity", "StockholdersEquity", "EarningsPerShareBasicAndDiluted", "EarningsPerShareDiluted", "CommonStockSharesIssued"];
const StockSearchBar = ({companyList, selectedStockCIK, setSelectedStockCIK, setCompanyData}) => {
//   const [stockSearchText, setStockSearchText] = useState("");
  let stockSearchText = "";
  const [stockSearchResults, setStockSearchResults] = useState([{Name:"", CIK:"0"}])
  
  const handleChange = (event) => {
    stockSearchText = (event.target.value);
    // setStockSearchText(event.target.value)
    setStockSearchResults(companyList.filter((company)=>{
        return (company.Name.toLowerCase().search(stockSearchText.toLowerCase()) !== -1)
    }))
  }
  
  const handleListClick=(CIK)=>{
    // console.log(CIK, CIK.length, (typeof CIK))
    // setSelectedStockCIK(company.CIK)
    return () => {
        console.log(CIK)
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
        console.log(selectedStockCIK)

        for (let para of companyPara){
            fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://data.sec.gov/api/xbrl/companyconcept/CIK'+String(selectedStockCIK)+'/us-gaap/'+para+'.json')}`)
            .then(response => {
                if (response.ok) return response.json()
                throw new Error('Network response was not ok.')
            })
            .then(data => {
                console.log(data)
                console.log((data.contents))
            })
        }

        // fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://data.sec.gov/api/xbrl/companyconcept/CIK'+String(selectedStockCIK)+'/us-gaap/NetIncomeLoss.json')}`)
        // .then(response => {
        //     if (response.ok) return response.json()
        //     throw new Error('Network response was not ok.')
        // })
        // .then(data => {
        //     console.log(data)
        //     console.log((data.contents))
        // })

        }
  }


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