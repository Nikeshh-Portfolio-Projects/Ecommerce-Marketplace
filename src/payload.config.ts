import { mongooseAdapter } from '@payloadcms/db-mongodb'
// import { payloadCloud } from '@payloadcms/plugin-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload/config'
import { fileURLToPath } from 'url'
import { Users } from '@/collections/Users'
import { Products } from '@/collections/Products/Products'
import { Media } from '@/collections/Media'
import { ProductFiles } from '@/collections/ProductFile'
import { Orders } from '@/collections/Orders'
import { resendAdapter } from '@payloadcms/email-resend'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Ecommerce Marketplace',
      favicon: '/favicon.ico',
      ogImage: '/thumbnail.jpg',
    },
  },
  routes: {
    admin: "/admin"
  },
  collections: [Users, Products, Media, ProductFiles, Orders], 
  editor: lexicalEditor({}),
  // plugins: [payloadCloud()], // TODO: Re-enable when cloud supports 3.0
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  email: resendAdapter({
    defaultFromAddress: 'admin@nikeshh.com',
    defaultFromName: 'Nikeshh',
    apiKey: process.env.RESEND_API_KEY || '',
  }),

  // Sharp is now an optional dependency -
  // if you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.

  // This is temporary - we may make an adapter pattern
  // for this before reaching 3.0 stable

  // sharp,
})
