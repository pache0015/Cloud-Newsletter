const express = require('express');
const bodyParser    = require('body-parser');
const UnqfyConnector = require('./unquifyConnector.js');
const unqfyConnector   = new UnqfyConnector();
const notifications = express.Router();
const app  = express();
const { getNotify, saveNotify } = require('./persistenceNotifier.js');
let notifier = getNotify();
const sendMail = require('./sendMail.js');

//subscribirse a las notificaciones
notifications.route('/subscribe')
.post((req, res,next) => {
    const data = req.body;
        if(data.artistId === undefined || data.email==undefined){
           // const err = new MissingArguments();
            //errorHandler(err, req, res);
            return;
        }           
        unqfyConnector.existArtist(data.artistId)
        .then(result => {
            console.log("Result", result)
            console.log("ID", data.artistId)
            console.log("email", data.email)
            console.log("Notify", notifier)
            notifier.subscribe(data.artistId, data.email);
            console.log("subscribio")
            saveNotify(notifier);
            notifier = getNotify();
            res.status(200);
            res.send({
                Body: ""
            })
        })
        .catch(err => (
            next(new Error()//NoFindArtistException()
            ))
        );

});

notifications.route('/subscriptions')
.get((req, res, next) => {
    let id = parseInt(req.query.artistId);
    if (id === undefined){
        next(new Error())//new NoExistArtistException());
    }
    unqfyConnector.existArtist(id)
    .then(result => {
        let notifier2   = getNotify();
        let emails = notifier2.subscribers.map(subs => { 
            if (subs.artistId === id) {
                return subs.email;
            }
        })
        let filteredMails = emails.filter(mail=>mail!=undefined)
        res.status(200);
        res.send({
            Body: {"artistId": id,"subscriptors": filteredMails}  
        })
    })
    .catch(err => (
        next(new Error())) // NoFindArtistException()))
    );  
})

notifications.route('/unsubscribe')
.post((req, res, next) => {
    const data = req.body;
    if (data.artistId === undefined || data.email === undefined){
        next(new Error())//NoExistArtistException());
        return;
    }
    unqfyConnector.existArtist(data.artistId)
    .then(result => {
        notifier = getNotify();
        notifier.unSubscribe(data.artistId, data.email);
        saveNotify(notifier);
        res.status(200);
        res.send({
            Body: ""
        })
    })
    .catch(err => (
        next(new Error()))//NoFindArtistException()))
    );   
})




notifications.route('/notify')
.post((req, res, next) => {
    const data = req.body;
    if (data.artistId === undefined || data.subject === undefined || data.message === undefined){
        //next(new BadRequestException());
        //return;
    }
    unqfyConnector.existArtist(data.artistId)
    .then(result => {
        const emails = notifier.subscribers.map(subs => { 
            if (subs.artistId === data.artistId) {
                return subs.email;
            }
        })
        const filteredEmails = emails.filter(email=> email != undefined)
        try {        
            filteredEmails.forEach(email => {
                if (!(email === undefined)){
                sendMail.sendMessage(email, data.subject, data.message)};});
            res.status(200);
            res.send({
                Body: ""
            })
        } catch(err){
            next(
                new Error()
            //new NotificationFailureException()
            );
        }
    })
    .catch(err => (
        next(
            new Error()
            //new NoFindArtistException()
        
        ))
    );
})

const port = 8083;  // set our port

app.use((req, res, next) => {
    bodyParser.json()(req, res, err => {
        if (err) {
            //err = new BadRequestException();
            errorHandler(new Error(), req, res);
            return;
        }
        next();
    });
});
app.use('/api', notifications);
app.use(errorHandler);
const server = app.listen(port, () => {
    console.log("Server running");
});


function errorHandler(err, req, res, next) {

    // if (err.type === 'entity.parse.failed'){
    //     res.status(err.status);
    //     res.json({status: err.status, errorCode: 'INVALID_JSON'});
    // }else if (
    //     err instanceof NoFindArtistException){
    //             res.status(404);
    //             res.json({
    //                 status: 404,
    //                 errorCode: "RESOURCE_NOT_FOUND"});
    // } else {
    //     res.status(500);
    //     res.json({status: 500, errorCode: 'INTERNAL_SERVER_ERROR'});
    // }
}
 
