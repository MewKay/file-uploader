const { StorageClient } = require("@supabase/storage-js");
require("dotenv").config();

const STORAGE_URL = process.env.SUPABASE_STORAGE_URL;
const SERVICE_KEY = process.env.SUPABASE_SECRET_KEY;
const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME;

const storageClient = new StorageClient(STORAGE_URL, {
  apikey: SERVICE_KEY,
});

const storage = storageClient.from(BUCKET_NAME);

module.exports = storage;
