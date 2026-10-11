import mongoose from 'mongoose'

const connectDB = async() => {
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017');
    }catch(error){
        console.log(error.message)
    }
}

connectDB()

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required']
    },
    age: {
        type: Number,
        min: [18, 'Age must be Greater than 18']
    }
})

const User = mongoose.model('User', UserSchema)

const createUserWithTags = async(userData, rawTagsString) => {
    const userInstance = new User(userData);
    userInstance.tags = rawTagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== "")
    try{
        const savedUser = await userInstance.save()
        console.log(savedUser)
    }catch(error){
        if(error.name === 'ValidationError'){
            console.log(error.message)
        }else if(error.code === 11000){
            console.log("duplicate key")
        }else{
            console.log(error)
        }
    }
}


createUserWithTags({name: 'Haris', age: 19}, `" nodejs, mongodb , express ", ""`)
// {name: 'Haris', age: 19}