import request from 'supertest';
import app from '../src/app';
import { Resume, Responsibility,IResume } from '../src/models/resume';
import { StatusCodes } from 'http-status-codes';
import {getRandomJobTitle} from '../src/utils/randomJobTitle'

let token:string;
let resumeId:string;
let userResponsibilities:string[];
let jobExperienceId:string;
let responsibilityId:string;
let randomJob = getRandomJobTitle()

type UserObject = Record<string,string>;
const user1:UserObject={
    email:'testresumeheader@gmail.com',
    name:'Resume Header',
    password:'supersecret',
    lastName: 'Resume',
    firstName: 'Header',
    city: 'Los Angeles',
    country: 'Nigeria',
    profession: 'Frontend Developer',
    address: 'tocs',
    phoneNumber: '09084278347',
    publicEmail: 'deverenceconnect@gmail.com',
}



describe('Data collection endpoints', () => {
    
        it('should authenticate a user and return a token', async () => {
        const res = await request(app)
        .post('/auth/login')
        .send({ email: user1.email, password: user1.password,});
        expect(res.statusCode).toEqual(200);
        expect(res.body.payload).toHaveProperty('token');
        token=JSON.parse(res.text).payload.token
    });


    it('should create a resume header section', async () => {
        // Define the request body
        const {lastName,firstName,city,country,profession,address,phoneNumber,publicEmail} = user1
        const requestBody = {
          lastName,
          firstName,
          city,
          country,
          profession:randomJob,
          address,
          phoneNumber,
          publicEmail,
        };
    
        // Make the POST request to create the resume header
        const res = await request(app)
          .post('/resume/header')
          .set('Authorization', `Bearer ${token}`)
          .send(requestBody);
    
        // Assert the response status code
        expect(res.statusCode).toEqual(StatusCodes.CREATED);
    
        // Assert that the response body contains the expected properties
        expect(res.body).toHaveProperty('payload');
        expect(res.body.payload).toHaveProperty('firstName', firstName);
        expect(res.body.payload).toHaveProperty('lastName', lastName);
        // Add assertions for other properties as needed
    
        // Assert that the resume was created in the database
        const createdResume = await Resume.findOne({ firstName, lastName });
        resumeId=createdResume?._id
        expect(createdResume).toBeTruthy();
        // Add additional assertions as needed
      });

  
    it('should create a resume job experience', async () => {
        // Define the request body
        const requestBody = {
            jobTitle: randomJob,
            resumeId,
            company: "Avilla Inc",
            country: "USA",
            city: "New York",
            startDate: "2022-01-01",
            endDate: "2023-01-01",
            currentlyWorking: false
        };
    
        // Make the POST request to create the resume header
        const res = await request(app)
          .post('/resume/experiences')
          .set('Authorization', `Bearer ${token}`)
          .send(requestBody);
    
        // Assert the response status code
        expect(res.statusCode).toEqual(StatusCodes.CREATED);
    
        // Assert that the response body contains the expected properties
        expect(res.body).toHaveProperty('payload');
        expect(res.body.payload).toHaveProperty('updatedResume');
        expect(res.body.payload).toHaveProperty('responsiblitiesRecommendations');
        userResponsibilities=res.body.payload.responsiblitiesRecommendations.slice(0,6)
        const jobExperiences=res.body.payload.updatedResume.jobExperiences
        const lastJobExperience=jobExperiences[jobExperiences.length-1]
        jobExperienceId=lastJobExperience._id
        
        // Add assertions for other properties as needed
    
        // Assert that the resume was created in the database
        // const createdResume = await Resume.findOne({ firstName, lastName });
        // expect(createdResume).toBeTruthy();
        // Add additional assertions as needed
      });


      it('should add responsibilities to job experience', async () => {
        // Define the request body
        const requestBody = {
            resumeId,
            jobExperienceId,
            userResponsibilities
        };
    
        // Make the POST request to create the resume header
        const res = await request(app)
          .post('/resume/responsibilities')
          .set('Authorization', `Bearer ${token}`)
          .send(requestBody);
    
        // Assert the response status code
        expect(res.statusCode).toEqual(StatusCodes.CREATED);
    
        // Assert that the response body contains the expected properties
        expect(res.body).toHaveProperty('payload');
        expect(res.body.payload.jobExperiences[0]).toHaveProperty('responsibilities');
        responsibilityId= res.body.payload.jobExperiences[0].responsibilities       
        // Add assertions for other properties as needed
    
        // Assert that the resume was created in the database
        // const createdResume = await Resume.findOne({ firstName, lastName });
        // expect(createdResume).toBeTruthy();
        // Add additional assertions as needed
      });


  it('should delete resume after test', async () => {
    const res = await request(app)
    .get(`/auth/verify-email/${token}`)
    expect(res.statusCode).toEqual(302);
    await Resume.findOneAndDelete({ firstName:user1.firstName, lastName:user1.lastName });
    await Resume.findOneAndDelete({ _id:responsibilityId});
  });



})