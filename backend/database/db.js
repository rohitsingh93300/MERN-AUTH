import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/note-app`)
        console.log('MongoDB connected successfully');
        
    } catch (error) {
        console.log('MongoDb connection error', error);
        
    }
}

export default connectDB;