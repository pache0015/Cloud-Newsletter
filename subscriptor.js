const picklify = require('picklify'); 
const fs = require('fs'); 

class Subscriptor{
    constructor(){
        this._subscribers = [];
    }    

    get subscribers() { return this._subscribers; }

    is_subscribe(anArtistID, anEmail){
        return this._subscribers.some(subs => 
             anArtistID === subs.artistId && anEmail === subs.email);
    }

    subscribe_mails(anID){
        return this._subscribers.filter(subs => subs.artistId === anID).map(subs => subs.email);
    }

    subscribe(anArtistID, anEmail) {
        const subscriber = {artistId: anArtistID, email: anEmail};
        if (! this.is_subscribe(anArtistID, anEmail)){
            this._subscribers.push(subscriber);
        }
        return subscriber;
    }

    unSubscribe(anArtistID, anEmail){
        this._subscribers = this._subscribers.filter(sub => 
            !sub.artistId === anArtistID && sub.email === anEmail.email)
        return this._subscribers;
    }

    save(filename) {
        console.log("Write starting..");
        const serializedData = picklify.picklify(this);
        fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2), { encoding: 'utf-8' });
        console.log("Write successful");
    }
    
    static load(filename) {
        const serializedData = fs.readFileSync(filename, { encoding: 'utf-8' });
        const classes = [Subscriptor];
        return picklify.unpicklify(JSON.parse(serializedData), classes);
    }
}

module.exports = Subscriptor;