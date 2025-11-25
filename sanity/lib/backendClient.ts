import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const backendClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Always false for write operations
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_API_READ_TOKEN,
})
