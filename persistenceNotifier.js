const fs = require('fs');
const Subscriptor = require('./subscriptor.js'); 

function getNotify(filename = 'data.json') {
  let unqfy = new Subscriptor();
  if (fs.existsSync(filename)) {
      unqfy = Subscriptor.load(filename);
  }
  return unqfy;;
}

function saveNotify(notify, filename = 'data.json') {
  notify.save(filename);
}

module.exports = {
  getNotify,
  saveNotify
};