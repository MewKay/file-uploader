const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./prisma-client");
require("dotenv").config;

const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

const store = new PrismaSessionStore(prisma, {});

const session = expressSession({
  secret: process.env.SESSION_SECRET_ID,
  resave: true,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: ONE_WEEK,
  },
});

module.exports = session;
