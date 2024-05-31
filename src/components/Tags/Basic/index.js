import React, { useMemo } from 'react'

// UI
import styles from '../tag.module.css'
import { colors } from '../../../styles/colors'

export default function Tag({ text = "", color="purple", size = "small", marginRight = 0, shadow = false }){

    // Variables
    const tagSize = {
        extraSmall: 18,
        small: 24,
        medium: 32,
        large: 40
    }

    const textSize = {
        extraSmall: 10,
        small: 12,
        medium: 14,
        large: 16
    }

    // Methods
    const tag = useMemo(() => {
        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        return(
            <div 
                className={styles.icon} 
                style={{ 
                    backgroundColor: colors[`light${capitalize(color)}`],
                    // width: tagSize[size],
                    height: tagSize[size],
                    marginRight,
                    boxShadow: shadow && "-4px 0px 10px rgba(40, 132, 255, 0.15)"
                }}
            >
                <h5 
                    className={styles.text}
                    style={{ 
                        color: colors[color],
                        fontSize: textSize[size]
                    }}    
                >
                    { text }
                </h5>
            </div>
        )

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color, text])

    return tag
}