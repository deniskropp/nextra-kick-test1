// Example from https://beta.reactjs.org/learn

import { useEffect, useState } from 'react'
import styles from './generate.module.css'

function MyButton() {
    const [ markdown, setMarkdown ] = useState('')

    function handleClick() {
        setMarkdown('markdown')
        console.log(markdown)
    }

    return (
        <div>
            <button onClick={handleClick} className={styles.btnGenerate}>
                Generate
            </button>
            <hr />
            <pre className={styles.preMarkdown}>{markdown}</pre>
        </div>
    )
}

export default function Generate() {
    return <MyButton />
}
