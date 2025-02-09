const axios = require("axios");
require("dotenv").config();

const apiUrl = "https://api.brevo.com/v3/smtp/email";
const apiKey = process.env.brevo_secret;

const sendBrevoMail = async (email:string, name:string, link:string) => {
  const requestData = {
    sender: {
      name: "The Human Hair Shop",
      email: "donotreply@thhsn.com",
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
  
        p {
          z-index: 2;
          font-size: 16px;
          color: #333333;
          /* display: none; */
          }
          
          a{
            font-size: 16px;
            color: #333333;
        }
        /* Email body */
        #body {
          padding: 40px;
        }
  
        
  
        /* Email footer */
        #footer {
          background-color: #f9fafb;
          padding: 16px;
          margin-top:20px;
          text-align: center;
          font-size: 12px;
          color: #999999;
        }
      </style>
  </head>
  <body>
    <table id="bodyTable" cellpadding="0" cellspacing="0" border="0">
     
      <tr>
        <td align="center">
          <table id="emailContainer" cellpadding="0" cellspacing="0" border="0">
            <!-- Email header -->
            
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
              <td id="footer">&copy; 2025 The Human Hair Shop. All rights reserved.</td>
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
      name: "The Human Hair Shop",
      email: "donotreply@thhsn.com",
    },
    to: [
      {
        email,
        name,
      },
    ],
    subject: "Reset your password",
    htmlContent: `<html>
    <head>
      <meta charset="utf-8" />
      <title>Reset your password</title>
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
  
        p {
          z-index: 2;
          font-size: 16px;
          color: #333333;
          /* display: none; */
          }
          
          a{
            font-size: 16px;
            color: #333333;
        }
        /* Email body */
        #body {
          padding: 40px;
        }
  
        
  
        /* Email footer */
        #footer {
          background-color: #f9fafb;
          padding: 16px;
          margin-top:20px;
          text-align: center;
          font-size: 12px;
          color: #999999;
        }
      </style>
    </head>
    <body>
      <table id="bodyTable" cellpadding="0" cellspacing="0" border="0">
       
        
                <p>
                  Hello ${name}, You have initiated a password reset. Click on the link below to 
                  reset your password
                </p>
                <a class="button" href="${link}">Verify Email</a>
              <!-- Email footer -->
                <td id="footer">&copy; 2025 The Human Hair Shop. All rights reserved.</td>
              
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

