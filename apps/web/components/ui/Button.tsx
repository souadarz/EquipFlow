import React, { useState } from 'react'

const Button = ({coleur, titre}: string) => {
    
  return (
    <>
        <button style={color= {coleur}}>{titre}</button>
    </>

  )
}

export default Button