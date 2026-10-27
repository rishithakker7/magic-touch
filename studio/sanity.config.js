import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'magic-touch-gallery-cms',
  title: 'Magic Touch — Gallery Photo Manager',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'de3b08ka',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})
