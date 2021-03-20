require('dotenv/config')
const fs = require('fs')
const AWS = require('aws-sdk')
const { v4: uuid } = require('uuid');
const User = require('../models/User')

const mongoose = require('mongoose')

const Post = require('../models/Post')
const UpdateKarma = require('./incrementKarma')
const PostState = require('../models/PostState')




//----------------------------------------------------UPLOAD----------------------------------------------------------------
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
                res.status(500).send(error)
                reject(err)
            } else {
                uploadData = data
                resolve()
            }
        })
    })

}


//Uploading to Mongo
async function uploadToMongo(req, post, res) {
    let voteCount = {
        votes: 0,
    }

    post = { ...post, ...voteCount }

    //uploading to server
    let newUpload = new Post(post);

    try {
        const a1 = await newUpload.save()

        //calling updateKarma
        UpdateKarma.updateKarma(post.uid, req, "increment", karmaPoints)

        res.json(a1)
    } catch (err) {
        res.status(400).send(err)
    }
}

//UPLOAD ROUTE
exports.uploads = async (req, res, next) => {

    const files = req.file;

    if (!req.body.caption) {
        const error = new Error('Invalid Caption');
        error.httpStatusCode = 400;
        return next(error);
    }

    var uid1 = req.headers.uid
    uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
    let post = {
        uid: uid1,
        caption: req.body.caption
    }

    karmaPoints = 4

    if (req.body.description) {
        let postDesc = {
            desc: req.body.description
        }

        karmaPoints = karmaPoints + 2

        post = { ...post, ...postDesc }
    }

    if (req.file) {

        let imgLoc

        karmaPoints = karmaPoints + 4

        let uploadImg = req.file.originalname.split(".")
        const imgExt = uploadImg[uploadImg.length - 1]

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${uuid()}.${imgExt}`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: 'public-read'
        }


        let imgDesc

        imgLoc = uploadToS3(params).then(() => {

            imgDesc = {
                Etag: uploadData.ETag,
                Location: uploadData.Location,
                key: uploadData.key,
                bucket: uploadData.Bucket,
                filename: params.Key
            }

            post = { ...post, ...imgDesc }

            uploadToMongo(req, post, res)

        }).catch(() => {
            res.status(500).send("Error in amazon upload")
        })
    } else {
        uploadToMongo(req, post, res)
    }

}






//----------------------------------------------------FEED----------------------------------------------------------------
let creatorId
function findCreatorId(id) {

    return new Promise(async (resolve, reject) => {

        const result = await PostState.find({ uid: id }, function (err, docs) {
            if (err) {
                //console.log(err);
                res.status(500).send(err)
                reject(err)
            }
            else {
                creatorId = docs
                resolve()
            }
        });
    })
}

exports.getAllPosts = function (req, res) {
    let sort;
    action = req.query.action
    switch (action) {
        case "top":
            sort = {
                votes: -1
            }
            break;
        case "recent":
            sort = {
                createdAt: -1
            }
            break;
        case "old":
            sort = {
                createdAt: 1
            }
            break;
        default:
            sort = {
                createdAt: -1
            }
    }


    var uid1 = req.headers.uid
    if (uid1 == "null" || uid1 == "\"\"" || uid1 == undefined) {
        Post.aggregate([{
            $lookup: {
                from: "users",
                localField: "uid",
                foreignField: "_id",
                as: "test"
            }
        }]).sort(sort).exec(function (err, doc) {
            if (err) throw err;
            if (doc.length) {
                res.send(doc)
            } else {
                res.status(404);
                res.send({
                    error: `Unable to find posts.`
                })
            }
        })
    } else {



        try {
            uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
            imgLoc = findCreatorId(uid1).then(async () => {
                let map = {}
                creatorId.forEach(element => {
                    map[element.postId] = element.state
                });

                Post.aggregate([{
                    $lookup: {
                        from: "users",
                        localField: "uid",
                        foreignField: "_id",
                        as: "test"
                    }
                }]).sort(sort).exec(function (err, doc) {
                    if (err) throw err;
                    if (doc.length) {
                        let map1 = doc.concat(map)
                        res.send(map1)
                    } else {
                        res.status(404);
                        res.send({
                            error: `Unable to find posts.`
                        })
                    }
                })

            })
        } catch (err) {
            res.status(400).send(err)
        }
    }
}





//----------------------------------------------------SINGLE POST----------------------------------------------------------------
function findCreatorId1(id, pid) {

    return new Promise(async (resolve, reject) => {

        const result = await PostState.find({ uid: id, postId: pid }, function (err, docs) {
            if (err) {
                res.status(500).send(err)
                reject(err)
            }
            else {
                creatorId = docs
                resolve()
            }
        });
    })
}

exports.singlePost = async function (req, res) {

    var uid1 = req.headers.uid
    if (uid1 == "null" || uid1 == "\"\"" || uid1 == undefined) {

        var postWithExtra = await Post.findById(req.params.id).populate({ path: 'uid' }).exec(function (err, doc) {
            if (err) res.status(404).send("not found");
            else {
                if (doc == null) {
                    res.status(404).send("not found");
                } else {
                    append = {
                        test: [doc._doc.uid]
                    }
                    map1 = { ...doc._doc, ...append }
                    res.status(200).send(map1)
                }
            }
        })

    } else {

        try {
            uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
            imgLoc = findCreatorId1(uid1, req.params.id).then(async () => {
                let map
                creatorId.forEach(element => {
                    map = element.state
                });


                var postWithExtra = await Post.findById(req.params.id).populate({ path: 'uid' }).exec(function (err, doc) {
                    if (err) res.status(404).send("not found");
                    else {
                        if (doc == null) {
                            res.status(404).send("not found");
                        } else {
                            let append1 = {
                                test: [doc._doc.uid]
                            }
                            map1 = { ...doc._doc, ...append1 }
                            let append = {
                                state: map
                            }
                            map2 = { ...map1, ...append }
                            res.status(200).send(map2)
                        }
                    }
                })

            })
        } catch (err) {
            res.status(400).send(err)
        }
    }
}





//----------------------------------------------------DELETE----------------------------------------------------------------

//Deleting Post
exports.deletePost = function (req, res) {

    try {
        var uid1 = req.headers.uid
        uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
        Post.deleteOne({ uid: uid1, _id: req.params.id }, function (err) {
            if (err)
                res.status(204).send("Not found")
            else {
                Comment.deleteMany({ uid: uid1, postId: req.params.id }, function (err) {
                    if (err) {
                        res.send("Deletion Successful")
                    } else {
                        res.status(200).send("Deletion Successful")
                    }
                });
            }
        });
    } catch (err) {
        res.status(401).send("Unauthorized Access")
    }

}



//----------------------------------------------------DELETE----------------------------------------------------------------

//Editing Post
exports.editPost = function (req, res) {

    try {
        var uid1 = req.headers.uid
        uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
        
        var myquery = { 
            _id: mongoose.Types.ObjectId(req.params.id),
            uid: uid1
        }
        var newvalues = {
            $set: {
                caption: req.body.caption,
                desc: req.body.description
            }
        }
        

        Post.updateOne(
            myquery, newvalues , function (err, result) {
            if (err)
                res.status(400).send("Something went wrong")
            else
                res.status(200).send(result)
        })
    } catch(err) {
        res.status(401).send("Unauthorized Access")
    }

}


//----------------------------------------------------POST STATE----------------------------------------------------------------

exports.postState = async(req, res, next) => {
    
    try {

        var uid1 = req.headers.uid
        uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
        
        const result = await PostState.find({ uid: uid1 }, function (err, docs) { 
            if (err){ 
                res.status(400).send("Something went wrong")
            } 
            else{ 
                res.send(docs)
            } 
        });

    } catch (err) {
        res.status(401).send("Unauthorized")
    }
}