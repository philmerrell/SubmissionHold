const Router = require('express').Router
const { cognito_userpool_id } = require('../../../../config');
var AWS = require('aws-sdk');

module.exports = Router({ mergeParams: true })
  .post('/v1/admin/delete-user', async (req, res, next) => {

    if (req.auth['cognito:groups'].indexOf('admin') > -1) {
      AWS.config.update({ region: 'us-west-2' });
      var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
      
      var response = await cognitoidentityserviceprovider.adminDeleteUser({
        UserPoolId: cognito_userpool_id,
        Username: req.body.username,
      }).promise()
      res.json(response);
    } else {
      res.status(403).json({});
    }
  });

