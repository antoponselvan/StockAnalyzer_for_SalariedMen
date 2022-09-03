

const CardToolFeature = ({imgSrc, title, mainText}) => {
  return (
    <>
        {/* <div className="card text-bg-dark">
            <img src="../../img/salaryman.webp" className="card-img" alt="..."/>
            <div className="card-img-overlay">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                <p className="card-text">Last updated 3 mins ago</p>
            </div>
        </div> */}

        <div className="card mb-3 bg-secondary text-light" style={{"max-width": "540px"}}>
            <div className="row g-0">
                <div className="col my-auto">
                    <img src={imgSrc} className="img-fluid rounded-start mt-5" alt="..."/>
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text">{mainText}</p>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default CardToolFeature