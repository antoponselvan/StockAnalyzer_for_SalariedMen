import MainNavBar from "../Components/MainNavBar"
import {Outlet} from "react-router-dom"

const MainLayout = () => {
  return (
    <>
      <MainNavBar/>
      <Outlet/>
    </>
  )
}

export default MainLayout