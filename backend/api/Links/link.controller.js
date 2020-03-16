import Link from './link.model';
import shortid from 'shortid';
import validUrl from 'valid-url';
import config from 'config';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if(entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    }
}

function handleEntityNotFound(res) {
    return function(entity) {
        if(!entity) {
            res.status(404).end();
            return null;
        }

        return entity;
    }
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        res.status(statusCode).send(err);
    }
}

export function index(req, res) {
    return Link.find()
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

export function create(req, res) {
    const { longUrl } = req.body;
    const baseUrl = config.get('baseUrl');

    // Check base Url
    if(!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base Url');
    }

    // Create url Code
    const urlCode = shortid.generate();

    if(validUrl.isUri(longUrl)) {
        try {
           return Link.findOne({ longUrl })
                .then(linkFound => {
                    if(linkFound) {
                       return res.json(linkFound);
                    }
                    
                    return null;
                })
                .then(() => {
                    const shortUrl = `${baseUrl}/${urlCode}`;

                    const url = {
                        longUrl,
                        shortUrl,
                        urlCode
                    };
                    
                    return Link.create(url)
                        .then(respondWithResult(res))
                        .catch(handleError(res));
                });

        } catch (error) {
            res.status(401).json('Invalid long url');
        }
    }
}