import React, { useMemo } from 'react'
import useDevice from '../../../helpers/useDevice'

// UI
import { Divider, Tooltip } from 'antd'
import styles from '../card.module.css'

export default function Destinations({ load, unload, shrink = false, containerWidth = '80%' }){

    // Variables
    const device = useDevice()
    const isMobile = device === 'mobile'


    const loads = useMemo(() => {
        return (
            load.map(item => (
                <div id={styles.destinations}>
                    <div className={styles.place} style={{ width: shrink && '100%' }}>
                        <h3 className={styles.item} style={{ minWidth: 36 }}>
                                { 
                                    isMobile ? 
                                        item.country.alpha2Code || "-" : 
                                        shrink ? item.country.alpha2Code || "-" : item.country.name || "-" 
                                }
                        </h3>
                        <Divider type='vertical' />
                        {
                            isMobile ? 
                                <Tooltip title={item.city}>
                                    <h3 className={`${styles.item} ${styles.city}`}>{ item.city || "-" }</h3>
                                </Tooltip>
                                :
                                <h3 style={{ maxWidth: shrink && '50%' }} className={styles.item}>{ item.city || "-" }</h3>
                        }
                        <Divider type='vertical' />
                        <h3 className={styles.item} style={{ minWidth: 52 }}>{ item.zip_code || "-" }</h3>
                    </div>
    
                    <div className={styles.date} style={{ marginLeft: shrink && 0 }}>
                        <h3 className={styles.item}>{ item.date || "-" }</h3>
                    </div>

                </div>
            ))
        )
    }, [load, isMobile])

    const unloads = useMemo(() => {
        return (
            unload.map(item => (
                <div id={styles.destinations}>
                    <div className={styles.place} style={{ width: shrink && '100%' }}>
                        <h3 className={styles.item} style={{ minWidth: 36 }}>
                                { 
                                    isMobile ? 
                                        item.country.alpha2Code || "-" : 
                                        shrink ? item.country.alpha2Code || "-" : item.country.name || "-" 
                                }
                        </h3>
                        <Divider type='vertical' />
                        {
                            isMobile ? 
                                <Tooltip title={item.city}>
                                    <h3 className={`${styles.item} ${styles.city}`}>{ item.city || "-" }</h3>
                                </Tooltip>
                                :
                                <h3 style={{ maxWidth: shrink && '50%' }} className={styles.item}>{ item.city || "-" }</h3>
                        }
                        <Divider type='vertical' />
                        <h3 className={styles.item} style={{ minWidth: 52 }}>{ item.zip_code || "-" }</h3>
                    </div>
    
                    <div className={styles.date} style={{ marginLeft: shrink && 0 }}>
                        <h3 className={styles.item}>{ item.date || "-" }</h3>
                    </div>

                </div>
            ))
        )
    }, [unload, isMobile])

    return(
        <div style={{ width: shrink ? containerWidth : '100%' }}>
            { loads }
            <Divider />
            { unloads }
        </div>
    )
}