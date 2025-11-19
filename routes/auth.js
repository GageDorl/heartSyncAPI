import express from 'express';
const routes = express.Router();
import pkg from 'express-openid-connect';
const { auth, requiresAuth } = pkg;
import User from '../models/user.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
    authRequired:false,
    auth0Logout:true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: "https://dev-5fw5sq1d53v0445x.us.auth0.com"
};

const doesUserExist = async (authID) => {
    return await User.findOne({ authProviderId: authID });
}

routes.use(auth(config));


routes.get('/', requiresAuth(), async (req, res) => {
    const authID = req.oidc.user.sub;
    let user = await doesUserExist(authID);
    if (!user) {
        res.redirect('/new-user');
        return;
    }
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

routes.get('/activities', requiresAuth(), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/activities/index.html'));
});

routes.get('/letters', requiresAuth(), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/letters/index.html'));
});

routes.get('/letters/:letterId', requiresAuth(), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/letters/letter.html'));
});

routes.use('/callback', (req, res) => {
    res.redirect('/');
});

routes.use('/profile', requiresAuth(), async (req, res) => {
    const authID = req.oidc.user.sub;
    let user = await doesUserExist(authID);
    if (!user) {
        res.redirect('/new-user');
    } else {
        res.sendFile('profile.html', { root: './public' });
    }
});

routes.get('/new-user', requiresAuth(), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/new-user.html'));
});

routes.get('/login', (req, res) => {
    res.oidc.login();
});

routes.get('/logout', (req, res) => {
    res.oidc.logout();
});

routes.get('/js/:file', (req, res) => {
    res.sendFile(path.join(__dirname, `../public/js/${req.params.file}`));
});

routes.get('/css/:file', (req, res) => {
    res.sendFile(path.join(__dirname, `../public/css/${req.params.file}`));
});

routes.get('/images/:file', (req, res) => {
    res.sendFile(path.join(__dirname, `../public/images/${req.params.file}`));
});

routes.get('/partials/:file', (req, res) => {
    res.sendFile(path.join(__dirname, `../public/partials/${req.params.file}.js`));
});

export default routes;