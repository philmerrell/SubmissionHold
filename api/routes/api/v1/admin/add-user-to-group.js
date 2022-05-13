const Router = require('express').Router
const { cognito_userpool_id, env } = require('../../../../config');
var AWS = require('aws-sdk');
const isLocal = env === 'local' ? true : false;

module.exports = Router({ mergeParams: true })
    .post('/v1/admin/add-user-to-group', async (req, res, next) => {

        if (req.auth['cognito:groups'].indexOf('admin') > -1) {
            AWS.config.update({ region: 'us-west-2' });
            var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

            var params = {
                GroupName: req.body.groupName,
                UserPoolId: cognito_userpool_id,
                Username: req.body.username
            };
            cognitoidentityserviceprovider.adminAddUserToGroup(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                } else {
                    res.json(data)
                }
            });
        } else {
            res.status(403).json({});
        }

    });