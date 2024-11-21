export default {
  paths: {
    '/auth/register': {
      post: {

        tags: ['Onboarding'],
        description: 'Register',
        operationId: 'registration',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Registration',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'A redirect link is sent returned, redirect the client to that link',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/auth/login': {
      post: {

        tags: ['Onboarding'],
        description: 'Login',
        operationId: 'login',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Login',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'A token is generated, redirect the client to that link',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/auth/verify-email-password-reset': {
      post: {

        tags: ['Forgot password'],
        description: 'Link sent to verify user email to initiate password reset',
        operationId: 'forgotPasswordEmailVerificatgion',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/EmailOnly',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Email is sent to the mailbox user registerd with to initiate password reset',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/auth/update-password': {
      post: {

        tags: ['Forgot password'],
        description: 'Users can update password when their mail has been verified',
        operationId: 'forgotPasswordUpdatePAssword',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Login',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Password reset sucessful',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },

    '/resume/initialize': {
      post: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['Data collection'],
        description: 'Create an empty resume object',
        operationId: 'Initializeresume',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/EmptyObject',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Resume header created',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/resume/header': {
      post: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['Data collection'],
        description: 'Header Section',
        operationId: 'header section',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ResumeHeader',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Resume header created',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/resume/experiences': {
      post: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['Data collection'],
        description: 'Experience Section',
        operationId: 'experince section',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ExperienceSection',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Resume experience created',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/resume/responsibilities': {
      post: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['Data collection'],
        description: 'Responsibilities Section',
        operationId: 'resp section',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ResponsibilitiesSection',
              },
            },
          }, 
        },
        responses: {
          201: {
            description: 'Resume responsibilities created',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    
    '/resume/education': {
      post: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['Data collection'],
        description: 'Education Section',
        operationId: 'education section',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SchoolSection',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Resume education created',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/resume/get/core/tools ': {
      post: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['Data collection'],
        description: 'Core tools',
        operationId: 'core tools recommendation',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ResumeIdOnly',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Resume tools recommendations',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    // @ts-ignore
    '/resume/core/tools': {
      post: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['Data collection'],
        description: 'Core tools addition',
        operationId: 'core tools addition',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SkillsAndToolsSection',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Resume tools addition',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },

    '/resume/get/core/skills': {
      post: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['Data collection'],
        description: 'Core skills',
        operationId: 'core skills recommendation',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ResumeIdOnly',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Resume skills recommendations',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    // @ts-ignore
    '/resume/core/skills': {
      post: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['Data collection'],
        description: 'Core skills',
        operationId: 'core skills recommendation',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SkillsAndToolsSection',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Resume skills update',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/resume/get/career-summary': {
      post: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['Data collection'],
        description: 'Career summary recommendation',
        operationId: 'career summary recommendation',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ResumeIdOnly',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Resume skills update',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/resume/career-summary': {
      post: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['Data collection'],
        description: 'Career summary',
        operationId: 'career summary adding',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CareerSummarySection',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Resume skills update',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },

    '/auth/google/onboard': {
      get: {

        tags: ['Google'],
        description: 'Register and or authenticate users using google auth',
        operationId: 'googleauth',

        responses: {
          200: {
            description: 'A redirect link is generated',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },


    '/profile/fetch': {
      get: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['User Profile'],
        description: 'get user profile',
        operationId: 'get user state',

        responses: {
          200: {
            description: 'User profile fetched',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },


    '/metrics/loguser': {
      get: {
        tags: ['Metrics'],
        description: 'Log users metrics',
        operationId: 'logusersmetrics',


        responses: {
          200: {
            description: 'User logged ',
          },
          500: {
            description: 'User already logged',
          },
        },
      },
    },
    '/metrics/getlogs': {
      get: {
        tags: ['Metrics'],
        description: 'Log users metrics',
        operationId: 'logusersmetrics',
        parameters: [
          {
            in: 'query',
            name: 'day',
            schema: {
              type: 'string',
            },
            required: false,
            description: 'Get a specific day e.g 3 means the third day of every month TIP: Add the month query to get for the exact day and month',
          },
          {
            in: 'query',
            name: 'month',
            schema: {
              type: 'string',
            },
            required: false,
            description: 'If supplied get the log for a particular month e.g november will get all the users that visited in november',
          },
          {
            in: 'query',
            name: 'year',
            schema: {
              type: 'string',
            },
            required: false,
            description: 'If supplied the get metrics for that year',
          },
          {
            in: 'query',
            name: 'recentdays',
            schema: {
              type: 'string',
            },
            required: false,
            description: 'Get recent visits, e.g 1 will get the visits in the last 24hrs and 2 will get for the last 48 hrs',
          },
        ],

        responses: {
          200: {
            description: 'A list of users',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
  },
}
