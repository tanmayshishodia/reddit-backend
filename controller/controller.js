const fs = require('fs')

const uploadPostModel = require('../models/User')

//Handling uploads
exports.uploads = (req, res, next) => {
    //retrived files from uploads
    const files = req.files;

    console.log(req.body);

    //if does not contain caption: return error
    if(!req.body.caption) {
        const error = new Error('Invalid Caption');
        error.httpStatusCode = 400;
        return next(error);
    }

    //TODO: get uid from sessions
    let post = {
        uid : '1',
        caption : req.body.caption
    }

    //appending description to post, if post is present in description
    if(req.body.desc) {
        let postDesc = {
            desc : req.body.desc
        }

        post = {...post, ...postDesc}
    }

    //CHANGE: upload in S3 instead of db
    //convert images to base64 encoding and append
    if(files) {
        let imgArray = files.map((file) => {
            let img = fs.readFileSync(file.path)
            return encode_image = img.toString('base64')
        })

        imgArray.map((src, index) => {
            //create object to store data in collection
            let finalImgArray = {
                filename : files[index].originalname,
                contentType: files[index].mimetype,
                imageBase64: src
            }
            
            //appending images to post id image is present
            post = {...post, ...finalImgArray}

        })
    }

    //initializing voteCounter
    let voteCount = {
        votes : 0,
    }

    //appending voteCount to post
    post = {...post, ...voteCount}

    //pushing in db
    let newUpload = new uploadPostModel(post);

    return newUpload
        .save()
        .then(() => {
            return { msg: '${files[0].originalname} Uploaded successfully!' }
        })
        .catch(error => {
            if(error) {
                return Promise.reject({error: error.message || 'Cannot upload! Something missing.'})
            }
        });

    res.json(files)
    Promise.all(result)
        .then(msg => {
            res.json(msg);
        })
        .catch(err => {
            res.json(err);
        })
}