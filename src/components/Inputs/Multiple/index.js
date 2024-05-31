import React, { useEffect, useRef, useMemo, useState } from 'react'
import { useToggle } from 'react-use'

// UI
import { motion, AnimatePresence } from "framer-motion"
import styles from '../input.module.css'
import arrow from '../../../assets/icons/arrow.png'
import { colors } from '../../../styles/colors'
import Tag from '../../Tags/Basic'
import Plus from '../../Buttons/Plus'
import { Remove } from '../../Buttons/Premade'

export default function Multiple({ label = "", placeholder = "", icon, value = [], tag = "", name = "", type = "text", inForm = false, width = '100%', onAdd, onRemove }){

    // Variables
    const inputRef = useRef(null)
    const [scrollPosition, setScrollPosition] = useState(0)
    const [formVisible, toggleFormVisible] = useToggle(false)
    const [enteredValue, setEnteredValue] = useState("")

    // Methods
    useEffect(() => {
        if(formVisible){
            function getOffset(element) {
                let rect = element.getBoundingClientRect();
                return {
                    left: rect.left + window.scrollX,
                    top: rect.top + window.scrollY
                };
            }
            setScrollPosition(getOffset(inputRef.current).top)
        }
    }, [formVisible])

    function handleOnFocus(){
        window.scrollTo({
            top: scrollPosition - 100,
            left: 0,
            behavior: 'smooth'
        });
    }

    function handleOnChange(e){
        setEnteredValue(e.target.value)
    }

    function handleOnAdd() {
        onAdd(name, enteredValue)
        setEnteredValue("")
        inputRef.current.focus()
    }

    function onEnter(e) {
        if(e.nativeEvent.code === 'Enter'){
            handleOnAdd()
        }
    }


    const formClosed = useMemo(() => {

        const activeStyles = { 
            transform: value.length && `translateY(${-30}px)`,
            color: value.length ? 
                colors.purple : 
                ( inForm ? '#bfbfbf' : colors.grey)
        };

        return(
            <div className={styles.flexRow}>
                <p 
                    className={styles.multipleLabel}
                    style={activeStyles}
                >
                    { label }
                </p>
                {
                    value.length ? 
                        <p className={styles.multipleLabelCount}>
                            Dodana su 
                            <span style={{ color: colors.purple }}> {value.length} </span>
                            { tag }
                        </p>
                        :
                        null
                }
                <Plus onClick={toggleFormVisible} size="small"/>
            </div>
        )
    }, [label, value, tag, toggleFormVisible, inForm])


    const valuesList = useMemo(() => {

        function handleOnRemove(item) {
            onRemove(name, item)
        }

        return(
            <div className={styles.values}>
                {
                    value.map(item => (
                        <motion.div
                            key={item}
                            initial={{ x: -10 }}
                            animate={{ x: 0 }}
                            exit={{ x: -10 }}
                            transition={{ duration: .15 }}
                            className={styles.flexRow}
                        >
                            <p className={styles.value}>- { item }</p>
                            <Remove size="small" onClick={() => handleOnRemove(item)} />
                        </motion.div>
                    ))
                }
            </div>
        )
    }, [value, name, onRemove])


    // Styles
    const inputStyle = {
        borderColor: inForm ? 
            (formVisible ? 'transparent' : colors.lightGrey) : 
            (formVisible ? 'transparent' : '#d9d9d9'), 
        padding: formVisible ? '14px 0' : 10,
        height: formVisible ? 'max-content' :  48,
        width
    }

    return(
        <div id={styles.multiple}>
            {/* Input mockup */}
            <div 
                className={styles.inputMockup}
                style={inputStyle}
            >
                {/* Form */}
                <AnimatePresence>
                    {formVisible ? 
                        <motion.div
                            // onClick={toggleFormVisible}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={wrapper}
                            transition={{ delay: .15 }}
                            className={styles.formWrapper}
                        >
                            <div className={styles.formDiv}>
                                <motion.div
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    exit={{ y: 20 }}
                                    transition={{ duration: .25, delay: .15 }}
                                >
                                    <img className={styles.formIcon} src={icon} alt="Folder icon"/>
                                </motion.div>

                                <motion.div
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    exit={{ y: 20 }}
                                    transition={{ duration: .25, delay: .2 }}
                                    style={{ flex: 1 }}
                                >
                                    <Tag text={`${value.length} ${tag}`} color="purple" />
                                </motion.div>

                                <motion.div
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    exit={{ y: 20 }}
                                    transition={{ duration: .25, delay: .25 }}
                                >
                                    <Plus size="small" onClick={handleOnAdd}/>
                                </motion.div>

                                <motion.div
                                    onClick={toggleFormVisible}
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    exit={{ y: 20 }}
                                    transition={{ duration: .25, delay: .3 }}
                                >
                                    <img className={styles.collapseArrow} src={arrow} alt="Folder icon"/>
                                </motion.div>
                            </div>

                            {/* Listing values */}
                            { valuesList }

                            <input  
                                className={styles.formInput}
                                placeholder={placeholder}
                                value={enteredValue}
                                onChange={handleOnChange}
                                onKeyPress={onEnter}
                                name={name}
                                type={type}
                                ref={inputRef}
                                onFocus={handleOnFocus}
                            />
                            
                        </motion.div>
                        :
                        formClosed
                    }
                </AnimatePresence>
            </div>
            
        </div>
    )
}

const wrapper = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
}