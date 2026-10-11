import { User } from "../models/User.js"

export const checkEmailExits = async(email) => {
    return await User.exists({email: email})
}

export const createUser = async({name, email ,password}) => {
    return await User.create({name: name, email: email, password: password})
}