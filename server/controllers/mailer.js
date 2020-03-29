"use strict";
const nodemailer = require("nodemailer");

module.exports = {
async sendMail(to,subject,text) {
  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b73e7aaf07f612",
      pass: "4e9615227806bd"
    }
  });

  let info = await transporter.sendMail({
    from: '"Value Infinity" <notifications@value-infinity.com>', // sender address
    to:to, // "bar@example.com, baz@xample.com", // list of receivers
    subject:subject, // "Hello ✔", // Subject line
    text:text, // "Hello world?", // plain text body
    html: "<b>"+text+"</b>" // html body
    // to:"bar@example.com, baz@xample.com", // list of receivers
    // subject:"Hello ✔", // Subject line
    // text:"Hello world?", // plain text body
    // html:"<b>Hello world?</b>" // html body
  })
  .then((result) => {
    return true;
  })
  .catch(error => {
    return false;
  });
}
};