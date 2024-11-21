export default {
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: "JWT"
      }
    },
    name: {
      type: 'string',
      description: 'Lastname and Firstname',
      example: "John Not-Doe",
    },
    username: {
      type: 'string',
      description: 'admin username',
      example: "admin@admin",
    },
    oldUsername: {
      type: 'string',
      description: 'former admin username',
      example: "admin@admin",
    },
    newUsername: {
      type: 'string',
      description: 'new admin username',
      example: "admin@admin",
    },
    newPassword: {
      type: 'string',
      description: 'new admin password',
      example: "admin_secret",
    },
    otp: {
      type: 'number',
      description: 'otp from email',
      example: 567098,
    },
    email: {
      type: 'string',
      description: 'Valid email to receive verification mail',
      example: "usevalid_email@gmail.com",
    },
    withdrawalOwnerEmail: {
      type: 'string',
      description: 'Email of the owner of the withdrawal object',
      example: "usevalid_email@gmail.com",
    },
    id: {
      type: 'string',
      description: 'The withdrawal _id',
      example: "6098xxxxxxxxxxxxxx",
    },
    status: {
      type: 'string',
      description: 'Status of the withdrawal must be either Approved or Failed',
      example: "Approved",
    },
    password: {
      type: 'string',
      description: 'Minimum of 8 chars password',
      example: "securepass",
    },
    amount: {
      type: 'number',
      description: 'The amount we are charging for the course',
      example: 500,
    },
    description: {
      type: 'string',
      description: 'A code for the program being subscribed for',
      example: "_WebDevIntro",
    },
    studentAnswer: {
      type: 'string',
      description: 'The answer the user submits',
      example: "<p>This is a paragraph tag</p>",
    },
    bankName:{
      type:'string',
      description:'The name of the bank users wants to receive funds',
      example:'Heritage Bank'
    },
    accountName:{
      type:'string',
      description:'The name of the account users wants to receive funds',
      example:'Johnny Doe'
    },
    lastName:{
      type:'string',
      description:'The last name of user',
      example:'Doe'
    },
    firstName:{
      type:'string',
      description:'The first name of user',
      example:'Johnny'
    },
    city:{
      type:'string',
      description:'A valid city',
      example:'Lisbon'
    },
    country:{
      type:'string',
      description:'A valid country',
      example:'Portugal'
    },
    profession:{
      type:'string',
      description:'User profession',
      example:'Plumber'
    },
    address:{
      type:'string',
      description:'A valid address',
      example:'xyz street, Lisbon'
    },
    phoneNumber:{
      type:'string',
      description:'A valid phone number',
      example:'090883590324'
    },
    publicEmail:{
      type:'string',
      description:'The email to appear on Resume',
      example:'xyz@gmail.com'
    },
    jobTitle:{
      type:'string',
      description:'Job title',
      example:'lead plumber'
    },
    accountNumber:{
      type:'string',
      description:'The bank account number users wants to receive funds',
      example:'1234XXXXXXXX'
    },
    resumeId:{
      type:'string',
      description:'The resume _id to be edited',
      example:"66489cd996c6126d3a5affb6"
    },
    jobExperienceId:{
      type:'string',
      description:'The jobExperience _id to be updated',
      example:"66489cd996c6126d3a5affb6"
    },
