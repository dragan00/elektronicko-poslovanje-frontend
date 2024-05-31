import React from 'react'

// UI
import styles from '../loader.module.css'
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Translate from '../../../Translate';

export default function Loader(){

    // Spinner
    const loader = 
        <LoadingOutlined 
            className={styles.loader}
            spin 
        />;

    return(
        <div id={styles.page}>
            <div className={styles.wrapper}>
                <Spin indicator={loader} />
                <p className={styles.text}><Translate textKey={"loading"}  /></p>
            </div>
        </div>
    )
}
    