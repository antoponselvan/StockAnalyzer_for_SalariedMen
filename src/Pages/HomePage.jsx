import salaryManPic from "../../img/salaryman.webp"
import CardToolFeature from "../Components/CardToolFeature"
import focusPic from "../../img/Focus.png"
import valuationPic from "../../img/Valuation.webp"
import safeguardingPic from "../../img/Safeguarding.png"

const HomePage = () => {
  return (
    <div className="container">     
      <div className="row justify-content-center align-items-center mb-5">
        <div className="col-sm col-md-3">
          <img src={salaryManPic} className="mx-auto d-block w-20"></img>
        </div>
        <div className="col-sm col-md-5">
        <h4 className="text-center mt-5"> Time - The luxorious commodity that salaryMan lacks to do quality stock selection</h4>
        <p className=" lead text-start">We intend to be the best tool in salary man's aresnal to pick stocks that can give good long term returns with relative ease. We dont claim to spot stocks yielding 100X returns but stocks that are stable and over long term can beat market indices by 2X+ </p>
        
        </div>
      </div>
      <div className="row justify-content-center">
      <h4 className="text-center m-4">Key Features</h4>
        <div className="col-sm col-md-3">
          <CardToolFeature id="A" imgSrc={focusPic} title="Focus on key Financial fundamentals" mainText="The most critical financial parameters that represent health and growth of company are picked and analyzed"/>   
        </div>
        <div className="col-sm col-md-3">
          <CardToolFeature id="B" imgSrc={valuationPic} title="Simple & effective Valuation technique" mainText="Trends to show key ratios - P/E and P/B to compare current stock price. A feature - not available free in other tools"/>   
        </div>
        <div className="col-sm col-md-3">
          <CardToolFeature id="C" imgSrc={safeguardingPic} title="Usage of Safeguarding factors" mainText="Stock market is un-tamable. To ensure ensure we dont go too wrong, some qualitative factors that avoid severe loss are presented"/>   
        </div>
      
      </div>
       
    </div>
  )
}

export default HomePage