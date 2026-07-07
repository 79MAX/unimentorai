import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) throw new Error('MONGO_URI missing');

  await mongoose.connect(uri);

  console.log('🧠 DATABASE CONNECTED');
}
