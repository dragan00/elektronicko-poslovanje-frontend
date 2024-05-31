import React, { useMemo } from 'react'

// UI
import Icon, { PlusOutlined } from '@ant-design/icons'
import styles from '../card.module.css'
import { colors } from '../../../styles/colors'

export default function WithAction({ text = "", subtext = "", color="purple", icon, onClick, style = {} }){

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
                <Icon 
                    component={icon}
                    style={{ color: colors[color] }}
                />
            </div>
        )
    }, [color, icon])

    const cardAction = useMemo(() => {
        return(
            <div
                className={styles.icon} 
                style={{ backgroundColor: colors[`light${capitalize(color)}`] }}
            >
                <PlusOutlined style={{ color: colors[color] }} />
            </div>
        )
    }, [color])

    return(
        <div 
            id={styles.withAction}
            onClick={onClick}
            style={{ ...style }}
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
            {/* Action */}
            { cardAction }
        </div>
    )
}