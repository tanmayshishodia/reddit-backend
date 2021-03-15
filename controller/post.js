require('dotenv/config')
const fs = require('fs')
const AWS = require('aws-sdk')
//const uuid = require('uuid/v4')
const { v4: uuid } = require('uuid');
const user = require('../models/User')

const mongoose = require('mongoose')

const uploadPostModel = require('../models/Post')
const updateKarma = require('./incrementKarma')

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})

let karmaPoints = 0

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


//updating Karma
// function updateKarma(id, req) {
//     user.updateOne(
//         {_id: id},
//         {
//             $inc: {
//                 karma: +1
//             }
//         },
//         function (err, result) {
//             if (err) throw err;

//             if (result) {
//                 console.log(`[${id}] post karma increased!`)
//             }
//         }
//     )
// }


//Uploading to Mongo
async function uploadToMongo(req, post, res) {
    let voteCount = {
        votes: 0,
    }

    console.log(post)

    //appending voteCount to post
    post = { ...post, ...voteCount }
    console.log(post)

    //uploading to server
    let newUpload = new uploadPostModel(post);

    try {
        const a1 = await newUpload.save()

        //calling updateKarma
        updateKarma.updateKarma(post.uid, req, "increment", karmaPoints)

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

    var uid1 = req.headers.uid
    uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
    console.log(uid1)
    console.log(typeof(uid1))
    console.log(req.body)
    //console.log("Post1: "+post)
    //TODO: get uid from sessions
    let post = {
        uid: uid1,
        caption: req.body.caption
    }

    karmaPoints = 4

    console.log(post)

    //appending description to post, if post is present in description
    if (req.body.description) {
        let postDesc = {
            desc: req.body.description
        }

        karmaPoints = karmaPoints + 2

        post = { ...post, ...postDesc }
    }

    console.log(post)

    //CHANGE: upload in S3 instead of db
    //convert images to base64 encoding and append
    if (req.file) {

        console.log("file present!")

        let imgLoc

        karmaPoints = karmaPoints + 4

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

            uploadToMongo(req, post, res)
            console.log(post)

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
        console.log("_____________")
        console.log(post)
        uploadToMongo(req, post, res)
    }

    //initializing voteCounter
}