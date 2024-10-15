# CICD pipelines

CI/CD Pipeline with AWS CodePipeline and GitHub as the Source

## 1. Introduction

AWS CodePipeLine is a powerful service that automates the CI/CD workflow, allowing developers to build, test, and deploy applications rapidly and reliably. This document outlines how to set up a CI/CD pipeline using AWS codePipeline with GitHub as the source repository, integrating it with AWS services such as CodeBuild and CodeDeploy.

## 2. Key services Used:

- AWS CodePipeline: Automates the CI/CD process for continuous integration and deployment.
- GitHub: A git repository hosting service used to manage source code.
- AWS CodeBuild: Compiles the source code, runs tests, and produces build artifacts.
- AWS CodeDeploy: Deploys the build artifacts to EC2, Lambda, ECR and other AWS services.

## 3. Pipeline Overview

The pipeline consists of the following stages:

1. Source Stage: Fetches code from GitHub.
2. Build Stage: Use AWS Codebuild to compile the code and run tests
3. Deploy Stage: Deploy the code to production and staging environments.

## 4. Setting Up the CI/CD Pipeline

### Step 1: Create a GitHub repository:

1. Login to your GitHub account and create a new repository for your project.
2. Clone the repository to your local machine:

```sh
git clone <github-repo-url>
```
3. Add your application code and push it to GitHub:

```sh
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Set Up AWS CodeBuild:

1. Open the AWS CodeBuild console and create a new build project.

 - Project Name: Enter the name of your project.
 - Source Provider: Select GitHub
 - GitHub Repository: Connect your GitHub account and select the repository.
 - Environment: Choose the appropriate runtime (e.g.: Amazon Linux, Ubuntu, etc.)
 - Buildspec file: Create a `buildspec.yaml` file in your repository

Example: `buildspec.yaml`

```yaml
version: 0.2

phases:
  install:
    commands:
        - echo Installing dependencies...
        - npm install
  build:
    commands:
        - echo Running tests...
        - npm run test
        - echo Building the application...
        - npm run build
  post_build:
    commands:
        - echo Build complete.

artifacts:
  files:
    - '**/*'
  discard-paths: yes
```

2. After creating the project, trigger a manual build to ensure everything is working correctly.

### Step 3: Create the CodePipeline Pipeline

1. Open the AWS CodePipeline console and click Create Pipeline
2. Pipeline Setting:
    - Enter a name for the pipeline.
    - Choose or create a new Service role in the pipeline.
3. Add Source Stage.
    - Source Provider: Choose GitHub
    - Connect your GitHub account and select the repository and branch.
4. Add Build State:
    - Build Provider: Select AWS CodeBuild
    - Choose the CodeBuild project you created earlier.
5. Add Deploy Stage:
    - Deploy Provider: Select your deployment service (e.g.: ECS, ECR, etc.)
    - Configure the deployment setting as required.
6. Review and create the Pipeline:
    - Review the stages and click Create Pipeline
    - The pipeline will start automatically, fetching the latest code from GitHub.

## 5. Example: Deployment Strategy

### Blue/Green Deployment

A blue/Green Deployment strategy is often recommended for ECS because it allows you to deploy new versions of your application while minimizing downtime. This strategy creates a new `green` environment for the updated version and switches traffic over from the `blue` environment only once the new version is validated.

#### Step:

1. Create a New Task Definition Version: Each deployment creates a new task definition version for your ECS service.
2. Update ECS service: Use AWS CodeDeploy to update the ECS service with the new task definition.
3. Shift traffic: Route traffic gradually to the new task set after validating the new application version.

#### Pipeline Components:

##### 1. CodeBuild Stage (Generating ecs-task-def-updated.json)

In the Build Stage, CodeBuild generates a new ECS task definition with an upload image tag based on the last build. This task definition is stored as `ecs-task-def-uploaded.json`, which will later be used in the deployment stage.

Buildspec.yaml for CodeBuild

```yaml
version: 0.2

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
      - echo Pulling image from repository...
  build:
    commands:
      - echo Building Docker image...
      - docker build -t <app-name> .
      - echo Tagging Docker image with latest...
      - docker tag <app-name>:latest <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/<app-name>:latest
      - echo Pushing Docker image to ECR...
      - docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/<app-name>:latest
  post_build:
    commands:
      - echo Creating updated ECS task definition...
      - export IMAGE_URI=<AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/<app-name>:latest
      - sed -e 's|<IMAGE>|'$IMAGE_URI'|g' ecs-task-def-template.json > ecs-task-def-updated.json
artifacts:
  files:
    - ecs-task-def-updated.json
    - codedeploy-appspec.yaml

