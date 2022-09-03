import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './Layouts/MainLayout'
import './App.css'
import IndexPage from './Pages/IndexPage'
import StockAnalyzer from './Pages/StockAnalyzer'
import Recommendations from './Pages/Recommendations'

function App() {

  

  return ( 

    <>
      <h1 className='ms-auto text-center bg-dark text-white p-3'>SalaryMan's Stock Analyzer</h1>      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout/>}>
            <Route index element={<IndexPage/>}/>
            <Route path="/StockAnalyzer" element={<StockAnalyzer/>}/>
            <Route path="/Recommendations" element={<Recommendations/>}/>
          </Route>
        </Routes>      
      </BrowserRouter>
    </>
  )
}

export default App
