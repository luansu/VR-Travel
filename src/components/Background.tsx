import React from 'react'

import imgBonsai from '/src/assets/bonsai.jpg'
const Background = () => {
  return (
      <img src={imgBonsai} alt="Background" className="w-full h-full float-left top-0 left-0 right-0 bottom-0 absolute p-0 object-cover -z-10" />
  )
}

export default Background;
