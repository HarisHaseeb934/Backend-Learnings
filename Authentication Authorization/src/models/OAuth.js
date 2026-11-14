import mongoose from 'mongoose'

const oauthSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    provider: {
        type: String,
        enum: ['google', 'github'],
        required: true,
    },
    providerAccountId: {
        type: String,
        unique: true,
        required: true
    }
}, {timestamps: true})

export const Oauth = mongoose.model('oauth', oauthSchema)