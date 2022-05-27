#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ClientStack } from '../lib/client-stack';
import { CognitoStack } from '../lib/cognito-stack';
import { ApiStack } from '../lib/api-stack';

const app = new cdk.App();
new ClientStack(app, 'SubmitClientStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

new CognitoStack(app, 'SubmitCognitoStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
});

new ApiStack(app, 'SubmitApiStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
});
