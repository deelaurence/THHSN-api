import request from 'supertest';
import app from '../src/app';


let token:string;

type UserObject = Record<string,string>;
const user1:UserObject={
  email:'testuser1@gmail.com',
  name:'Poco Lee',
  password:'supersecret',
  newPassword:'unsupersecret'

}



describe('Authentication Endpoints', () => {

  it('should register a user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: user1.email, password: user1.password , name:user1.name});
      token=JSON.parse(res.text).payload.userToken
      expect(res.statusCode).toEqual(201);
  });

  
  it('should verify user account when link in mail is clicked', async () => {
    const res = await request(app)
    .get(`/auth/verify-email/${token}`)
    expect(res.statusCode).toEqual(302);
  });



  it('should authenticate a user and return a token', async () => {
    const res = await request(app)
    .post('/auth/login')
    .send({ email: user1.email, password: user1.password,});
    expect(res.statusCode).toEqual(200);
    expect(res.body.payload).toHaveProperty('token');
  });

  it('should not register a user with the same username', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: user1.email, password: user1.password , name:user1.name});
    expect(res.statusCode).toEqual(409);
  });

  it('should send a password reset mail', async () => {
    const res = await request(app)
      .post('/auth/verify-email-password-reset')
      .send({ email: user1.email});
    expect(res.statusCode).toEqual(200);
  });

  it('should verify user account for password reset when link in mail is clicked', async () => {
    const res = await request(app)
    .get(`/auth/verified-email-password-reset/${token}`)
    expect(res.statusCode).toEqual(302);
  });


  it('should update the password', async () => {
    const res = await request(app)
    .post(`/auth/update-password`)
    .send({ email: user1.email,password:user1.newPassword});
    expect(res.statusCode).toEqual(200);
  });

  it('should not accept former password', async () => {
    const res = await request(app)
    .post('/auth/login')
    .send({ email: user1.email, password: user1.password,});
    expect(res.statusCode).toEqual(401);
  });

  it('should accept new password', async () => {
    const res = await request(app)
    .post('/auth/login')
    .send({ email: user1.email, password: user1.newPassword,});
    expect(res.statusCode).toEqual(200);
    expect(res.body.payload).toHaveProperty('token');
  });

  
  it('should generate link to google consent', async () => {
    const res = await request(app)
    .get('/auth/google/onboard')
    expect(res.statusCode).toEqual(200);
    expect(res.body.payload).toHaveProperty('redirect');
  });




  //Nothing should be below deleting user



  it('should delete a user after test is done', async () => {
    const res = await request(app)
      .delete(`/auth/user/${user1.email}`)
    expect(res.statusCode).toEqual(200);
  });

  
});

