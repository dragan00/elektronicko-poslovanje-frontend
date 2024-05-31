import React from 'react'
import { createPortal } from 'react-dom'

export default function Overlay({ children }){
    return createPortal(
        <div id="overlayStyle">
            { children }
        </div>,
        document.querySelector("#overlay")
    )
  }