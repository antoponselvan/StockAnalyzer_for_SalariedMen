

const CardToolFeature = ({id, imgSrc, title, mainText}) => {
  return (
    <>        
        <div className="card mb-3">
            <img src={imgSrc} className="card-img-top" style={{"max-width": "300px"}} alt="..."/>
            <div className="card-body">
                <div className="accordion">
                    <div className="accordion-item">
                        <button className="h1 accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={"#"+id} aria-controls="collapseOne">
                            <h6>{title}</h6>
                        </button>
                        <div id={id}  className="accordion-collapse collapse">
                        <div className="accordion-body">
                            {mainText}
                        </div>
                        </div>
                    </div>
                </div>                
            </div>
        </div>

    </>
  )
}

export default CardToolFeature