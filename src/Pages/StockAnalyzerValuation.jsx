import { useEffect } from "react"

const StockAnalyzerValuation = ({companyvaluationData}) => {
  // let PE = {x: [1, 2, 3, 4, 5], y: [1, 2, 4, 8, 16], name:"PE" };
  // let PEmovingAvg = {x: [1, 2, 3, 4, 5], y: [1, 4, 3, 8, 17], name:"PE (3yr Avg)" }
  let PE = {x: companyvaluationData.details.PE.time, y: companyvaluationData.details.PE.val, name:"PE" };
  let PEmovingAvg = {x: companyvaluationData.details.PEMovingAvg.time, y: companyvaluationData.details.PEMovingAvg.val, name:"PE (3yr Avg)" }
  let PEyAxisHighLim = 100
  let PEyMax = Math.max(...PE.y)
  if (PEyMax < 100) {PEyAxisHighLim=PEyMax}

  let PB = {x: companyvaluationData.details.PB.time, y: companyvaluationData.details.PB.val, name:"PB" };
  let PBmovingAvg = {x: companyvaluationData.details.PBMovingAvg.time, y: companyvaluationData.details.PBMovingAvg.val, name:"PB (3yr Avg)" }

  useEffect(()=>{
    Plotly.newPlot( 'PeGraph', [PE, PEmovingAvg], {
      margin: { t: 0 },
      yaxis: {
        range:[0, PEyAxisHighLim]
      }}
       );

    Plotly.newPlot( 'PbGraph', [PB, PBmovingAvg], {
      margin: { t: 0 } } );
  },[])

  return (
    <div className="col border-start border-bottom border-end">
      <div className="row align-items-center m-2 mt-5">
        <div className="col-md-9">
          <div id="PeGraph" className="border" style={{height:300}}> P/E Ratio
          </div>
        </div>
        <div className="col">
          <h6>PE (Current): {companyvaluationData.summary.PE}</h6>
          <h6>PE (3yr moing avg): {companyvaluationData.summary.PEIdeal}</h6>
        </div>
      </div>

      <div className="row align-items-center m-2 mt-5">
        <div className="col-md-9">
          <div id="PbGraph" className="border" style={{height:300}}> P/B Ratio
          </div>
        </div>
        <div className="col">
          <h6>P/B (Current): {companyvaluationData.summary.PB}</h6>
          <h6>P/B (3yr moing avg): {companyvaluationData.summary.PBIdeal}</h6>
        </div>
      </div>
    </div>
  )
}

export default StockAnalyzerValuation