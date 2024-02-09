const { StatusCodes } = require('http-status-codes')
const User = require('../models/User')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async(req, res) => {
    const test = await User.create({...req.body});
    const token = test.createJWT()// format is in the UserSchema
    res.status(StatusCodes.CREATED).json({user: { name: test.name },token});
}

const login = async(req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const test = await User.findOne({email})
    if (!test) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    //compare password
    const isPasswordCorrect = await test.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const token = test.createJWT();
    res.status(StatusCodes.OK).json({user: { name: test.name }, token})
}

module.exports = {
    register,
    login
}