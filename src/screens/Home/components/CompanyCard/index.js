import React from 'react'
import { useHistory } from 'react-router-dom'

// UI
import styles from '../../styles.module.css'
import Translate from "../../../../Translate";

export default function CompanyCard({ name = "" }){

    // Variables
    const history = useHistory()

    // Methods
    function handleOnClick(){
        history.push('/profile/about')
    }

    return(
        <div className={styles.companyCard} onClick={handleOnClick}>
            {/* Informations */}
            <div className={styles.informations}>
                {/* Label */}
                <h4 className={styles.label}><Translate textKey={"company_name"} /></h4>
                {/* Label */}
                <h1 className={styles.name}>{ name || "-" }</h1>
            </div>

            {/* Decorations */}
            <div className={styles.decorationLeft} />
            <div className={styles.decorationRight} />
            {/* <img className={styles.logo} src={LOGO} /> */}
        </div>
    )
}