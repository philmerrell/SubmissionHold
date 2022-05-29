const Router = require('express').Router
const { cognito_client_id, cognito_redirect_uri, cognito_base_url, env } = require('../../../../config');
const cookieParser = require('cookie-parser');
const { randomBytes } = require('crypto');
const isLocal = env === 'local' ? true : false;

module.exports = Router({ mergeParams: true })
  .get('/v1/auth/login', async (req, res, next) => {
    try {
      cookieParser()(req, res, () => {
        const state = req.cookies.state || generateStateValue();
        res.cookie('state', state.toString(), { maxAge: 3600000, secure: isLocal ? false : true, httpOnly: true });
        const urlEncodedRedirect = encodeURIComponent(cognito_redirect_uri);
        const loginInQueryParams = `/login?response_type=code&client_id=${cognito_client_id}&redirect_uri=${urlEncodedRedirect}&state=${state.toString()}&scope=email+openid+profile`;
        // https://trft-sbmt.auth.us-west-2.amazoncognito.com/login?client_id=56c4n7tnqlnho6m6dne6nj0s4o&response_type=code&scope=email+openid+profile&redirect_uri=http://localhost:8100/callback
        res.status(301).redirect(cognito_base_url + loginInQueryParams);
      });
    } catch (error) {
      next(error)
    }
  });

function generateStateValue() {
  return randomBytes(20).toString('hex');
}