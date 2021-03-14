const fs = require('fs')
const user = require('../models/User')
const postState = require('../models/PostState')

const updateKarma = require('./incrementKarma')
const { Interface } = require('readline')

exports.postState = async (req, res, next) => {

    //check if already votes
    const result = await postState.find({ uid: req.session.uid, postId: req.params.id }, function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            if (Object.keys(docs).length == 0) {
                //add 1

                post = {
                    uid: req.session.uid,
                    postId: req.params.id,
                    state: 1
                }

                let newUpload = new postState(post);

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
                postState.updateOne({
                    uid: req.session.uid,
                    postId: req.params.id
                }, {
                    state: 0
                }, function (err, result) {
                    if (err) throw err;

                    console.log(`[${req.params.id}] post edited!`)
                    //res.redirect("/")
                    updateKarma(req.session.uid, req, "decrement")
                })
            } else {
                //update to make -1
                postState.updateOne({
                    uid: req.session.uid,
                    postId: req.params.id
                }, {
                    state: -1
                }, function (err, result) {
                    if (err) throw err;

                    console.log(`[${req.params.id}] post edited!`)
                    updateKarma(req.session.uid, req, req.body.action)
                    //res.redirect("/")
                })
            }
        }
    })
}