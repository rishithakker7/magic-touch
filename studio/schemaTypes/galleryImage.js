export const galleryImage = {
  name: 'galleryImage',
  title: 'Gallery Photo',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Jewellery Photograph',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Piece Name / Title',
      type: 'string',
      description: 'e.g., Noor Pearl Linear Drops or Filigree Jhumkas',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Earrings', value: 'Earrings' },
          { title: 'Necklaces', value: 'Necklaces' },
          { title: 'Bangles', value: 'Bangles' },
          { title: 'Rings', value: 'Rings' },
          { title: 'Bridal & Sets', value: 'Bridal & Sets' },
        ],
        layout: 'radio',
      },
      initialValue: 'Earrings',
    },
    {
      name: 'caption',
      title: 'Short Finish / Material Note (Optional)',
      type: 'string',
      description: 'e.g., Water-resistant 18k gold-tone anti-tarnish finish',
    },
    {
      name: 'alt',
      title: 'Accessibility Description (Optional)',
      type: 'string',
    },
    {
      name: 'featured',
      title: 'Feature on Homepage Lookbook?',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'order',
      title: 'Display Order (lower number shows first)',
      type: 'number',
      initialValue: 10,
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'image',
    },
  },
}
