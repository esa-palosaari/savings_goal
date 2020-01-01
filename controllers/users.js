const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

usersRouter.post('/', async(request, response, next) => {
    try {
        const body = request.body
        const saltRounds = 10
        console.log(body)
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            name: body.name,
            email: body.email,
            passwordHash,
            date: body.date,
            goal: null
        })

        const savedUser = await user.save()

        response.json(savedUser)
    } catch (exception) {
        next(exception)
    }

})
    
usersRouter.get('/', async(request, response) => {
    const users = await User.find({}).populate('Goal')
    response.json(users.map(u => u.toJSON()))
})


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
        next(exception)
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

usersRouter.get('/checkAuth', (request, response, next) => {
    const token = getTokenFrom(request)
    console.log('checking token:', token)
        
    try{    const decodedToken = jwt.verify(token, 
            process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response
                    .status(401)
                    .json({checkAuth:'fail'}).end()
        } else {
         return response.status(200).json({checkAuth:'pass'}).end()
            
        }  
        
    } catch(exception) {
        if(exception.name === 'JsonWebTokenError') {
            return response.status(401).json({checkAuth: 'fail'}).end()
        } else if (exception.name === 'TokenExpiredError') {
             return response.status(401).json({checkAuth: 'expired'}).end()
        } else {
            console.log(exception)
            response.status(500).json({error: 'something wrong in auth check'})
            next(exception)
        }
    }
})

module.exports = usersRouter