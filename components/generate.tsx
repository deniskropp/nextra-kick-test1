// Example from https://beta.reactjs.org/learn

import { useEffect, useState } from 'react'
import styles from './generate.module.css'
import { useConfig } from 'nextra-theme-docs'

import { useCohere, useKickTemplate } from '../modules/kick-it/src'
import type { KickTemplate } from '../modules/kick-it/src'

function MyButton() {
    const [ markdown, setMarkdown ] = useState('')
    const config = useConfig()

    useEffect(() => {
    })

    async function handleClick() {
        const templ: KickTemplate = useKickTemplate({
            constants: [
                {
                    key: 'name',
                    value: 'John Moe'
                }
            ],
            contents: [
                'Hello, {name}!'
            ]
        })

        const result = await useCohere(templ)

        setMarkdown(result)
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

interface Props {
    children?: React.ReactNode
}

export default function Generate(props: Props) {
    console.log(props)
    return <MyButton />
}
