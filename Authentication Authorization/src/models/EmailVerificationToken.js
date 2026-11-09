import mongoose from 'mongoose'

const emailVerificationTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    token: {
        type: String,
        required: true,
        lenght: 8
    },
    expireAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
        expires: 0
    }
},{timestamps: true})

export const EmailVerificationToken = mongoose.model('emailVerificationToken', emailVerificationTokenSchema)