#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ClientStack } from '../lib/client-stack';
import { CognitoStack } from '../lib/cognito-stack';

const app = new cdk.App();
new ClientStack(app, 'SubmissionHoldClientStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

new CognitoStack(app, 'SubmissionHoldCognitoStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
});
