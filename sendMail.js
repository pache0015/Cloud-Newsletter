const GMailAPIClient = require('./GMailAPIClient');
const gmailClient = new GMailAPIClient();
function sendMessage(anEmail, aSubject, aMessage){
  gmailClient.send_mail(aSubject, aMessage,
    anEmail,  
    {
    "name": "[UNQfy] - Newsletter",
    "email": "grupo.3.micr.serv.cloud@gmail.com",
  }) 
  } 
module.exports.sendMessage = sendMessage;