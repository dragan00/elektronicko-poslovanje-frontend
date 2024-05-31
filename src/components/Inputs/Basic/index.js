import React, { useEffect, useRef, useState } from 'react'

// UI
import styles from '../input.module.css'

export default function BasicInput({ value = "", label = "", name = "", type = "", autofocus = false, onChange, onKeyPress, ...props }){

    // Variables
    const inputRef = useRef(null)
    const [scrollPosition, setScrollPosition] = useState(0)

    // Methods
    function onLabelFocus() {
        inputRef.current.focus()
    }

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

    useEffect(() => {
        setScrollPosition(getOffset(inputRef.current).top)
    }, [])


    return(
        <div id={styles.basic}>
            {/* Input */}
            <input
                {...props}
                className={styles.basicInput}
                value={value}
                name={name}
                type={type}
                onChange={onChange}
                onKeyPress={onKeyPress}
                autoFocus={autofocus}
                ref={inputRef}
                onFocus={handleOnFocus}
            />
            {/* Label */}
            <p className={styles.basicLabel} onClick={onLabelFocus}>
                { label }
            </p>
        </div>
    )
}