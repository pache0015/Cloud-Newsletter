const express = require('express');
const bodyParser = require('body-parser');
const UnqfyConnector = require('./unquifyConnector.js');
const unqfyConnector = new UnqfyConnector();
const notifications = express.Router();
const app = express();
const { getNotify, saveNotify } = require('./persistenceNotifier.js');
const sendMail = require('./sendMail.js');
const { NoFindArtistException,
    MissingArguments,
    NoExistArtistException,
    BadRequestException, 
    NotificationFailureException } = require('./exceptions.js');
    const port = 8083;  
app.use((req, res, next) => {
bodyParser.json()(req, res, err => {
        if (err) {
            errorHandler(new BadRequestException(), req, res);
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
    
notifications.route('/subscribe')
.post((req, res,next) => {
    const data = req.body;
        if(data.artistId === undefined || data.email === undefined){
            errorHandler(new MissingArguments(), req, res);
            return;
        }
        const notifier = getNotify();     
        unqfyConnector.existArtist(data.artistId)
        .then(result => {
            notifier.subscribe(data.artistId, data.email);
            saveNotify(notifier);
            res.status(200);
            res.send({
                Body: ""
            })
        })
        .catch(err => (
            next(new NoFindArtistException()))
        );
});

notifications.route('/subscriptions')
.get((req, res, next) => {
    const query_id = req.query.artistId
    const id = parseInt(query_id);
    if (id === undefined){
        errorHandler(new NoExistArtistException());
    }
    unqfyConnector.existArtist(id)
    .then(result => {
        const notifier2 = getNotify();
        const filteredMails = notifier2.subscribe_mails(id);
        res.status(200);
        res.send({
            Body: { artistId: id, subscriptors: filteredMails }  
        })
    })
    .catch(err => (
        next(new NoFindArtistException())) 
    );  
})

notifications.route('/unsubscribe')
.post((req, res, next) => {
    const data = req.body;
    if (data.artistId === undefined || data.email === undefined){
        errorHandler(new NoExistArtistException());
        return;
    }
    unqfyConnector.existArtist(data.artistId)
    .then(result => {
        const notifier = getNotify();
        notifier.unSubscribe(data.artistId, data.email);
        console.log(notifier.subscribers)
        saveNotify(notifier);
        res.status(200);
        res.send({
            Body: ""
        })
    })
    .catch(err => (
        next(new NoFindArtistException()))
    );   
})

notifications.route('/notify')
.post((req, res, next) => {
    const data = req.body;
    if (data.artistId === undefined 
        || data.subject === undefined 
        || data.message === undefined){
        next(new BadRequestException());
        return;
    }
    unqfyConnector.existArtist(data.artistId)
    .then(result => {
        const notifier = getNotify();
        emails = notifier.subscribe_mails(data.artistId);
        try {        
            emails.forEach(email => {
                sendMail.sendMessage(email, data.subject, data.message)})
        res.status(200);
        res.send({
            Body: ""
            })
        } catch(err){
            console.log(err);
            next(new NotificationFailureException());
        }
    })
    .catch(err => (
        next(new NoFindArtistException()))
    );
})

function errorHandler(err, req, res, next) {
    console.log(err)
    if (err.type === 'entity.parse.failed'){
        console.log(err)
        res.status(err.status);
        res.json({status: err.status, errorCode: 'INVALID_JSON'});
    }else if (
        err instanceof NoFindArtistException){
            console.log(err)
                res.status(404);
                res.json({
                    status: 404,
                    errorCode: "RESOURCE_NOT_FOUND"});
    } else {
        console.log(err)
        res.status(500);
        res.json({status: 500, errorCode: 'INTERNAL_SERVER_ERROR'});
    }
}
 
