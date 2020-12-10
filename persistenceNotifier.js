const fs = require('fs'); // necesitado para guardar/cargar lo relacionado a las notificaciones
const notifyMod = require('./subscriber'); // importamos el modulo de subscribers

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getNotify(filename = 'data.json') {
  let notify = new notifyMod.Subscribers();
  if (fs.existsSync(filename)) {
    notify = notifyMod.Subscribers.load(filename);
  }
  return notify;
}

function saveNotify(notify, filename = 'data.json') {
  notify.save(filename);
}

module.exports = {
  getNotify,
  saveNotify
};