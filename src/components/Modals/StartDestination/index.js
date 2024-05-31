import React, { useState } from 'react'

// UI
import { Modal } from 'antd'
import styles from '../modal.module.css'
import Number from '../../Tags/Number'
import { colors } from '../../../styles/colors';

export default function StartDestination(){

    // Variables
    const [isModalVisible, setIsModalVisible] = useState(true);

    function showModal() {
        setIsModalVisible(true)
    }

    function handleOk() {
        setIsModalVisible(false);
    };

    function handleCancel()  {
        setIsModalVisible(false);
    };

    return(
        <Modal 
            visible={isModalVisible} 
            onOk={handleOk} 
            onCancel={handleCancel}
            closable={false}
            footer={null}
            width={640}
        >
            <div id={styles.startDestination}>
                {/* Header */}
                <div className={styles.header}>
                    <h4 className={styles.title}>Polazišta</h4>
                    <Number count={5} color="blue" />
                </div>

                {
                    [1,2,3].map(item => (
                        <div className={styles.item}>
                            <h4 className={styles.itemTitle}><Translate textKey="departure" /> {" " + item }</h4>
                            <div className={styles.infoWrapper}>
                                <p className={styles.info} style={{ color: colors.purple }}>Austrija -&nbsp;</p>
                                <p className={styles.info}>Salzburg -&nbsp;</p>
                                <p className={styles.info}>34500</p>
                            </div>
                        </div>
                    ))
                }
                
            </div>
        </Modal>
    )
}