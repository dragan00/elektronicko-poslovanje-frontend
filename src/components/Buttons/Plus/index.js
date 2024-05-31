import React from 'react'

// UI
import { PlusOutlined } from '@ant-design/icons'
import styles from '../button.module.css'
import { colors } from '../../../styles/colors'

export default function PlusButton({ size = "small" /* small, medium or large */, color="purple", onClick }){

    // Variables
    const iconSize = {
        small: 28,
        medium: 36,
        large: 42
    }

    const plusSize = {
        small: 16,
        medium: 20,
        large: 24
    }

    // Methods
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    return (
        <div
            onClick={onClick}
            className={styles.icon} 
            style={{
                cursor: "pointer",
                backgroundColor: colors[`light${capitalize(color)}`],
                width: iconSize[size],
                height: iconSize[size],
            }}
        >
            <PlusOutlined 
                style={{ 
                    color: colors[color],
                    fontSize: plusSize[size]
                }} 
            />
        </div>
)
}