import express from 'express';
import router from './src/routes/homeRoutes.js';
import { env } from './src/validators/env.js';
import { client } from './src/config/db_client.js';

const app = express();

app.use(router)

app.set('view engine', 'ejs')

try {
    await client.connect()
    console.log("Db connects .... ")
} catch (error) {
    console.log("Error in db connection")
}

app.listen(env.PORT, () => {
    console.log(`Server is Running on PORT: ${env.PORT}`)
})

