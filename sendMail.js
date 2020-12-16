const GMailAPIClient = require('./GMailAPIClient');
const gmailClient = new GMailAPIClient();
function sendMessage(anEmail, aSubject, aMessage){
  gmailClient.send_mail(aSubject, [aMessage],
    {
      "name": "subscriber",
      "email": anEmail
    }, 
    {
      "name": "UNQfy",
      "email": "grupo.3.micr.serv.cloud@gmail.com"
    }
    ).catch(err => console.log(err));
  } 
module.exports.sendMessage = sendMessage;