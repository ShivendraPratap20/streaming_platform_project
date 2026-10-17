import mongoose from "mongoose";

(async()=>{
    try {
        await mongoose.connect(process.env.DB_CONN_URI || "");
        console.log(`Database connection established`);
    } catch (error) {
        console.log(`Error while connecting to database ${error}`);
    }
})();

export default mongoose;