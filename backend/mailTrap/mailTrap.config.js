import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv"
dotenv.config()
const TOKEN = process.env.mailTrapTOKEN;
const ENDPOINT=process.env.mailTrapEndpoint;

const mailclient = new MailtrapClient({
  token: TOKEN,
  endpoint:ENDPOINT
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "Meghana",
};
// const recipients = [
//   {
//     email: "meghanamaggie0987@gmail.com",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);
export {mailclient,sender}