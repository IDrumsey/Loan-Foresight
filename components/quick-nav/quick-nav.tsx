import styles from './quick-nav.module.scss'

import { Button } from '@mantine/core'
import { GoSettings } from 'react-icons/go'
import { IoMdLogIn, IoMdLogOut } from 'react-icons/io'
import { useState } from 'react'

interface Props {

}

const QuickNav = ({

}: Props) => {


    const setGraphConfigDrawerOpen = (toggleState: boolean) => {
        console.log(toggleState)
    }


    const [loggedIn, loggedInSetter] = useState(false)


    function login() {
        loggedInSetter(true)
    }

    function logout() {
        loggedInSetter(false)
    }

    return (
        <>
        <div id={`${styles['quick-nav']}`}>


            {
                !loggedIn ? 

                <IoMdLogIn 
                    className={`${styles['quick-nav-icon-button']}`}
                    onClick={() => login()}
                />

                :

                <IoMdLogOut 
                    className={`${styles['quick-nav-icon-button']}`}
                    onClick={() => logout()}
                />
            }



            {/* button to open the graph configuration drawer */}
            <GoSettings
                className={`${styles['quick-nav-icon-button']}`}

                // https://stackoverflow.com/a/59304431/17712310
                onClick={() => setGraphConfigDrawerOpen(true)}
            />



            
        </div>
        </>
    )
}

export default QuickNav