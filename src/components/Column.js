import React from 'react'

/* Column component represents each element in the array 
   to be manipulated for sorting visualization*/

const Column = ({value}) => {
    return (
        <div style = {{height: `${value * 2}px`}} className = "Column">
            <h6 className = "ColumnText">{value}</h6>
        </div>
    )
}

export default Column
