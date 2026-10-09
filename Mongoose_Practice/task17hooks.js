import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/practice");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
});

postSchema.pre("save", async function (next) {
    if(this.isModified('title')){
        this.slug = this.title.split(' ').join('-').toLowerCase()
    }
    next()
});

const Post = mongoose.model('post', postSchema);

const seedDate = async() => {
    try {
        const docs = await Post.create([{title: "Hello World", slug: 'hello-world'}, {title: "Haris Haseeb", slug: 'haris-haseeb'}])
        console.log(docs)
    } catch (error) {
        console.log(error)
    }
}

// seedDate()

const updateTitle = async() => {
    try {
        const docs = await Post.findByIdAndUpdate('6ac899e5c3b70f9bc30ce425', {$set: {title: "Soban Shaheer"}})
        console.log(docs)
    } catch (error) {
        console.log(error)
    }
}

// updateTitle()

userSchema.pre('deleteOne', async function(){
    await Post.deleteMany({ author: this._id })
})

userSchema.pre(/^find/, async function(){
    await this.where({isDeleted: {$ne: true}})
})

postSchema.post('save', async function(error, doc, next){
    if(error.code === 11000){
        const error = new Error("Email already registered")
        next(error)
    }
})