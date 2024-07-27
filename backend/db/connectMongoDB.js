import mongoose from "mongoose";

const connectMongoDb = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB Connection Established: ${conn.connection.host}`)
    } catch (error) {
        console.log(`error connection to mongo ${error.message}`)
    }
}
export default connectMongoDb