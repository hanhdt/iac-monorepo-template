# IaC Monorepo Template

This repository is a minimal AWS TypeScript Pulumi monorepo template. It is designed to help you manage infrastructure as code (IaC) using Pulumi, organized in a monorepo structure with multiple packages by using Lerna.

## Philosophy

This template is designed to help you manage your infrastructure as code in a monorepo structure. It is based on the following principles:

- **Monorepo**: A single repository to manage all your infrastructure code.
- **Domain-Driven Design**: Each package should represent a domain or a specific area of the infrastructure.
- **Packages**: Each package is a separate NPM package that can be shared across the monorepo.
- **Dependencies**: Packages can depend on each other, and shared code can be reused across packages.
- **Separation of Concerns**: Each package should have a clear responsibility and should be decoupled from other packages.
- **Reusability**: Shared code should be extracted into a separate package and reused across other packages.
- **Consistency**: Follow a consistent structure and naming convention across packages.
- **Scalability**: The monorepo structure should scale as the infrastructure grows.
- **Automation**: Use scripts and tools to automate common tasks and workflows.
- **Documentation**: Document the architecture, design decisions, and workflows.
- **Testing**: Write tests for infrastructure code to ensure correctness and reliability.
- **Continuous Integration**: Use CI/CD pipelines to automate testing, linting, and deployment.
- **Versioning**: Use semantic versioning to manage package versions and releases.
- **Infrastructure as Code**: Use Pulumi to manage infrastructure as code and automate deployments.

## Project Structure

```plaintext
  .gitignore
  .vscode/
  └── settings.json
  infra/
  ├── index.ts
  └── src/
      ├── component1/
      │ └── index.ts
      ├── component2/
      │ ├── index.ts
      └── component3/
        └── index.ts
  lerna.json
  package.json
  packages/
  ├── core/
  ├── frontend/
  ├── functions/
  └── scripts/
  Pulumi.dev.yaml
  Pulumi.yaml
  README.md
  tsconfig.json
```

### Key Directories and Files

This template uses NPM Workspaces and Lerna to manage the monorepo structure.

- **infra/**: Defines our main cloud infrastructure.
  - **index.ts**: Entry point for Pulumi to deploy the infrastructure.
  - **src/**: Contains subdirectories for different infrastructure components.
- **packages/**: Contains various packages used in the monorepo. Each package is a separate NPM package.
  - **core/**: Core is for utilities and shared code. It is used across other packages.
  - **frontend/**: Frontend-related code and static assets.
  - **functions/**: AWS Lambda functions and it uses the Core package as a local dependency.
  - **scripts/**: This is for any utility scripts.
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

1. Clone the repository:

  ```sh
    git clone <repository-url>
    cd iac-monorepo-template
  ```

1. Install dependencies:

  ```sh
    npm install
    lerna bootstrap
  ```

### Building the Project

To build the project, run:

```sh
  npm run build
```

### Deploying the Infrastructure

To deploy the infrastructure using Pulumi, run:

```sh
  pulumi up
```

### Adding New Packages

To add a new package to the monorepo, use Lerna:

```sh
  lerna create <package-name> packages/<package-name>
```

### Contributing

Contributions are welcome! Please open an issue or submit a pull request
