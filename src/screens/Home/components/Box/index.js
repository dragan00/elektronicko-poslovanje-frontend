import React from 'react'
import { Link } from 'react-router-dom'

// UI
import styles from '../../styles.module.css'

export default function Box({ label = "", value = "", url, style = {} }){
    return(
        <Link to={url} className={styles.boxWrapper} style={{ ...style }}>
            <div className={styles.box}>
                <div>
                    <h4 className={styles.label}>{ label || "-" }</h4>
                    <h1 className={styles.value}>{ value || "0" }</h1>
                </div>
            </div>
        </Link>
    )
}