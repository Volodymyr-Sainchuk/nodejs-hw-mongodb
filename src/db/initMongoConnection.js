import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const URI = process.env.MONGODB_URI;

if (!URI) throw new Error('MONGODB_URI is not defined');

async function initMongoConnection() {
  try {
    await mongoose.connect(URI);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log(error);
  }
}

export { initMongoConnection };
