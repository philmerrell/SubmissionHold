import { Stack, StackProps } from "aws-cdk-lib";
import { EndpointType } from "aws-cdk-lib/aws-apigateway";
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as certificateManager from 'aws-cdk-lib/aws-certificatemanager';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

import { Construct } from "constructs";



export class ApiStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

    const zoneName = 'sbmt-api.com'
    const apiDomainName = 'treefort-user-api.sbmt-api.com'
    const clientDomainName = 'treefort.sbmt-api.com';
    const cognitoDomainPrefix = 'treefort-sbmt-api';
    const cognitoClientId = '3haef1del6m62inkg1l232tghe';
    const cognitoClientSecret = process.env.COGNITO_CLIENT_SECRET || '';
    const cognitoUserPoolId = 'us-west-2_lDAj99aZZ';

    /**
     * Lambda - Function to host ExpressJS Api
     * @property - certArn
     */

    const apiLambda = new lambda.Function(this, 'TreefortUserApiFunction', {
        code: new lambda.AssetCode('../api'),
        handler: 'server.handler',
        runtime: lambda.Runtime.NODEJS_12_X,
        timeout: cdk.Duration.seconds(10),
        environment: {
          CLIENT_DOMAIN_NAME: `https://${clientDomainName}`,
          COGNITO_DOMAIN: cognitoDomainPrefix,
          COGNITO_CLIENT_ID: cognitoClientId,
          COGNITO_CLIENT_SECRET: cognitoClientSecret,
          COGNITO_LOGOUT_URI: `https://${clientDomainName}$/logout`,
          COGNITO_BASE_URL: `https://${cognitoDomainPrefix}.auth.us-west-2.amazoncognito.com`,
          COGNITO_REDIRECT_URI: `https://${clientDomainName}/callback`,
          COGNITO_USERPOOL_ID: cognitoUserPoolId
        }
      });
  
  
      /**
       * Api Gateway -
       * @property clientDomainName - required to set the CORS allowed origins
       * @property apiDomainName - required to set the api domain name
       * @property certArn - Arn the the ssl cert used to create api gateway domain name
       * @property apiLambda - Instance of the lambda function that handles all requests from this api
       */
  
      const sslCertArn = process.env.SSL_CERT_ARN || '';
      const sslCert = certificateManager.Certificate.fromCertificateArn(this, 'SslCertArn', sslCertArn);
      const zone = route53.HostedZone.fromLookup(this, 'GetHostedZone', {
        domainName: zoneName,
      });
  
      const api = new apigateway.LambdaRestApi(this, 'AwsStarterApiGateway', {
        restApiName: 'Aws Starter Api',
        description: 'Api gateway for the Aws-Ionic-Starter web application',
        handler: apiLambda,
        defaultCorsPreflightOptions: {
          allowOrigins: [
            "http://localhost:8100",
            `https://${clientDomainName}`
          ],
          allowMethods: [
            "GET",
            "POST",
            "OPTIONS",
            "PUT",
            "DELETE"
          ],
          allowCredentials: true,
        },
        endpointConfiguration: {
          types: [ EndpointType.EDGE ]
        },
        domainName: {
          domainName: apiDomainName,
          endpointType: EndpointType.EDGE,
          certificate: sslCert
        }
      });
  
      new route53.ARecord(this, 'CreateAliasRecord', {
        recordName: apiDomainName,
        zone: zone,
        target: route53.RecordTarget.fromAlias(new targets.ApiGateway(api))
      })
  
  
    }
}