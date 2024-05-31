import React from 'react'

// UI
import styles from '../button.module.css'

export default function IconButton({ size = "small" /* small, medium or large */, round = true, icon, onClick }){

    // Variables
    const iconSize = {
        small: 28,
        medium: 36,
        large: 42,
    }

    const imgSize = {
        small: 16,
        medium: 20,
        large: 24,
    }

    return(
        <div 
            id={styles.iconButton}
            style={{
                width: iconSize[size],
                height: iconSize[size],
                borderRadius: round && 3
            }}    
        >
            <img
                onClick={onClick}
                src={icon}
                alt="Icon button"
                style={{ 
                    width: imgSize[size],
                    height: imgSize[size],
                }}
            />
        </div>
    )
}