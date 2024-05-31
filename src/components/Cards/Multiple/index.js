import React, { useMemo } from 'react'

// UI
import { Collapse } from 'antd'
import styles from '../card.module.css'
import { colors } from '../../../styles/colors'

const { Panel } = Collapse;

export default function Multiple({ text = "", color="purple", Icon, data = [], collapsed = false, }){

    // Methods
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const cardIcon = useMemo(() => {
        return(
            <div
                className={styles.multipleIcon} 
                style={{ backgroundColor: colors[`light${capitalize(color)}`] }}
            >
                <Icon style={{ color: colors[color] }} />
            </div>
        )
    }, [color])


    return(
        <Collapse
            bordered={false}
            className="site-collapse-custom-collapse-multiple"
            expandIconPosition="right"
            defaultActiveKey={['opened']}
        >
            <Panel 
                header={text}
                key={collapsed ? 'collapsed' : 'opened'}
                className="site-collapse-custom-panel-multiple"
                extra={cardIcon}
            >
                <div 
                    id={styles.multiple}
                >
                    {/* Main text */}
                    {
                        data.map((item, index) => (
                            <h5 key={index} className={styles.subtext}>
                                { item }
                            </h5>
                        ))
                    }
                </div>
            </Panel>
        </Collapse>
    )
}