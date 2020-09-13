import React from 'react'
import logo from '../assets/img/digi-logo.jpg'

function Loading() {
    return (
        <div className="Loading Page">
        <div className="row">
        <div className="col s12 m8 l6 offset-m2 offset-l3">
        <div className="card round-card">
        <div className="card-content">
        <div className="center">
            <div className="logo-container">
            <img src={logo} alt="" srcset=""/>
            </div>
            <h4 className="center">Loading....</h4>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
    )
}

export default Loading
