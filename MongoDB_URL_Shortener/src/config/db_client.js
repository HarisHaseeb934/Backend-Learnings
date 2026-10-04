import { MongoClient } from "mongodb"
import {env} from "../validators/env.js"

export const client = new MongoClient(env.MONGO_DB_URI);

