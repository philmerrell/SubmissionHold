const Router = require('express').Router
const { cognito_userpool_id, env } = require('../../../../config');
var AWS = require('aws-sdk');
const { response } = require('express');
const isLocal = env === 'local' ? true : false;

module.exports = Router({ mergeParams: true })
  .post('/v1/admin/create-user', async (req, res, next) => {

    if (req.auth['cognito:groups'].indexOf('admin') > -1) {
      AWS.config.update({ region: 'us-west-2' });
      var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
      var params = {
        UserPoolId: cognito_userpool_id,
        Username: req.body.username,
        DesiredDeliveryMediums: [
          "EMAIL"
        ],
        TemporaryPassword: "Password@123",
        UserAttributes: [
          {
            Name: "email",
            Value: req.body.email
          }
        ]
      }
      var response = await cognitoidentityserviceprovider.adminCreateUser(params).promise()
      res.json(response);
    } else {
      res.status(403).json({});
    }
  });

