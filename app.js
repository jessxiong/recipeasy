import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

import WebAppAuthProvider from 'msal-node-wrapper'

const authConfig = {
    auth: {
   	clientId: "d09ed013-c24a-436b-8b06-9f7490611a64",
    	authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    	clientSecret: process.env.CLIENT_SECRET,
    	redirectUri: "/redirect"
    },
	system: {
    	loggerOptions: {
        	loggerCallback(loglevel, message, containsPii) {
            	console.log(message);
        	},
        	piiLoggingEnabled: false,
        	logLevel: 3,
    	}
	}
};

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import models from './models.js';

import apiRouter from './routes/api/api.js';

var app = express();

app.enable('trust proxy')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: "secretkeysdjfhskdfsfskjfd",
    saveUninitialized: true,
    cookie: { secure : false },
    resave: false
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.use((req, res, next) => {
  req.models = models
  next();
})

app.use('/api', apiRouter);

app.get('/signin', (req, res, next) => {
  return req.authContext.login({
    postLoginRedirectUri: '/',
  })(req, res, next);
});
  
  app.get('/signout', (req, res, next) => {
    return req.authContext.logout({
      postLogoutRedirectUri: '/',  
    })(req, res, next);
  });
  
  app.use(authProvider.interactionErrorHandler());

  app.get('/api/session', (req, res) => {
    if (req.session && req.session.isAuthenticated) {
      res.json({ 
        isAuthenticated: true,
        username: req.session.account?.username || "Unknown user"
      });
    } else {
      res.status(401).json({ 
        isAuthenticated: false,
        error: "Not authenticated"
      });
    }
  });
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:3000`);
});

export default app;