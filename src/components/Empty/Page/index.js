import React from 'react'

// UI
import styles from '../empty.module.css'

// Icons
import Icon from '../../../assets/icons/empty_page.png'

export default function Empty({ text = "" }){

    return(
        <div id={styles.page}>
            <img 
                src={Icon}
                alt="Empty"
                className={styles.icon}
            />
            <p className={styles.text}>{ text }</p>
        </div>
    )
}