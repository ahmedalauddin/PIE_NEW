"use strict";
const nodemailer = require("nodemailer");
const logger = require("../util/logger")(__filename);
var config = require("../config/config");
const callerType = "controller";

module.exports = {
async sendMail(to,subject,text) {
  logger.info(`${callerType} sending mail ${to}`);
  if(!config.isHosted()){
      logger.info(`${callerType} not hosted  mail  text:   ${text}`);
      return;
  }
  var transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    tls: {
      ciphers:'SSLv3'
    }, 
    secureConnection: false,
    auth: {
      user: "support@value-infinity.com",
      pass: "Innovation787$"
    }
  });

  let info = await transporter.sendMail({
    from: '"Innovation Support" <support@value-infinity.com>', 
    to:to, 
    subject:subject, 
    html:text, 
  })
  .then((result) => {
    logger.info(`${callerType} mail sent  ${JSON.stringify(result)}`);
    console.log(result)
    return true;
  })
  .catch(error => {
    logger.error(`${callerType} mail sent fail ${JSON.stringify(error)}`);
    console.log(error)
    return false;
  });
}
};