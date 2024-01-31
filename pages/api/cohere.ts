import { NextApiRequest, NextApiResponse } from 'next'
import { useCohere, useKickTemplate } from '../../modules/kick-it/src'
import { AxiosError } from 'axios'

export default async function cohere(request: NextApiRequest, response: NextApiResponse) {
    try {
        response.status(200).send(await useCohere(useKickTemplate(request.body)))
    }
    catch (error) {
        console.error('An error occurred:', error)
        response.status(500).send(error)
    }
}
