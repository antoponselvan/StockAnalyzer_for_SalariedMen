import StockAnalyzerLayout from "../Layouts/StockAnalyzerLayout"
import { BrowserRouter, Routes, Route } from "react-router-dom"

const StockAnalyzerHome = () => {
  return (
    <>
      
        <Routes>
          <Route path="\StockAnalyzer" element={<StockAnalyzerLayout/>}>
            <StockAnalyzerLayout/>
          </Route>
        </Routes>
    </>
  )
}

export default StockAnalyzerHome