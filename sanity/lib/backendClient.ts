import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const backendClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Always false for write operations
  token: process.env.SANITY_API_TOKEN,
})

// Runtime validation helper - only runs on server-side when actually used
export function validateBackendClient() {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error(
      'SANITY_API_TOKEN is not set! Backend operations requiring write permissions will fail.\n' +
      'Please create a token with Editor or Administrator permissions in your Sanity dashboard\n' +
      'and add it to your .env file as SANITY_API_TOKEN=your_token_here'
    );
  }
}
