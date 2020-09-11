import React from 'react'

function InfoCard({children}) {
    return (
        <div className="Info Card">
        <div className="row">
        <div className="col s12 m8 l6 offset-m2 offset-l3">
        <div className="card round-card">
        <div className="card-content">
            {children}
        </div>
        </div>
        </div>
        </div>
        </div>
    )
}

export default InfoCard
