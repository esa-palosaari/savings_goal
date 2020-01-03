const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  try 
  {
    const user = await User.findOne({ email: body.email })
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'epäkelpo sähköpostiosoite tai salasana'
      })
    }


  const userForToken = {
    email: user.email,
    id: user._id,

  }

  const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: '1h'})
  console.log('login after token')
  response
    .status(200)
    .send({ token, 
            email: user.email, 
            name: user.name,
            goal: user.goal,
            serverId:user._id })
  } 
  catch (err) 
  {
    next(err)
  }

})

module.exports = loginRouter