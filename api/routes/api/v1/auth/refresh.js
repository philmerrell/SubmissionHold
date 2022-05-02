const Router = require('express').Router
const { cognito_client_id, cognito_base_url } = require('../../../../config');


module.exports = Router({ mergeParams: true })
  .post('/v1/auth/refresh', async (req, res, next) => {
    const refresh_token = req.body.refresh_token;
    try {
      const response = await axios({
        method: 'POST',
        url: `${cognito_base_url}/oauth2/token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + Buffer.from(`${cognito_client_id}:${cognito_client_secret}`).toString('base64')
        },
        data: { grant_type: 'refresh_token', client_id: cognito_client_id, refresh_token }
      });
      res.json(response.data);
    } catch (error) {
      next(error)
    }
  });