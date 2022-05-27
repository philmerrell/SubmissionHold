#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ClientStack } from '../lib/client-stack';
import { CognitoStack } from '../lib/cognito-stack';
import { ApiStack } from '../lib/api-stack';
import { Tags } from 'aws-cdk-lib';

const app = new cdk.App();
const clientStack = new ClientStack(app, 'SubmitClientStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
Tags.of(clientStack).add('Billing', 'Treefort');


const cognitoStack = new CognitoStack(app, 'SubmitCognitoStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
});
Tags.of(cognitoStack).add('Billing', 'Treefort');


const apiStack = new ApiStack(app, 'SubmitApiStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
});
Tags.of(apiStack).add('Billing', 'Treefort');