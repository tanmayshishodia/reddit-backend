const fs = require('fs')
const user = require('../models/User')
const commentState = require('../models/CommentState')

const updateKarma = require('./incrementKarma')
const { Interface } = require('readline')

exports.commentState = async (req, res, next) => {

    //check if already votes
    const result = await commentState.find({ uid: req.session.uid, commentId: req.params.id }, function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            if (Object.keys(docs).length == 0) {
                //add 1

                post = {
                    uid: req.session.uid,
                    commentId: req.params.id,
                    state: 1
                }

                let newUpload = new commentState(post);

                try {
                    const a1 = await newUpload.save()

                    //calling updateKarma
                    updateKarma(req.session.uid, req, req.body.action)

                    res.json(a1)
                } catch (err) {
                    console.log(err)
                    res.send(err)
                }

            } else if (docs.state == 1 && req.body.action == "increment") {
                //update to make 0
                commentState.updateOne({
                    uid: req.session.uid,
                    commentId: req.params.id
                }, {
                    state: 0
                }, function (err, result) {
                    if (err) throw err;

                    console.log(`[${req.params.id}] comment edited!`)
                    //res.redirect("/")
                    updateKarma(req.session.uid, req, "decrement")
                })
            } else {
                //update to make -1
                commentState.updateOne({
                    uid: req.session.uid,
                    commentId: req.params.id
                }, {
                    state: -1
                }, function (err, result) {
                    if (err) throw err;

                    console.log(`[${req.params.id}] comment edited!`)
                    updateKarma(req.session.uid, req, req.body.action)
                    //res.redirect("/")
                })
            }
        }
    })
}