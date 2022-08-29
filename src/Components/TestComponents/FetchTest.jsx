import { useEffect, useState } from "react"

const FetchTest = () => {
  const [txt1, setTxt1] = useState("a")
  const [txt2, setTxt2] = useState("b")
  const [txt3, setTxt3] = useState("c")
  const [txt4, setTxt4] = useState("d")
  const [txt5, setTxt5] = useState(["e","f"])
  const [txt6, setTxt6] = useState(0)
  useEffect(()=>{
    fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://data.sec.gov/api/xbrl/companyfacts/CIK0001318605.json')}`)
    .then(response => {
      if (response.ok) return response.json()
      throw new Error('Network response was not ok.')
    })
    .then(data => {
      //console.log(data)
      let dataObj = (JSON.parse(data.contents)).facts
      setTxt4(JSON.parse(data.contents).entityName)
      console.log(dataObj["us-gaap"].NetIncomeLoss.units.USD[1].start)
      console.log(dataObj["us-gaap"].NetIncomeLoss.units.USD[0].end)
      console.log(dataObj["us-gaap"].NetIncomeLoss.units.USD[0].val)
      setTxt1(dataObj["us-gaap"].NetIncomeLoss.units.USD[6].start)
      setTxt2(dataObj["us-gaap"].NetIncomeLoss.units.USD[6].end)
      setTxt3(dataObj["us-gaap"].NetIncomeLoss.units.USD[6].val)
      setTxt5(Object.keys(dataObj["us-gaap"]))
    })

    fetch('https://api.finage.co.uk/agg/stock/MSFT/1/year/2010-02-05/2022-02-07?apikey=API_KEY60W7U5P3ULR5HAWZN410J2IXX8SVNQGF')
    .then(response => {return response.json()
    })
    .then(data => {
      console.log(data)
      setTxt6(data.results[0].h)
    })

  },[])
    
  return (
    <>
    <p>Company Name: {txt4}</p>
    <p>Start Period: {txt1}</p>
    <p>End Period: {txt2}</p>
    <p>Value: {txt3}</p>
    <p>Msft high: {txt6}</p>
    <p>Misc Info: {txt5.map((item)=><p>{item}</p>)}</p>
    </>
  )
}

export default FetchTest
