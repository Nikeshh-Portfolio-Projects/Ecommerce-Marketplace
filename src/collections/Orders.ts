import { Access, CollectionConfig } from 'payload/types'

const yourOwn: Access = ({ req }) => {
  const { user } = req;
  if (user) {
    if (user.role === 'admin') return true

    return {
      user: {
        equals: user?.id,
      },
    }
  }
  return false;
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'Your Orders',
    description:
      'A summary of all your orders on DigitalHippo.',
  },
  access: {
    read: yourOwn,
    update: ({ req }) => req.user && req.user.role === 'admin',
    delete: ({ req }) => req.user && req.user.role === 'admin',
    create: ({ req }) => req.user && req.user.role === 'admin',
  },
  fields: [
    {
      name: '_isPaid',
      type: 'checkbox',
      access: {
        read: ({ req }) => req.user && req.user.role === 'admin',
        create: () => false,
        update: () => false,
      },
      admin: {
        hidden: true,
      },
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      admin: {
        hidden: true,
      },
      relationTo: 'users',
      required: true,
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      hasMany: true,
    },
  ],
}
