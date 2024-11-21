import mongoose, { Schema, model, Document } from 'mongoose';


//INTERFACES


interface IResponsibility extends Document {
  jobTitle: string;
  responsibilities: string[]; 
}


interface IRawResponsibility extends Document {
  jobTitle: string;
  responsibilities: string[]; 
}



interface IRawCareerSummary extends Document {
  jobTitle: string;
  careerSummary: string[]; 
}


interface IResume extends Document {
  timestamps:boolean;
  completed:boolean;
  jobTitle: string;
  createdBy: mongoose.Types.ObjectId;
  city:string;
  country:string;
  phoneNumber:string;
  profession:string;
  firstName:string;
  lastName:string;
  publicEmail?: {
    type: string;
    trim?: boolean|undefined;
    lowercase?: boolean|undefined;
    match?: [RegExp]|undefined;
  };
  
  jobExperiences: {
    _id: mongoose.Types.ObjectId;
    jobTitle: string;
    company: string;
    country: string;
    city: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    responsibilities: mongoose.Types.ObjectId;
    rawResponsibilities: mongoose.Types.ObjectId;
  }[];


  education: {
    _id: mongoose.Types.ObjectId;
    schoolName: string;
    schoolLocation: string;
    degreeType: string;
    studyField: string;
    startDate: string;
    graduationDate: string;
    stillEnrolled: boolean;
  }[];

  skills:string[];
  
  rawSkills:string[];
  
  rawTools:string[];

  tools:string[];

  careerSummary:string;

  rawCareerSummary:string[]

}





//SCHEMA DEFINITIONS
const responsibilitySchema = new Schema<IResponsibility>({
  jobTitle: {
    type: String,
    required: true,
  },
  responsibilities: [{
    type: String,
    required: true,
  }],
});


const RawResponsibilitySchema = new Schema<IRawResponsibility>({
  jobTitle: {
    type: String,
    required: true,
  },
  responsibilities: [{
    type: String,
    required: true,
  }],
});

const RawCareerSummarySchema = new Schema<IRawCareerSummary>({
  jobTitle: {
    type: String,
    required: true,
  },
  careerSummary: [{
    type: String,
    required: true,
  }],
});



const resumeSchema = new Schema<IResume>({
  completed:{
    type:Boolean,
    default:false,
  },
  profession: {
    type: String,
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  city: {
    type: String,
  },
  phoneNumber:{
    type: String
  },
  country: {
    type: String,
  },
  publicEmail: {
    type: String,
    lowercase:true,
    trim:true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ],
  },
  jobExperiences: [
    {
      jobTitle: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      startDate: {
        type: String,
        required: true,
      },
      endDate:{
        type:String
      },
      currentlyWorking: {
        type: Boolean,
      },
      responsibilities: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Responsibility',
      },
      rawResponsibilities: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RawResponsibility',
      },
    },
  ],
  education: [
    {
      schoolName: {
        type: String,
        required: true,
      },
      schoolLocation: {
        type: String,
      },
      degreeType: {
        type: String,
      },
      studyField: {
        type: String,
      },
      startDate: {
        type: String,
      },
      graduationDate:{
        type:String
      },
      stillEnrolled: {
        type: Boolean,
      }},],
  tools:{
    type: [String],
  },
  skills:{
    type: [String],
  },
  rawTools:{
    type: [String],
  },
  rawSkills:{
    type: [String],
  },
  careerSummary:{
    type: String,
  },
  rawCareerSummary:{
    type: [String],
  },
  },
  {
    timestamps: true
});




//EXPORTS


const Resume = model<IResume>('Resume', resumeSchema);

export {IResume, Resume};


const RawResponsibility = model<IRawResponsibility>('RawResponsibility', RawResponsibilitySchema);

export { IRawResponsibility, RawResponsibility };

const RawCareerSummary = model<IRawCareerSummary>('RawCareerSummary', RawCareerSummarySchema);

export { IRawCareerSummary, RawCareerSummary };


const Responsibility = model<IResponsibility>('Responsibility', responsibilitySchema);

export { IResponsibility, Responsibility };
