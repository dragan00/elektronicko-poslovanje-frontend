import React from 'react'

// UI
import styles from '../../styles.module.css'
import UserIcon from '../../../../assets/icons/user_card.png'

export default function UserCard({ name = "" }){
    return(
        <div className={styles.userCard}>
            {/* Icon */}
            <img src={UserIcon} className={styles.userIcon} />
            {/* Informations */}
            <div className={styles.informations}>
                {/* Label */}
                {/* Name */}
                <h1 className={styles.name}>{ name || "-" }</h1>
            </div>
        </div>
    )
}