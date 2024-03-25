import axios, { type AxiosError } from 'axios'
import { useState } from 'react'
import { useKickTemplate } from '../modules/kick-it/src'
import styles from './generate.module.css'

/**
 * Props for the SimpleTest component
 */
export interface SimpleTestProps {
    context?: string
    content: string
    children?: React.ReactNode // Optional child components
}

/**
 * This function generates the UI for setting constants, context, and contents, 
 * and handles the click event to trigger the generation process. It also 
 * displays the output and prompt messages.
 *
 * @param {GenerateProps} props - the properties for the Generate component
 * @return {JSX.Element} the UI for setting constants, context, and contents
 */
export function SimpleTest(props: SimpleTestProps) {
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
            ],
            contents: [
                props.content
            ],
            context: [
                props.context ?? ''
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
            setMarkdown(response.data/*.text*/) // Set the markdown with the response data
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
     * This component returns the following JSX element
     */
    return (
        <div className={styles.container}>
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
