const Router = require('express').Router
const { cognito_userpool_id } = require('../../../../config');
var AWS = require('aws-sdk');
var toCamelCase = require('../../../../helpers/to-camel');
var generator = require('generate-password');


module.exports = Router({ mergeParams: true })
  .post('/v1/admin/create-user', async (req, res, next) => {

    if (req.auth['cognito:groups'].indexOf('admin') > -1) {
      AWS.config.update({ region: 'us-west-2' });
      var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

      var password = generator.generate({
        length: 10,
        numbers: true,
        lowercase: true,
        uppercase: true,
        symbols: true
      });

      var params = {
        UserPoolId: cognito_userpool_id,
        Username: req.body.email,
        DesiredDeliveryMediums: [
          "EMAIL"
        ],
        TemporaryPassword: password,
        UserAttributes: [
          {
            Name: "email",
            Value: req.body.email
          }
        ]
      }
      try {
        var response = await cognitoidentityserviceprovider.adminCreateUser(params).promise()
        res.json(toCamelCase(response));
      } catch (error) {
        console.log(error);
        res.status(error.statusCode).json({ message: error.code });
      }
    } else {
      res.status(403).json({});
    }
  });

