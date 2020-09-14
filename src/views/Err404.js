import React from 'react'
import notFoundImg from '../assets/img/page_not_found.png'

function Err404() {
    return (
        <div className="Err404 Page">
        <div className="row">
        <div className="col s12 m8 l6 offset-m2 offset-l3">
        <div className="card round-card">
        <div className="card-content">
        <div className="center">
            <div className="image-container">
            <img src={notFoundImg} alt="" />
            </div>
            <h4 className="center head">Err!! Page Not Found</h4>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
    )
}

export default Err404
