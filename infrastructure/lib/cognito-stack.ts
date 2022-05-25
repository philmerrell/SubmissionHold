import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import { VerificationEmailStyle } from "aws-cdk-lib/aws-cognito";



export class CognitoStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const userPool = new cognito.UserPool(this, 'TrfrtSbmtUserPool', {
            userPoolName: 'TST-Trfrt-Sbmt-UserPool',
            selfSignUpEnabled: true,
            userVerification: {
                emailSubject: 'Verify your email for the Treefort Artist Submit App!',
                emailBody: 'Hello {email}, Thanks for registering for the Treefort Music Fest submission app! Your verification code is {####}',
                emailStyle: VerificationEmailStyle.CODE,
            },
            userInvitation: {
                emailSubject: 'You\'re Invited!',
                emailBody: 'Hello {username}, you have been invited to join our awesome app! Your temporary password is {####}',
                smsMessage: 'Hello {username}, your temporary password for our awesome app is {####}',
            },
            signInAliases: {
                username: false,
                email: true,
            },
            autoVerify: { email: true },
            signInCaseSensitive: false,
            standardAttributes: {
                email: {
                    mutable: false,
                    required: true
                }
            }
        });


        /**
         * COGNITO USER GROUPS
         */

         new cognito.CfnUserPoolGroup(this, 'AdminUserPoolGroup', {
           userPoolId: userPool.userPoolId,
           description: 'Admins of Treefort submissions',
           groupName: 'admin'
         });

         new cognito.CfnUserPoolGroup(this, 'VoterUserPoolGroup', {
           userPoolId: userPool.userPoolId,
           description: 'Voters of Treefort submissions',
           groupName: 'voter'
         });


        /*******
         * COGNTIO CLIENT
         */

        const client = userPool.addClient('app-client', {
            generateSecret: true,
            userPoolClientName: 'TST-TFT-SBMT-CLIENT',
            oAuth: {
                flows: {
                    authorizationCodeGrant: true
                },
                scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL, cognito.OAuthScope.PROFILE],
                callbackUrls: [`https://submissions.philmerrell.com`, `http://localhost:8100/callback`],
                logoutUrls: [`https://submission.philmerrell.com/logout`, `http://localhost:8100/logout`],

            },
            preventUserExistenceErrors: true,
            accessTokenValidity: Duration.hours(8),
            idTokenValidity: Duration.hours(8),
            refreshTokenValidity: Duration.days(365),
            supportedIdentityProviders: [
                cognito.UserPoolClientIdentityProvider.COGNITO
            ]
        });

        /*****
         * COGNITO PROVIDERS
         * 
         */

        // const googleOAuthClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET || '';
        // const googleProvider = new cognito.UserPoolIdentityProviderGoogle(this, 'Google', {
        //     userPool: userPool,
        //     clientId: '657685692425-3pr8avr0ui876r3pq68l7nq0lp3116it.apps.googleusercontent.com',
        //     clientSecret: googleOAuthClientSecret,
        //     attributeMapping: {
        //         email: cognito.ProviderAttribute.GOOGLE_EMAIL
        //     },
        //     scopes: ['profile', 'email', 'openid']
        //   });

        // client.node.addDependency(googleProvider)

        userPool.addDomain('CognitoDomain', {
            cognitoDomain: {
                domainPrefix: 'test-trft-sbmt',
            },
        });

        const sslCertArn = process.env.SSL_CERT_ARN || '';
        const domainCert = certificatemanager.Certificate.fromCertificateArn(this, 'domainCert', sslCertArn);

        // /login?response_type=code&client_id=u8pu17415f3gg1oit3kf53bif&redirect_uri=http%3A%2F%2Flocalhost%3A8100&scope=openid`;
        // userPool.addDomain('TrfrtSbmtUserPoolDomain', {
        //     customDomain: {
        //         domainName: 'submission-auth.philmerrell.com',
        //         certificate: domainCert
        //     }
        // })

        // COGNITO PRODUCTION EMAIL INFO ****************************
        // https://docs.aws.amazon.com/cdk/api/v1/docs/aws-cognito-readme.html#Emails
        // By default, user pools are configured to use Cognito's built in email capability, which will send emails from no-reply@verificationemail.com. If you want to use a custom email address you can configure Cognito to send emails through Amazon SES, which is detailed below.
        // For typical production environments, the default email limit is below the required delivery volume. To enable a higher delivery volume, you can configure the UserPool to send emails through Amazon SES. To do so, follow the steps in the Cognito Developer Guide to verify an email address, move the account out of the 
    }
}