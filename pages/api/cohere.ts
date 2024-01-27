import { NextApiRequest, NextApiResponse } from 'next'
import { useCohere, useKickTemplate } from '../../modules/kick-it/src'

export default async function cohere(request: NextApiRequest, response: NextApiResponse) {
    response.status(200).send(await useCohere(useKickTemplate(request.body)))
}