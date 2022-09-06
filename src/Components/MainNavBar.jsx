import {Link, useNavigate} from "react-router-dom"
import { useState } from "react";

const MainNavBar = () => {

  const [requestedPage, setRequestedPage] = useState("Home");
  const navigate = useNavigate()

  const handleClick = (selectedPage) => () => {
    setRequestedPage(selectedPage);
    navigate("/"+selectedPage)
  } 

  return (
    <nav className="navbar navbar-expand bg-light">
        <div className="container-fluid">          
          <div className="collapse navbar-collapse justify-content-center">
            <div className="navbar-nav">
            <Link to="/"><li className={"nav-link border text-center "+((requestedPage==="Home")? "text-light bg-danger" : "")} onClick={handleClick("Home")}>Home</li></Link>
            <Link to="/StockAnalyzer"><li className={"nav-link border  text-center "+((requestedPage==="StockAnalyzer")? "text-light bg-danger" : "")} onClick={handleClick("StockAnalyzer")}>Stock Analyzer</li></Link>
            <Link to="/Recommendations"><li className={"nav-link border text-center "+((requestedPage==="Recommendations")? "text-light bg-danger" : "")} onClick={handleClick("Recommendations")}>Recommendations</li></Link>
            </div>
          </div>
        </div>
    </nav>
  )
}

export default MainNavBar