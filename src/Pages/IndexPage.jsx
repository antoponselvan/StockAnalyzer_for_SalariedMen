import salaryManPic from "../../img/salaryman.webp"
import stockPic from "../../img/stockAnalyzer_v1.jfif"
import CardToolFeature from "../Components/CardToolFeature"

const IndexPage = () => {
  return (
    <div className="container">
      {/* <div className="col-sm-3"></div> */}      
      <div className="row justify-content-center align-items-center border mb-5">
        <div className="col-sm col-md-3">
          <img src={salaryManPic} className="mx-auto d-block w-20"></img>
        </div>
        <div className="col-sm col-md-5">
        <h4 className="text-center mt-5"> Time - The luxorious commodity that salary man lacks to do quality stock selection</h4>
        <p className=" lead text-start">We intend to be a great tool in salary man's aresnal by helping to pick long term stocks that can give good returns. We dont claim to spot 100X returns but spot stocks that are stable, fuss-free and over long term can beat market indices by 2X+ </p>
        <p className="lead text-center">Key Features of the tool that make the above happen</p>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-sm col-md-3">
          <CardToolFeature imgSrc="../../img/Focus.png" title="Focus on main fiancial fundamentals" mainText="The most critical financial parameters that represent health and growth of company are picked and "/>   
        </div>
        <div className="col-sm col-md-3">
          <CardToolFeature imgSrc="../../img/Valuation.webp" title="Simple & Effective valuation Technique" mainText="Trends to show key ratios - P/E and P/B to compare current stock price. A feature - not available free in other tools"/>   
        </div>
        <div className="col-sm col-md-3">
          <CardToolFeature imgSrc="../../img/Safeguarding.png" title="Safeguarding Factors" mainText="Stock market is un-tamable. To ensure ensure we dont go too wrong, some qualitative factors that avoid severe loss are presented"/>   
        </div>
      
      </div>
       
    </div>
  )
}

export default IndexPage