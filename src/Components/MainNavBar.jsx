import {Link, useNavigate} from "react-router-dom"
import { useState, useEffect } from "react";

const MainNavBar = () => {

  const [requestedPage, setRequestedPage] = useState("Home");
  const navigate = useNavigate()

  useEffect(()=>{
    switch (requestedPage){
      case "Home": {
        navigate("/")
        break;
      } case "StockAnalyzer":{
        navigate("/StockAnalyzer")
        break;
      } case "Recommendations":{
        navigate("/Recommendations")
        break;
      }
    }
  },[requestedPage])

  const handleClick = (selectedPage) => () => {
    setRequestedPage(selectedPage);
    // navigate("/"+selectedPage)
  } 

  return (
    <nav className="navbar navbar-expand bg-light">
        <div className="container-fluid">          
          <div className="collapse navbar-collapse justify-content-center">
            <div className="navbar-nav">
            <li className={"nav-link border text-center mainNavItem "+((requestedPage==="Home")? "text-light bg-danger" : "")} onClick={handleClick("Home")}>Home</li>
            <li className={"nav-link border  text-center mainNavItem "+((requestedPage==="StockAnalyzer")? "text-light bg-danger" : "")} onClick={handleClick("StockAnalyzer")}>Stock Analyzer</li>
            <li className={"nav-link border text-center mainNavItem " + ((requestedPage==="Recommendations")? "text-light bg-danger" : "")} onClick={handleClick("Recommendations")}>Recommendations</li>
            </div>
          </div>
        </div>
    </nav>
  )
}

export default MainNavBar