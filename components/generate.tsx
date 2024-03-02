import axios, { type AxiosError } from 'axios'
import { useState } from 'react'
import { useKickTemplate } from '../modules/kick-it/src'
import styles from './generate.module.css'

/**
 * Represents the state required by the Generate component.
 */
export interface GenerateState {
    context?: string  // The context in which generation is performed
    contents?: string // The content body for the generation process
    constants?: {     // A list of constants to be used in the generation
        key: string   // The key of the constant
        value: string // The value of the constant
    }[]
}

/**
 * Represents a preset configuration for the Generate component.
 */
export interface GeneratePreset {
    title: string        // The display title for the preset
    state: GenerateState // The pre-defined state for the preset
}

/**
 * Props for the Generate component, extending from GenerateState.
 */
export interface GenerateProps extends GenerateState {
    children?: React.ReactNode // Optional child components
    presets?: GeneratePreset[] // An array of presets for quick configuration
}

/**
 * This function generates the UI for setting constants, context, and contents, 
 * and handles the click event to trigger the generation process. It also 
 * displays the output and prompt messages.
 *
 * @param {GenerateProps} props - the properties for the Generate component
 * @return {JSX.Element} the UI for setting constants, context, and contents
 */
export default function Generate(props: GenerateProps) {
    // Define state using useState hook
    const [state, setState] = useState({
        // Initialize context with props.context, or empty string if props.context is null or undefined
        context: props.context ?? '',
        // Initialize contents with props.contents, or empty string if props.contents is null or undefined
        contents: props.contents ?? '',
        // Initialize constants with props.constants, or an empty array if props.constants is null or undefined
        constants: props.constants ?? [],
        // Initialize key with an empty string
        key: '',
        // Initialize value with an empty string
        value: ''
    })
    // Define pending state using useState hook
    const [pending, setPending] = useState(false)
    // Define markdown state using useState hook
    const [markdown, setMarkdown] = useState('')
    // Define prompt state using useState hook
    const [prompt, setPrompt] = useState('')

    /**
     * Handles the click event and performs a series of asynchronous operations.
     */
    async function handleClick() {
        // Set the pending state to true
        setPending(true)

        // Define a template using the useKickTemplate hook
        const templ = useKickTemplate({
            constants: [
                ...state.constants // Include state constants
            ],
            contents: [
                state.contents // Include state contents
            ],
            context: [
                state.context // Include state context
            ]
        })

        // Set the prompt using the template's makeSingle method
        setPrompt(templ.makeSingle())

        try {
            const options = {
                url: '/api/cohere', // Define the API endpoint
                method: 'POST',     // Specify the HTTP method
                data: templ         // Include the template data in the request
            }
            const response = await axios.request(options) // Send the request using axios
            setMarkdown(response.data.text) // Set the markdown with the response data
        }
        catch (ex) {
            const error = ex as AxiosError

            console.log(ex)

            // Set the markdown with the error message
            setMarkdown(`### Error
${error.message}

${error.response.data}
`)
        }
        finally {
            setPending(false)
        }
    }

    /**
     * Function to add a constant to the state.
     */
    const addConstant = () => {
        // Update state with new constants
        setState({
            ...state,
            constants: [
                ...state.constants,
                {
                    key: state.key,    // New constant key
                    value: state.value // New constant value
                }
            ],
            key: '',  // Reset key
            value: '' // Reset value
        })
    }

    // Define an array of presets
    const presets = [
        // Define the first preset with title '⚫' and state object with empty constants, contents, and context
        {
            title: '⚫',
            state: {
                constants: [],
                contents: '',
                context: '',
            }
        },
        // Define the second preset with title '⬛' and state object with empty constants
        {
            title: '⬛',
            state: {
                constants: [],
            }
        },
        // Spread the presets from props if it exists, otherwise use an empty array
        ...(props.presets ?? [])
    ]

    /**
     * This component returns the following JSX element
     */
    return (
        <div className={styles.container}>
            {/* Render buttons based on presets */}
            <div>
                {presets.map((x, i) =>
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
            {/* Display Constants section */}
            <h2>Constants</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th colSpan={2}>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Map through constants and display each in a table row */}
                    {state.constants.map((c, i) => (
                        <tr key={i}>
                            <td>{c.key}</td>
                            <td colSpan={2}>{c.value}</td>
                        </tr>
                    ))}
                    {/* Input fields to add new constants */}
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
            {/* Display Context section */}
            <h2>Context</h2>
            <textarea
                className={styles.txt}
                value={state.context}
                onChange={(event) => setState({
                    ...state,
                    context: event.target.value
                })}
            />
            {/* Display Content section */}
            <h2>Content</h2>
            <textarea
                className={styles.txt}
                value={state.contents}
                onChange={(event) => setState({
                    ...state,
                    contents: event.target.value
                })}
            />
            {/* Button to trigger handleClick function */}
            <button onClick={handleClick} className={styles.btnGenerate} disabled={pending}>
                {props.children ?? 'Generate'}
            </button>
            {/* Render output based on markdown */}
            <div className={styles.output}>
                {markdown.split('\n').map((x, i) => <p key={i}>{x}</p>)}
            </div>
            {/* Render prompt based on prompt */}
            <div className={styles.prompt}>
                {prompt.split('\n').map((x, i) => <p key={i}>{x}</p>)}
            </div>
        </div>
    )
}
