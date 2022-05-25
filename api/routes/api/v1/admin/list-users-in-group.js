var toCamelCase = require('../../../../helpers/to-camel');
const Router = require('express').Router
const { cognito_userpool_id } = require('../../../../config');
var AWS = require('aws-sdk');

module.exports = Router({ mergeParams: true })
  .get('/v1/admin/list-users-in-group', async (req, res, next) => {
      
      if (req.auth['cognito:groups'].indexOf('admin') > -1) {
        AWS.config.update({ region: 'us-west-2' });
        var params = {
          GroupName: req.query.groupName,
          UserPoolId: cognito_userpool_id,
          // Limit: 'NUMBER_VALUE',
          // NextToken: 'STRING_VALUE'
        };
        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
        cognitoidentityserviceprovider.listUsersInGroup(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
          } else {
            res.json(toCamelCase(data));
          }  
        });
      } else {
        res.status(403).json({});
      }
  });

