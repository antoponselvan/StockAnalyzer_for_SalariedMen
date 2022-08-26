import { useEffect, useState } from "react"

const FetchTest = () => {
  const [txt1, setTxt1] = useState("a")
  const [txt2, setTxt2] = useState("b")
  const [txt3, setTxt3] = useState("c")
  useEffect(()=>{
    fetch("https://api.aletheiaapi.com/FinancialFactTrend?id=AAPL&label=8&after=20140101&key=")
    .then((response)=>response.json())
    .then((data)=>{
      setTxt1(Object.keys(data))
      console.log(data)})

    fetch("https://api.giphy.com/v1/gifs/random?api_key=HZSrhjAYpqulkOg0lwOc7yljFZpppPar&tag=&rating=g", {
      mode: "no-cors",
      headers: {
        'Access-Control-Allow-Origin':'*'
      }
    })
    .then((response)=>response.json())
    .then((data)=>{
      setTxt2(Object.keys(data))
      console.log(data)})

      fetch("https://data.sec.gov/api/xbrl/companyfacts/CIK0001318605.json", {
        mode: "no-cors",
        headers: {
          'Access-Control-Allow-Origin':'*'
        }
      })
      .then((response)=>response.json())
      .then((data)=>{
        setTxt3(Object.keys(data))
        console.log(data)})

    // https://api.giphy.com/v1/gifs/random?api_key=HZSrhjAYpqulkOg0lwOc7yljFZpppPar&tag=&rating=g
    // https://data.sec.gov/api/xbrl/companyfacts/CIK0001318605.json
    
    // fetch("https://data.sec.gov/api/xbrl/companyfacts/CIK0001318605.json", {
    //         mode: "cors",
    //         headers: {
    //           'Access-Control-Allow-Origin':'*'
    //         }})
    // .then((response)=>response.json())
    // .then((data)=>{txt = data})
  
  },[])
    
  return (
    <>
    <p>Test</p>
    <p>Text1: {txt1}</p>
    <p>Text2: {txt2}</p>
    <p>Text3: {txt3}</p>
    </>
  )
}

export default FetchTest