//     "startDate": "2022-01-01",
//       "endDate": "2023-01-01",
//       "currentlyWorking": false
// }
    company:{
      type:'string',
      description:'a valid company',
      example:"Sygen"
    },
    startDate:{
      type:'string',
      description:'A valid date',
      example:"2022-01-01"
    },
    endDate:{
      type:'string',
      description:'A valid date',
      example:"2022-01-01"
    },
    currentlyWorking:{
      type:'boolean',
      description:'Is user still working at the company',
      example:true
    },
    userResponsibilities:{
      type:'array',
      description:"an array of strings containing responsibilities",
      example:['responsibility 1', 'responsibility 2']
    },
    toolsAndSkillsPayload:{
      type:'array',
      description:"an array of strings containing tools or skills",
      example:['skill', 'skill 1']
    },
    careerSummary:{
      type:'string',
      description:'Career Summary',
      example:"Accomplished Backend Developer with 2 years of experience, exceptional security expertise and proficiency in various security tools."
    },
    
      schoolName: {
        type: 'string',
        description: 'Name of the school',
        example: 'Harvard University'
      },
      schoolLocation: {
        type: 'string',
        description: 'Location of the school',
        example: 'Cambridge, MA'
      },
      degreeType: {
        type: 'string',
        description: 'Type of degree obtained',
        example: 'Bachelor of Science'
      },
      studyField: {
        type: 'string',
        description: 'Field of study',
        example: 'Computer Science'
      },
      graduationDate: {
        type: 'string',
        description: 'Date of graduation',
        example: '2024-05-19'
      },
      stillEnrolled: {
        type: 'boolean',
        description: 'Whether the person is still enrolled',
        example: false
      },
    bankInformation:{
      type:'object',
      example:{
        accountNumber:"1234XXXXX",
        accountName:"John Doe",
        bankName:"Heritage Bank",
      }
    }
    
    ,

    schemas: {
      Login: {
        type: 'object',
        properties: {
          email: {
            $ref: '#/components/email',
          },
          password: {
            $ref: '#/components/password',
          },
        },
      },
      Registration: {
        type: 'object',
        properties: {
          name: {
            $ref: '#/components/name',
          },
          email: {
            $ref: '#/components/email',
          },
          password: {
            $ref: '#/components/password',
          },
        },
      },
      EmailOnly: {
        type: 'object', 
        properties: {
          email: {
            $ref: '#/components/email',
          }
        },
      },
      EmptyObject: {
        type: 'object',
        properties: {
          
        },
      },
      ResumeHeader: {
        type: 'object',
        properties: {
          lastName: {
            $ref: '#/components/lastName',
          },
          firstName: {
            $ref: '#/components/firstName',
          },
          
          city: {
            $ref: '#/components/city',
          },
          
          country: {
            $ref: '#/components/country',
          },
          
          profession: {
            $ref: '#/components/profession',
          },
          address: {
            $ref: '#/components/address',
          },
          phoneNumber: {
            $ref: '#/components/phoneNumber',
          },
          resumeId: {
            $ref: '#/components/resumeId',
          },
          publicEmail: {
            $ref: '#/components/publicEmail',
          },
        },
      },
      ExperienceSection: {
        type: 'object',
        properties: {
            jobTitle: {
                $ref: '#/components/jobTitle',
            },
            resumeId: {
                $ref: '#/components/resumeId',
            },
            city: {
                $ref: '#/components/city',
            },
            country: {
                $ref: '#/components/country',
            },
            company: {
                $ref: '#/components/company',
            },
            startDate: {
                $ref: '#/components/startDate',
            },
            endDate: {
                $ref: '#/components/endDate',
            },
            currentlyWorking: {
                $ref: '#/components/currentlyWorking',
            },
        },
      }, 
      ResponsibilitiesSection: {
        type: 'object',
        properties: {
            resumeId: {
                $ref: '#/components/resumeId',
            },
            jobExperienceId: {
              $ref: '#/components/jobExperienceId',
            },
            userResponsibilities: {
              $ref: '#/components/userResponsibilities',
            },
            
        },
      },


      
      SchoolSection: {
        type: 'object',
        properties: {
          resumeId: {
            $ref: '#/components/resumeId',
          },
          schoolName: {
              $ref: '#/components/schoolName',
          },
            schoolLocation: {
                $ref: '#/components/schoolLocation',
            },
            degreeType: {
                $ref: '#/components/degreeType',
            },
            studyField: {
                $ref: '#/components/studyField',
            },
            startDate: {
                $ref: '#/components/startDate',
            },
            graduationDate: {
                $ref: '#/components/graduationDate',
            },
            stillEnrolled: {
                $ref: '#/components/stillEnrolled',
            },
        },
      },
      
      

      ResumeIdOnly: {
        type: 'object',
        properties: {
          resumeId: {
            $ref: '#/components/resumeId',
          }
        },
      },
      SkillsAndToolsSection: {
        type: 'object',
        properties: {
          resumeId: {
            $ref: '#/components/resumeId',
          },
          payload: {
            $ref: '#/components/toolsAndSkillsPayload',
          }
        },
      },
      CareerSummarySection: {
        type: 'object',
        properties: {
          resumeId: {
            $ref: '#/components/resumeId',
          },
          careerSummary: {
            $ref: '#/components/careerSummary',
          }
        },
      },
    },
  },
};
