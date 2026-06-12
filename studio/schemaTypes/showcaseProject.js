export default {
  name: 'showcaseProject',
  title: 'Showcase Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'url',
      title: 'Project URL',
      type: 'url',
      validation: Rule => Rule.required()
    },
    {
      name: 'author',
      title: 'Author Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'authorUrl',
      title: 'Author Portfolio/Website URL',
      type: 'url'
    },
    {
      name: 'contactEmail',
      title: 'Author Contact Email (Private)',
      type: 'string',
      description: 'Used for automated approval notifications. This is NOT public.'
    },
    {
      name: 'image',
      title: 'Project Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'socials',
      title: 'Author Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'X (Twitter)', value: 'x' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'GitHub', value: 'github' },
                  { title: 'Dribbble', value: 'dribbble' }
                ]
              }
            },
            {
              name: 'url',
              title: 'Profile URL',
              type: 'url'
            }
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url'
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'image'
    },
    prepare(selection) {
      const {author} = selection
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`
      })
    }
  }
}
