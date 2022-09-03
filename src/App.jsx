import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './Layouts/MainLayout'
import StockAnalyzerLayout from './Layouts/StockAnalyzerLayout'
import './App.css'
import HomePage from './Pages/HomePage'
import StockAnalyzerHome from './Pages/StockAnalyzerHome'
import Recommendations from './Pages/Recommendations'
import StockAnalyzerSummary from './Pages/StockAnalyzerSummary'
import StockAnalyzerFundamentals from './Pages/StockAnalyzerFundamentals'
import StockAnalyzerValuation from './Pages/StockAnalyzerValuation'
import { useState } from 'react'

function App() {

  const [companyData, setCompanyData] = useState({"Revenue":[], "Profit":[], "SharePrice":[], "EPS":[], "BookValue":[], "D/E":[], "Time":[]})

  return ( 

    <>
      <h1 className='ms-auto text-center bg-dark text-white p-3'>SalaryMan's Stock Analyzer</h1>      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout/>}>
            <Route index element={<HomePage/>}/>
            <Route path="/StockAnalyzer" element={<StockAnalyzerLayout setCompanyData={setCompanyData}/>}>
              <Route path="/StockAnalyzer/Summary" element={<StockAnalyzerSummary companyData={companyData}/>}/>
              <Route path="/StockAnalyzer/Fundamentals" element={<StockAnalyzerFundamentals companyData={companyData}/>}/>
              <Route path="/StockAnalyzer/Valuation" element={<StockAnalyzerValuation companyData={companyData}/>}/>
            </Route>
            <Route path="/Recommendations" element={<Recommendations/>}/>
          </Route>
        </Routes>      
      </BrowserRouter>
    </>
  )
}

export default App
