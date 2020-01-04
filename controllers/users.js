const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

usersRouter.post('/', async(request, response, next) => {
    console.log('beginning user add')
    try {
        const body = request.body
        const saltRounds = 10
        console.log("request.body:", body)
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            name: body.name,
            email: body.email,
            passwordHash,
            date: body.date,
            goal: null
        })
        
        console.log('saving user')
        const savedUser = await user.save()
        
        response.json(savedUser)
    } catch (exception) {
        console.log('catch exception')
        next(exception)
    }

})
    
// usersRouter.get('/', async(request, response) => {
//     const users = await User.find({})
//     response.json(users.map(u => u.toJSON()))
// })


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

usersRouter.get('/:id', (request, response, next) => {

    const token = getTokenFrom(request)
    try {
        const decodedToken = jwt.verify(token, 
            process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response.send(null)
        }  
        User.findById(request.params.id)
        .then(user => {
            response.json(user.toJSON())
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

usersRouter.put('/:id', (request, response, next) => {
    const body = request.body
    const goal = {
        goal: body.goal
    }
    const token = getTokenFrom(request)

    try {
        const decodedToken = jwt.verify(token, 
            process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response
                    .status(401)
                    .json({error:'token puuttuu tai epäkelpo'})
        }  
        User.findByIdAndUpdate(request.params.id, goal, {new:true})
        .then(updatedGoal => {
            response.json(updatedGoal.toJSON())
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

usersRouter.delete('/:id', async (request, response, next) => {
    try {
        await User.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }
})



module.exports = usersRouter