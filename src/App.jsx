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
  const [calculatedCompanyData, setCalculatedCompanyData] = useState(
    {
      safeguardsSummary: {indexConstituent: true, publicYearCount: 10, sharePriceCAGR: 5},
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
            calculatedCompanyData={calculatedCompanyData} setCalculatedCompanyData={setCalculatedCompanyData}/>}>

              <Route path="/StockAnalyzer/Summary" element={<StockAnalyzerSummary 
              companySummaryData={{safeguardsSummary: calculatedCompanyData.safeguardsSummary,          fundamentalsSummary:calculatedCompanyData.fundamentalsSummary, 
              valuationSummary:calculatedCompanyData.valuationSummary, 
              scoreSummary:calculatedCompanyData.scoreSummary}} 
              companySharePrice={companyData.SharePrice} />}/>

              <Route path="/StockAnalyzer/Fundamentals" element={<StockAnalyzerFundamentals 
              companyfundamentalsData={{summary:calculatedCompanyData.fundamentalsSummary, details:calculatedCompanyData.fundamentalsDetails}}/>}/>
              
              <Route path="/StockAnalyzer/Valuation" element={<StockAnalyzerValuation 
              companyvaluationData={{summary:calculatedCompanyData.valuationSummary, 
              details:calculatedCompanyData.valuationDetails}}/>}/>
            </Route>
            <Route path="/Recommendations" element={<Recommendations/>}/>
          </Route>
        </Routes>      
      </BrowserRouter>
    </>
  )
}

export default App
