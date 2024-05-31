import React, { useMemo } from 'react'

// UI
// import Icon from '@ant-design/icons'
import styles from '../card.module.css'
import { colors } from '../../../styles/colors'

export default function WithAction({ text = "", subtext = "", color="purple", Icon }){

    // Methods
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const cardIcon = useMemo(() => {
        return(
            <div 
                className={styles.icon} 
                style={{ backgroundColor: colors[`light${capitalize(color)}`] }}
            >
                <Icon style={{ color: colors[color] }} />
            </div>
        )
    }, [color])


    return(
        <div 
            id={styles.basic}
        >
            {/* Icon */}
            { cardIcon }

            {/* Main text */}
            <h5 className={styles.text}>
                { text }
            </h5>

            {/* Subtext */}
            <h5 className={styles.subtext}>
                &nbsp;{ subtext }
            </h5>
        </div>
    )
}