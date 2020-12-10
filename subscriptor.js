const picklify = require('picklify'); 
const fs = require('fs'); 
const { runInThisContext } = require('vm');

class Subscriptor{
    constructor(){
        this._subscribers = [];
    }    

    subscribe(artistID, anEmail) {
        let subscriber = {  artistID: artistID,
                            email: anEmail };
        if (!this.contains(artistID, anEmail)){
            this._subscribers.push(subscriber);
        }
    }

    unSubscribe(anArtistID, anEmail){
        this._subscribers = this._subscribers.filter(sub => (
            !(sub.artistID === anArtistID && sub.email === anEmail.email)
        ))
        return this._subscribers
    }

    contains(anArtistID, anEmail){
        return this._subscribers.some(sub => sub.email  == anEmail && subs.artistID == anArtistID)
    }

    save(filename) {
        console.log("Write starting..");
        const serializedData = picklify.picklify(this);
        fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2), { encoding: 'utf-8' });
        console.log("Write successful");
      }

    static load(filename) {
        const serializedData = fs.readFileSync(filename, { encoding: 'utf-8' });
        const classes = [Subscriber, Subscribers];
        return picklify.unpicklify(JSON.parse(serializedData), classes);
      }
}

module.exports = {
    Subscriptor
};