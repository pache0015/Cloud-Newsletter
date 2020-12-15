const rp    = require('request-promise');

class UNQfyConnector{
    existArtist(artistID){
        const options = {
            uri: `http://localhost:8080/api/artists/${artistID}`,
            json: true
        };
        return rp.get(options);
    }
}

module.exports = UNQfyConnector;