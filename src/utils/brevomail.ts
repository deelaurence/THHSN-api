const axios = require("axios");
require("dotenv").config();

const apiUrl = "https://api.brevo.com/v3/smtp/email";
const apiKey = process.env.brevo_secret;

const sendBrevoMail = async (email:string, name:string, link:string) => {
  const requestData = {
    sender: {
      name: "Odunayo from SKYSKILLS",
      email: "donotreply@skyskill.com",
    },
    to: [
      {
        email,
        name,
      },
    ],
    subject: "Verify Your Account",
    htmlContent: `
    <html>
  <head>
    <meta charset="utf-8" />
    <title>Verify Account</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Aboreto&family=Blinker:wght@100;200;300;400;600;700;800;900");
      /* Reset styles to ensure consistent rendering across different email clients */
      body,
      #bodyTable {
        margin: 0;
        padding: 0;
        width: 100% !important;
      }

      table {
        border-collapse: collapse;
      }

      td {
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #333333;
      }

      /* Main email container */
      #bodyTable {
        background-color: #f4f4f4;
      }

      /* Email content */
      #emailContainer {
        background-color: white;
        max-width: 600px;
        /* background-color: #63c5da; */
        margin: 0 auto;
      }

      /* Email header */
      #header {
        /* text-align: center; */
        font-size: 20px;
        padding-left: 40px;
        padding-top: 30px;
        padding-bottom: 30px;
        color: white;
        position: relative;
        overflow: hidden;
      }
      .img-cont {
        height: 150px;
        position: relative;
        overflow: hidden;
      }
      .img-filter {
        height: 100%;
        width: 100%;
        opacity: 0.5;
        background: skyblue;
        position: absolute;
        z-index: 12;
      }
      img {
        border: 0;

        outline: none;
        width: 100%;
        top: -105%;
        text-decoration: none;
        position: absolute;
        z-index: 1;
      }
      h1 {
        position: relative;
        z-index: 2;
        font-size: 30px;

        color: #63c5da;
        /* display: none; */
        margin-bottom: -40px;
      }
      /* Email body */
      #body {
        padding: 40px;
      }

      /* Button styles */
      .button {
        display: inline-block;
        margin: 10px 0;
        padding: 12px 24px;
        background-color: #63c5da;
        color: white !important;
        font-size: 16px;
        font-weight: bold;
        text-decoration: none;
        border-radius: 4px;
      }

      /* Email footer */
      #footer {
        background-color: #f9fafb;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <table id="bodyTable" cellpadding="0" cellspacing="0" border="0">
      <div class="img-cont">
        <img
          src="https://images.unsplash.com/photo-1600195077909-46e573870d99?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
          alt=""
          srcset=""
        />
        <div class="img-filter"></div>
      </div>
      <tr>
        <td align="center">
          <table id="emailContainer" cellpadding="0" cellspacing="0" border="0">
            <!-- Email header -->
            <tr>
              <td id="header">
                <h1>RESUME VANTAGE</h1>
              </td>
            </tr>
            <!-- Email body -->
            <tr>
              <td id="body">
                <p> 
                  Hello ${name}, We are excited to have you on board, click on
                  the button below to verify your email
                </p>
                <a class="button" href="${link}">Verify Email</a>
              </td>
            </tr>
            <!-- Email footer -->
            <tr>
              <td id="footer">&copy; 2024 Resume vantage. All rights reserved.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

        `,
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
    });

    console.log("Email sent successfully:", email, name, response.status);
    return response.status;
  } catch (error:any) {

    console.error("Error sending email:", error);
  }
};

const sendPasswordResetMail = async (email:string, name:string, link:string) => {
  const requestData = {
    sender: {
      name: "Odunayo from SKYSKILLS",
      email: "donotreply@skyskill.com",
    },
    to: [
      {
        email,
        name,
      },
    ],
    subject: "Verify Your Account",
    htmlContent: `<html>
  <head>
    <meta charset="utf-8" />
    <title>Verify Account</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Aboreto&family=Blinker:wght@100;200;300;400;600;700;800;900");
      /* Reset styles to ensure consistent rendering across different email clients */
      body,
      #bodyTable {
        margin: 0;
        padding: 0;
        width: 100% !important;
      }

      table {
        border-collapse: collapse;
      }

      td {
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #333333;
      }

      /* Main email container */
      #bodyTable {
        background-color: #f4f4f4;
      }

      /* Email content */
      #emailContainer {
        background-color: white;
        max-width: 600px;
        /* background-color: #63c5da; */
        margin: 0 auto;
      }

      /* Email header */
      #header {
        /* text-align: center; */
        font-size: 20px;
        padding-left: 40px;
        padding-top: 30px;
        padding-bottom: 30px;
        color: white;
        position: relative;
        overflow: hidden;
      }
      .img-cont {
        height: 150px;
        position: relative;
        overflow: hidden;
      }
      .img-filter {
        height: 100%;
        width: 100%;
        opacity: 0.5;
        background: skyblue;
        position: absolute;
        z-index: 12;
      }
      img {
        border: 0;

        outline: none;
        width: 100%;
        top: -105%;
        text-decoration: none;
        position: absolute;
        z-index: 1;
      }
      h1 {
        position: relative;
        z-index: 2;
        font-size: 30px;

        color: #63c5da;
        /* display: none; */
        margin-bottom: -40px;
      }
      /* Email body */
      #body {
        padding: 40px;
      }

      /* Button styles */
      .button {
        display: inline-block;
        margin: 10px 0;
        padding: 12px 24px;
        background-color: #63c5da;
        color: white !important;
        font-size: 16px;
        font-weight: bold;
        text-decoration: none;
        border-radius: 4px;
      }

      /* Email footer */
      #footer {
        background-color: #f9fafb;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <table id="bodyTable" cellpadding="0" cellspacing="0" border="0">
      <div class="img-cont">
        <img
          src="https://images.unsplash.com/photo-1600195077909-46e573870d99?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
          alt=""
          srcset=""
        />
        <div class="img-filter"></div>
      </div>
      <tr>
        <td align="center">
          <table id="emailContainer" cellpadding="0" cellspacing="0" border="0">
            <!-- Email header -->
            <tr>
              <td id="header">
                <h1>RESUME VANTAGE</h1>
              </td>
            </tr>
            <!-- Email body -->
            <tr>
              <td id="body">
                <p>
                  Hello ${name}, You have initiated a password reset. Click on the link below to 
                  reset your password
                </p>
                <a class="button" href="${link}">Verify Email</a>
                <p>
                  Ignore this mail if you haven't requested for a passsword reset. 
                </p>
              </td>
            </tr>
            <!-- Email footer -->
            <tr>
              <td id="footer">
                &copy; 2024 Resume vantage. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
 `,
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
    });

    console.log("Email sent successfully:", email, name, response.status);
    return response.status;
  } catch (error:any) {
    console.error("Error sending email:", error.response);
  }
};



export {
  sendBrevoMail,
  sendPasswordResetMail,
};
