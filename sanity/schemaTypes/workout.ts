import { defineType, defineField } from 'sanity'

export const workout = defineType({
  name: 'workout',
  title: 'Workout',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'Clerk user ID',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    }),
    defineField({
      name: 'exercises',
      title: 'Exercises',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'workoutExercise',
          title: 'Workout Exercise',
          fields: [
            defineField({
              name: 'exercise',
              title: 'Exercise',
              type: 'reference',
              to: [{ type: 'exercise' }],
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'sets',
              title: 'Sets',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'set',
                  title: 'Set',
                  fields: [
                    defineField({
                      name: 'reps',
                      title: 'Reps',
                      type: 'number',
                      validation: Rule => Rule.required().min(1)
                    }),
                    defineField({
                      name: 'weight',
                      title: 'Weight',
                      type: 'number',
                      validation: Rule => Rule.required().min(0)
                    }),
                    defineField({
                      name: 'weightUnit',
                      title: 'Weight Unit',
                      type: 'string',
                      options: {
                        list: ['kg', 'lbs']
                      },
                      initialValue: 'kg',
                      validation: Rule => Rule.required()
                    })
                  ],
                  preview: {
                    select: {
                      reps: 'reps',
                      weight: 'weight',
                      weightUnit: 'weightUnit'
                    },
                    prepare(selection) {
                      const { reps, weight, weightUnit } = selection
                      return {
                        title: `${reps} reps`,
                        subtitle: `${weight} ${weightUnit}`
                      }
                    }
                  }
                }
              ],
              validation: Rule => Rule.required().min(1)
            })
          ],
          preview: {
            select: {
              title: 'exercise.name',
              sets: 'sets'
            },
            prepare(selection) {
              const { title, sets } = selection
              return {
                title: title,
                subtitle: `${sets.length} sets`
              }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    })
  ]
})
