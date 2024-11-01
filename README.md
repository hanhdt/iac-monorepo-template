# IaC Monorepo Template

This repository is a minimal AWS TypeScript Pulumi monorepo template. It is designed to help you manage infrastructure as code (IaC) using Pulumi, organized in a monorepo structure with multiple packages by using Lerna.

## Philosophy

This template is designed to help you manage your infrastructure as code in a monorepo structure. It is based on the following principles:

![Monorepo Structure](docs/images/monorepo-polyrepo.svg)

- **Monorepo**: A single repository to manage all your infrastructure code.
- **Infrastructure as Code**: Use IaC framework to manage the infrastructure and automate deployments.
- **Domain-Driven Design**: Each package should represent a domain or a specific area of the infrastructure.
- **Packages**: Each package is a separate NPM package that can be shared across the monorepo.
- **Dependencies**: Packages can depend on each other, and shared code can be reused across packages.
- **Testing**: Write tests for infrastructure code to ensure correctness and reliability.
- **CI/CD**: Use CI/CD pipelines to automate testing, linting, and deployment.

## Project Structure

```plaintext
  .gitignore
  .vscode/
  └── settings.json
  infra/
  ├── Pulumi.dev.yaml
  ├── Pulumi.yaml
  ├── index.ts
  └── src/
      ├── component1/
      │   └── index.ts
      ├── component2/
      │   ├── index.ts
      └── component3/
          └── index.ts
  lerna.json
  package.json
  packages/
  ├── core/
  ├── frontend/
  ├── functions/
      ├── service1/
          ├── Pulumi.dev.yaml
          ├── Pulumi.yaml
      │   └── index.ts
      ├── service2/
          ├── Pulumi.dev.yaml
          ├── Pulumi.yaml
      │   └── index.ts
      └── service3/
          ├── Pulumi.dev.yaml
          ├── Pulumi.yaml
          └── index.ts
  └── scripts/
  README.md
  tsconfig.json
```

### Key Directories and Files

This template uses NPM Workspaces and Lerna to manage the monorepo structure.

- **infra/**: Defines our base cloud infrastructure.
  - **index.ts**: Entry point for Pulumi to deploy the infrastructure.
  - **src/**: Contains subdirectories for different infrastructure components.
- **packages/**: Contains various packages used in the monorepo. Each package is a separate NPM package.
  - **core/**: Core is for utilities and shared business-logic codes that can used across other packages.
  - **frontend/**: Frontend-related code and static assets.
  - **functions/**: Serverless domain services and they will use the Core package as a local dependency.
  - **scripts/**: Utility scripts across the project.
  - **components/**: Reusable infra components that can be used across different packages.
- **Pulumi.yaml**: Pulumi configuration file.
- **lerna.json**: Lerna configuration file for managing the monorepo.
- **package.json**: Root package.json file for the monorepo.

## Getting Started

### Prerequisites

- Node.js
- NPM or Yarn
- Pulumi CLI
- AWS CLI
- Lerna

### Installation

#### 1. Clone the repository

  ```sh
    git clone <repository-url>
    cd iac-monorepo-template
  ```

#### 2. Install dependencies

  ```sh
    npm install
    
    # This only applies to Lerna with the version less than 7
    lerna bootstrap
  ```

### Deploying the Infrastructure

To deploy the infrastructure using Pulumi, run:

```sh
  npm install deploy
```

### Destroying the Infrastructure

To destroy the infrastructure using Pulumi, run:

```sh
  npm run destroy
```

### Adding new packages

To add a new package to the monorepo, use Lerna:

```sh
  lerna create <package-name> packages
```

### Adding new services

To add new services to the monorepo, use Lerna:

```sh
  lerna create <service-name> packages/functions
```

### Run a npm script in each package

```sh
  lerna run <my-script> -- [..args] # runs npm run my-script in all packages that have it
  lerna run --scope @my-scope/my-package my-script # runs npm run my-script in a specific package
```

### Execute an arbitrary command in each package

```sh
  lerna exec -- <command>
```

You may also run a script located in the scripts dir, in a complicated dir structure through the environment variable LERNA_ROOT_PATH:

```sh
  LERNA_ROOT_PATH=packages/scripts lerna exec -- node \$LERNA_ROOT_PATH/some-script.js
```

### Contributing

Contributions are welcome! Please open an issue or submit a pull request
