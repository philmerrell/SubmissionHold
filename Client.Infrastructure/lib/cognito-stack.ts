import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import { VerificationEmailStyle } from "aws-cdk-lib/aws-cognito";


export class CognitoStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const userPool = new cognito.UserPool(this, 'TrfrtSbmtUserPool', {
            userPoolName: 'Trfrt-Sbmt-UserPool',
            selfSignUpEnabled: true,
            userVerification: {
                emailSubject: 'Verify your email for the Treefort Artist Submit App!',
                emailBody: 'Hello {username}, Thanks for registering for the Treefort Music Fest submission app! Your verification code is {####}',
                emailStyle: VerificationEmailStyle.CODE,
            },
            signInAliases: {
                username: true,
                email: true
            },
            autoVerify: { email: true },
            signInCaseSensitive: false
        });

        userPool.addClient('app-client', {
            generateSecret: true,
            oAuth: {
                flows: {
                    authorizationCodeGrant: true
                },
                scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL, cognito.OAuthScope.PROFILE],
                callbackUrls: [`https://submissions.philmerrell.com`, `http://localhost:8100/callback`],
                logoutUrls: [`https://submission.philmerrell.com/logout`, `http://localhost:8100/logout`],

            },
            accessTokenValidity: Duration.hours(8),
            idTokenValidity: Duration.hours(8),
            refreshTokenValidity: Duration.days(365),
            supportedIdentityProviders: [
                cognito.UserPoolClientIdentityProvider.COGNITO
            ]
        });

        const sslCertArn = process.env.SSL_CERT_ARN || '';
        const domainCert = certificatemanager.Certificate.fromCertificateArn(this, 'domainCert', sslCertArn);

        userPool.addDomain('TrfrtSbmtUserPoolDomain', {
            customDomain: {
                domainName: 'submission-auth.philmerrell.com',
                certificate: domainCert
            }
        })

        // COGNITO PRODUCTION EMAIL INFO ****************************
        // https://docs.aws.amazon.com/cdk/api/v1/docs/aws-cognito-readme.html#Emails
        // By default, user pools are configured to use Cognito's built in email capability, which will send emails from no-reply@verificationemail.com. If you want to use a custom email address you can configure Cognito to send emails through Amazon SES, which is detailed below.
        // For typical production environments, the default email limit is below the required delivery volume. To enable a higher delivery volume, you can configure the UserPool to send emails through Amazon SES. To do so, follow the steps in the Cognito Developer Guide to verify an email address, move the account out of the 



    }
}