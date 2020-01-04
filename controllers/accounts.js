const accountsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const accountData = require('../development/accounts.json')
const _ = require('underscore')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization
                        .toLowerCase()
                        .startsWith('bearer ')) 
    {
        return authorization.substring(7)
    }
    return null
}

const getUsersAccounts = user => {
    console.log('in getUsersAccounts')
    const username = user.toJSON().name
    const accounts = accountData.accounts
    const filtered = _.filter(accounts, (a) => {
        return a.accountOwners.includes(username)}) 
    console.log('filtered', filtered)
    return filtered
}

accountsRouter.get('/:id', (request, response, next) => {
    console.log('in accountsRouter')
    const token = getTokenFrom(request)
    try {
        const decodedToken = jwt.verify(token, 
            process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response.send(null)
        }  
        User.findById(request.params.id)
        .then(user => {
            response.json(getUsersAccounts(user))
        })
        .catch(error => next(error))

    } catch(exception) {
        if(exception.name === 'JsonWebTokenError') {
            return response.send(null)
        } else if (exception.name === 'TokenExpiredError') {
             console.log('token expired')
             return response.send(null)
        } else {
            console.log(exception)
            response.status(500).json({error: 'something wrong in auth check'})
            next(exception)
        }
    }
})

module.exports = accountsRouter