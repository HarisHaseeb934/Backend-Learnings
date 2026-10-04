import mongoose from 'mongoose'
import { User } from './task1.js'

async function connectDB(){
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/mongoose_practice')
    }catch(error){
        console.log(error.message)
    }
}

connectDB()

async function registerUser(body){
    try {
        const userData = await User.create(body)
        console.log("User created successfully", userData)
    } catch (error) {
        console.log('Registration failed: ' + error.message)
    }
}

registerUser({name: 'haris', email: 'haris@mail.com', password: '11111111111111', age: 22, username: 'hhh', tage: ['hy, hello']})