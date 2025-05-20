import mongoose from "mongoose";

const DatabaseAuthConnection = () => {
    try {
        const uri = process.env.DATABASE_AUTH_URI
        if (uri) {
            mongoose.connect(uri)
                .then(() => {
                    console.log(`Successfully connected to the auth database`)
                }).catch((err) => {
                    console.error(`Connection error: ${err}`)
                })
        } else {
            console.error(`AUTH URI is not found try again...`)
        }
    } catch (error) {
        new Error(error)
        process.exit(1)
    }
}


export { DatabaseAuthConnection }