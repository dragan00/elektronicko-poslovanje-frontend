import React, { useEffect, useRef, useState } from 'react'

// UI
import styles from '../input.module.css'

export default function BasicInput({ value = "", label = "", name = "", type = "", width = '100%', autofocus = false, onChange, onKeyPress, style = {}, ...props }){

    // Variables
    const inputRef = useRef(null)
    const [scrollPosition, setScrollPosition] = useState(0)

    // Methods
    function handleOnFocus(){
        window.scrollTo({
            top: scrollPosition - 220,
            left: 0,
            behavior: 'smooth'
        });
    }

    function getOffset(element) {
        let rect = element.getBoundingClientRect();
        return {
          left: rect.left + window.scrollX,
          top: rect.top + window.scrollY
        };
    }

    function onLabelFocus() {
        inputRef.current.focus()
    }

    useEffect(() => {
        setScrollPosition(getOffset(inputRef.current).top)
    }, [])


    return(
        <div style={{ width, position: 'relative', ...style }}>
            {/* Input */}
            <textarea
                className={styles.textArea}
                value={value}
                name={name}
                type={type}
                onChange={onChange}
                onKeyPress={onKeyPress}
                autoFocus={autofocus}
                ref={inputRef}
                onFocus={handleOnFocus}
                {...props}
            />
            {/* Label */}
            <p onClick={onLabelFocus} className={styles.textAreaLabel}>
                { label }
            </p>
        </div>
    )
}