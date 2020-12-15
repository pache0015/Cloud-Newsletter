class NoFindArtistException extends Error{}

class MissingArguments extends Error{}

class NoExistArtistException extends Error{}

class BadRequestException extends Error{}

class NotificationFailureException extends Error{}

module.exports = {
    NoFindArtistException:NoFindArtistException,
    MissingArguments:MissingArguments,
    NoExistArtistException:NoExistArtistException,
    BadRequestException:BadRequestException, 
    NotificationFailureException:NotificationFailureException
}
