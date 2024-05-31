import React from 'react'

// UI
import styles from '../tag.module.css'
import { colors } from '../../../styles/colors'

export default function Number({ count = 0, size = "small", color="purple" }){

    // Constants
    const iconSize = {
        small: 28,
        medium: 36,
        large: 42,
        extraLarge: 48
    }

    const textSize = {
        small: 12,
        medium: 14,
        large: 16,
        extraLarge: 18
    }

    // Methods
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div 
            className={styles.numberIcon} 
            style={{ 
                backgroundColor: colors[`light${capitalize(color)}`],
                width: iconSize[size],
                height: iconSize[size],
            }}
        >
            <h5 
                className={styles.text}
                style={{ 
                    color: colors[color],
                    fontSize: textSize[size]
                }}    
            >
                { count }
            </h5>
        </div>
    )
}