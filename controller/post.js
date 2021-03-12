require('dotenv/config')
const fs = require('fs')
const AWS = require('aws-sdk')
const uuid = require('uuid/v4')

const uploadPostModel = require('../models/Post')

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})

let uploadData

//Uploading to S3
function uploadToS3(params) {
            
    return new Promise((resolve, reject) => {
        return s3.upload(params, (error, data) => {
            if (error) {
                console.log("error in upload")
                console.log(err)
                res.status(500).send(error)
                reject(err)
            } else {
                console.log("uploaded successfully!")
                console.log(data)
                uploadData = data
                resolve()
            }
        })
    })

}


//Uploading to Mongo
async function uploadToMongo(post, res) {
    let voteCount = {
        votes: 0,
    }

    //appending voteCount to post
    post = { ...post, ...voteCount }
    console.log(post)

    //uploading to server
    let newUpload = new uploadPostModel(post);

    try {
        const a1 = await newUpload.save()
        res.json(a1)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
}

//Handling uploads
exports.uploads = async (req, res, next) => {
    //retrived files from uploads
    const files = req.file;

    console.log(files)

    console.log(req.body);

    //if does not contain caption: return error
    if (!req.body.caption) {
        const error = new Error('Invalid Caption');
        error.httpStatusCode = 400;
        return next(error);
    }

    //TODO: get uid from sessions
    let post = {
        uid: '1',
        caption: req.body.caption
    }

    //appending description to post, if post is present in description
    if (req.body.desc) {
        let postDesc = {
            desc: req.body.desc
        }

        post = { ...post, ...postDesc }
    }

    //CHANGE: upload in S3 instead of db
    //convert images to base64 encoding and append
    if (req.file) {

        console.log("file present!")

        let imgLoc

        let uploadImg = req.file.originalname.split(".")
        const imgExt = uploadImg[uploadImg.length - 1]
        console.log(uploadImg)

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${uuid()}.${imgExt}`,
            Body: req.file.buffer
        }

        console.log(params)

        let imgDesc

        imgLoc = uploadToS3(params).then(() => {
            console.log("resolved")
            console.log(uploadData)

            imgDesc = {
                Etag: uploadData.ETag,
                Location: uploadData.Location,
                key: uploadData.key,
                bucket: uploadData.Bucket,
                filename: params.Key
            }

            post = { ...post, ...imgDesc }

            uploadToMongo(post, res)

        }).catch(() => {
            console.log("Error in amazon upload")
        })

        // console.log(imgLoc)

        // imgDesc = {
        //     Etag : imgLoc.ETag,
        //     Location : imgLoc.Location,
        //     key : imgLoc.key,
        //     bucket : imgLoc.Bucket,
        //     filename : params.Key
        // }

        // post = {...post, ...imgDesc}

        /*let imgArray = files.map((file) => {
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
            post = {...post, ...imgLoc}/*

        })*/
    } else {
        uploadToMongo(post)
    }

    //initializing voteCounter
}