import mongoose from "mongoose"

async function connectDB(){
    try{
        await mongoose.connect("mongodb://localhost:27017/mongoose_practice")
    }catch(error){
        console.log(error)
        process.exit(1)
    }
}

connectDB()

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Product title is required"],
        trim: true
    },
    sku:{
        type: String,
        uppercase: true,
        trim: true,
    },
    price:{
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"],
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    category: {
        type: String,
        enum: ['electronics', 'clothing', 'books', 'home'],
        required: true,
    },
    tage: {
        type: [String],
        default: []
    }
},{timestamps: true})

export const Product = mongoose.model('product', productSchema)