import axios from 'axios'
import { useState } from 'react'
import styles from './generate.module.css'

import { useKickTemplate } from '../modules/kick-it/src'
import type { KickTemplate } from '../modules/kick-it/src'

interface State {
    context?: string
    contents?: string
    constants?: { key: string, value: string }[]
}

interface Preset {
    title: string
    state: State
}

interface Props extends State {
    children?: React.ReactNode
    presets?: Preset[]
}

export default function Generate(props: Props) {
    const [state, setState] = useState({
        context: props.context ?? '',
        contents: props.contents ?? '',
        constants: props.constants ?? [],
        key: '',
        value: ''
    })
    const [markdown, setMarkdown] = useState('')
    const [prompt, setPrompt] = useState('')

    async function handleClick() {
        const templ: KickTemplate = useKickTemplate({
            constants: [
                ...state.constants,
            ],
            contents: [
                state.contents
            ],
            context: [
                state.context
            ]
        })

        setPrompt(templ.makeSingle())

        try {
            const options = {
                url: '/api/cohere',
                method: 'POST',
                data: templ
            }
            const response = await axios.request(options)
            setMarkdown(response.data)
        }
        catch (ex) {
            setMarkdown(ex.toString())
        }
    }

    const addConstant = () => {
        setState({
            ...state,
            constants: [
                ...state.constants,
                {
                    key: state.key,
                    value: state.value
                }
            ],
            key: '',
            value: ''
        })
    }

    const pre = [
        {
            title: '⚫',
            state: {
                constants: [],
                contents: '',
                context: '',
            }
        },
        {
            title: '⬛',
            state: {
                constants: [],
            }
        },
        ...(props.presets ?? [])
    ]

    return (
        <div className={styles.container}>
            <div>
                {pre.map((x, i) =>
                    <button
                        className={styles.btnGenerate}
                        key={i}
                        onClick={() => setState({
                            ...state,
                            ...x.state,
                        })}
                    >
                        {x.title}
                    </button>
                )}
            </div>
            <h2>Constants</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th colSpan={2}>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {state.constants.map((c, i) => (
                        <tr key={i}>
                            <td>{c.key}</td>
                            <td colSpan={2}>{c.value}</td>
                        </tr>))
                    }
                    <tr>
                        <td>
                            <input
                                value={state.key}
                                onChange={(event) => setState({
                                    ...state,
                                    key: event.target.value
                                })}
                            />
                        </td>
                        <td>
                            <input
                                value={state.value}
                                onChange={(event) => setState({
                                    ...state,
                                    value: event.target.value
                                })}
                            />
                        </td>
                        <td>
                            <button onClick={addConstant}>➕</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <h2>Context</h2>
            <textarea
                className={styles.txt}
                value={state.context}
                onChange={(event) => setState({
                    ...state,
                    context: event.target.value
                })}
            />
            <h2>Content</h2>
            <textarea
                className={styles.txt}
                value={state.contents}
                onChange={(event) => setState({
                    ...state,
                    contents: event.target.value
                })}
            />
            <button onClick={handleClick} className={styles.btnGenerate}>
                {props.children ?? 'Generate'}
            </button>
            <div className={styles.output}>
                {markdown.split('\n').map((x, i) => <p key={i}>{x}</p>)}
            </div>
            <div className={styles.prompt}>
                {prompt.split('\n').map((x, i) => <p key={i}>{x}</p>)}
            </div>
        </div>
    )
}
