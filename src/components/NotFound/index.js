import React from 'react'
import { useHistory } from 'react-router-dom'

// UI
import { Empty, Button } from 'antd'

// Icons
import NotFoundIcon from '../../assets/icons/not_found.png'
import EmptyIcon from '../../assets/images/empty.png'
import Translate from '../../Translate'

export default function NotFound({ text, withBackButton = true }){

    // Variables
    const history = useHistory()

    // Methods
    function handleOnBack() {
        history.goBack()
    }

    return(
        <div
            id="notFound"
            style={{ 
                width: '100%', 
                height: 'max-content',
                marginTop: 40, 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
            <Empty
                image={EmptyIcon}
                imageStyle={{ height: 160 }}
                description={text}
            >
                {
                    withBackButton && 
                        <Button 
                            type="primary"
                            onClick={handleOnBack}
                        >
                            <Translate textKey={"back"} />
                        </Button>
                }
            </Empty>
        </div>
    )
}