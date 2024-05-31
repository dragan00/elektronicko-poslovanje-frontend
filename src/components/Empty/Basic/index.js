import React from 'react'

// UI
import styles from '../empty.module.css'

// Icons
import Icon from '../../../assets/icons/empty.png'

export default function Empty({ text = "" }){

    return(
        <div id={styles.basic}>
            <img 
                src={Icon}
                alt="Empty"
                className={styles.icon}
            />
            <p className={styles.text}>{ text }</p>
        </div>
    )
}