```

In the example:

- A Docker image is built and pushed to ECR.
- The ECS task definition is updated with the new image URL and saved as `ecs-task-def-updated.json`

##### 2. Creating a CodeDeploy Group (Blue/Green Deployment)
You need to create a CodeDeploy Deployment Group for ACS that will manage Blue/Green deployments.

Step to create a CodeDeploy Group:

1. Open CodeDeploy in the AWS Management Console.
2. Create an Application:
    - Go to Applications and click on Greate Application.
    - Choose ECS as the compute platform.
    - Name the application (e.g., ...)
3. Create a Deployment Group:
    - Go to Deployment Groups and click on Create Deployment Group.
    - Enter a name for your deployment group (e.g., ECSDeploymentGroup).
    - Select the ECS service (cluster and service) you want to deploy to.
    - Select Blue/Green Deployment and configure traffic shifting options.
    - Under AppSpec Content, leave it blank (this will be part of the pipeline artifacts).
4. IAM Role: Ensure that your CodeDeploy application has an associated IAM Role with necessary permissions for ECS, Lambda, and CodeDeploy

##### 3. Creating the AppSpec File for CodeDeploy.

The AppSpec file specifies how CodeDeploy should manage the ECS task and handle Blue/Green deployment. Store this file in your repository.

```yaml
version: 0.0
Resources:
 - TargetService:
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: "arn:aws:ecs:us-east-1:<AWS_ACCOUNT_ID>:task-definition/<TASK_DEF_NAME>"
        LoadBalancerInfo:
          ContainerName: "<container-name>"
          ContainerPort: 80
```

##### 4. Create the CodePipeline with the build and Deploy Stage.

Now you can create a pipeline that includes the Build and Deploy stages using CodeBuild and CodeDeploy.

```JSON
{
  "pipeline": {
    "name": "ECSBlueGreenPipeline",
    "roleArn": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/CodePipelineServiceRole",
    "artifactStore": {
      "type": "S3",
      "location": "my-codepipeline-artifacts"
    },
    "stages": [
      {
        "name": "Source",
        "actions": [
          {
            "name": "SourceAction",
            "actionTypeId": {
              "category": "Source",
              "owner": "AWS",
              "provider": "CodeCommit",
              "version": "1"
            },
            "outputArtifacts": [
              {
                "name": "SourceArtifact"
              }
            ],
            "configuration": {
              "RepositoryName": "my-repo",
              "BranchName": "main"
            }
          }
        ]
      },
      {
        "name": "Build",
        "actions": [
          {
            "name": "BuildAction",
            "actionTypeId": {
              "category": "Build",
              "owner": "AWS",
              "provider": "CodeBuild",
              "version": "1"
            },
            "inputArtifacts": [
              {
                "name": "SourceArtifact"
              }
            ],
            "outputArtifacts": [
              {
                "name": "BuildArtifact"
              }
            ],
            "configuration": {
              "ProjectName": "ECSCodeBuild"
            }
          }
        ]
      },
      {
        "name": "Deploy",
        "actions": [
          {
            "name": "DeployAction",
            "actionTypeId": {
              "category": "Deploy",
              "owner": "AWS",
              "provider": "CodeDeploy",
              "version": "1"
            },
            "inputArtifacts": [
              {
                "name": "BuildArtifact"
              }
            ],
            "configuration": {
              "ApplicationName": "ECSApplication",
              "DeploymentGroupName": "ECSDeploymentGroup",
              "TaskDefinitionTemplateArtifact": "BuildArtifact",
              "TaskDefinitionTemplatePath": "ecs-task-def-updated.json",
              "AppSpecTemplateArtifact": "BuildArtifact",
              "AppSpecTemplatePath": "codedeploy-appspec.yaml"
            }
          }
        ]
      }
    ]
  }
}


```

##### 5. Run the Pipeline

Once the pipeline is set up:

1. Commit your change to the repository.
2. The pipeline will automatically:
    - Trigger the build stage in CodeBuild.
    - Generate the new ECS task definition (ecs-task-def-uploadted.json)
    - Push the Docker image to ECR
    - Deploy the updated task definition using CodeDeploy with a Blue/Green deployment strategy.


## 6. Managing Permissions:

Ensure that the necessary IAM roles have the required permissions:

- Pipeline Role: Must have permissions to access GitHub, codeBuild and any deployment services.
- CodeBuild Role: Should have permission to access the GitHub repository and any other AWS resources needed during the build process.

Example IAM policy for CodePipeline:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "codepipeline:StartPipelineExecution",
        "codepipeline:GetPipeline",
        "codepipeline:GetPipelineState",
        "codepipeline:PutActionRevision"
      ],
      "Resource": "*"
    }
  ]
}


```

## 7. Notifications and Monitoring:

1. CloudWatch Logs: Enable logging for CodeBuild and CodePipline to track build outputs and status
2. AWS Lambda: we can use an AWS Lambda function to push a message to the Slack channel.

## 8. Best Practices:

- Version Control: Use tags or branches in GitHub for versioning releases.
- Automated Testing: Include automated tests in your buildspec to ensure code quality.
- Security: Use IAM policies that follow the principle of least privilege and encrypt artifacts.
- Manual Approvals: For critical deployments, and manual approval steps to ensure governance.

## 9. Conclusion:

Integrating GitHub with AWS CodePiple provides a robust CI/CD solution that automates the build and deployment process. This setup enhances efficiency, improves code quality and accelerates the release of applications.

