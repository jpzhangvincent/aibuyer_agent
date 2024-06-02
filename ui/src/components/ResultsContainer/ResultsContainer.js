import React, { useState } from 'react'
import ProductComparison from '../../ProductComparison/ProductComparison'
import ChatBot from '../ChatBot/ChatBot'

const ResultsContainer = () => {

  return (
    <div >
      <ProductComparison />
      <ChatBot />
    </div>
  )
}

export default ResultsContainer