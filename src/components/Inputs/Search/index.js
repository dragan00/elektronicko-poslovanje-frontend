import React, { useEffect, useRef, useState } from 'react'

// Helpers
import useDevice from '../../../helpers/useDevice'

// UI
import styles from '../input.module.css'
import search from '../../../assets/icons/search.png'
import close from '../../../assets/icons/close.png'


export default function BasicInput({ value = "", label = "",  onChange, onKeyPress, onClear }){

    // Variables
    const inputRef = useRef(null)
    const device = useDevice()
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

    useEffect(() => {
        setScrollPosition(getOffset(inputRef.current).top)
    }, [])

    function onIconClick() {
        inputRef.current.focus()
    }

    if(device === 'desktop'){
        return(
            <div id={styles.search}>
                {/* Input */}
                <input
                    className={styles.searchInput}
                    value={value}
                    type="text"
                    onChange={onChange}
                    onKeyPress={onKeyPress}
                    ref={inputRef}
                    onFocus={handleOnFocus}
                    placeholder={label}
                />
                {/* Search icon */}
                <img 
                    src={search}
                    alt="Search"
                    className={styles.searchIcon}
                />
    
                {/* Clear icon */}
                {
                    value !== "" && 
                        <img
                            onClick={onClear} 
                            src={close}
                            alt="Clear"
                            className={styles.closeIcon}
                        />
                }
            </div>
        )
    }


    return(
        <div id={styles.searchMobile}>
            {/* Input */}
            <input
                className={styles.searchInputMobile}
                value={value}
                type="text"
                onChange={onChange}
                onKeyPress={onKeyPress}
                ref={inputRef}
                onFocus={handleOnFocus}
                placeholder={label}
                style={{ 
                    width: '100%', 
                    paddingLeft: 40 
                }}
            />
            {/* Search icon */}
            <img
                onClick={onIconClick}
                src={search}
                alt="Search"
                className={styles.searchIcon}
            />

            {/* Clear icon */}
            {
                value !== "" && 
                    <img
                        onClick={onClear} 
                        src={close}
                        alt="Clear"
                        className={styles.closeIcon}
                    />
            }
        </div>
    )
}