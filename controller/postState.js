const fs = require('fs')
const user = require('../models/User')
const postState = require('../models/PostState')

const updateKarma = require('./incrementKarma')

exports.postState = async(req, res, next) => {

    //check if already votes
    const postVoted = await postState.findById(req.session.uid)
    if(!postVoted.contains(req.params.id))
        //vote count


        //increment-decrement karma
        updateKarma(req.session.uid, req, req.body.action)
}