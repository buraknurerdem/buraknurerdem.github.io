function ProjectThumb(props){
    
    function goToProject(){
        props.onClick(true);
    }

 
    return(
        <div className="card">
            <h3 className="card-name">{props.text}</h3>
            <div>
                <img className='thumb' src={props.thumb} alt={props.text} width ='550' height='290' ></img>
            </div>
            <button className="btn" onClick={props.onClick}>
                Go
            </button>
        </div>
        
    )
}

export default ProjectThumb;