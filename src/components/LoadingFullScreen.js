import React from 'react'
import logo from '../assets/img/digi-logo.jpg'

function Loading() {
    return (
        <div className="LoadingFullScreen">
            <div className="logo-container">
                <img src={logo} />
            </div>
            <h5 className="heavy_text center">Welcome to </h5>
            <h4 className="heavy_text center">Digizup Store</h4>
        </div>
    )
}

export default Loading
