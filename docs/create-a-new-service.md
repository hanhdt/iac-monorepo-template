# Create a new service

In the guide, we'll walk through creating a new service inside the `packages/functions` directory of a monorepo using Lerna and npm workspaces.

## Step 1: Navigate to the Project Root

Ensure you are in the root directory of your monorepo where the `lerna.json` and `package.json` files reside.

```bash
cd /path/to/your/monorepo
```

## Step 2: Create the New Service

To create a new service, use the following command:

```bash
lerna create service-name packages/functions
```

This command will:

- Create a new folder `service-name` under `packages/functions`.
- Initialize the `package.json` for this service.
- Set up the default structure for your service.

Example:
```bash
lerna create orders-service packages/functions
```

The result will be a new folder `packages/functions/orders-service` with a basic project structure.

## Step 3: Install Dependencies for the Service.

To add specific dependencies to this service, run:

```bash
npm install <dependency> -w packages/functions/service-name
```

For example, to install `express` for an API service:

```bash
npm install express -w packages/functions/orders-service
```

This will:

- Install `express` specifically for the `orders-service`.
- Automatically manage dependencies within the workspace.

## Step 4: Link Internal Dependencies (if needed)

If this new service needs to depend on another internal service or package from your monorepo, use npm workspace to handle the linking automatically.

For example, if `orders-service` needs to use a shared library located in `packages/core`,
you can add it with:

```bash
npm install @iac-monorepo-template/core -w packages/functions/orders-service
```

This will the `@iac-monorepo-template/core` into the `orders-service` using the workspace setup.

## Step 5: Configure and Build the Service

Once the service is created, you can configure it according to your needs. Add any required configurations like setting up API routes, middleware, or database connections inside the service's directory.

For example, you might and the following basic Express service to `orders-service`:

```javascript
// packages/functions/orders-service/lib/orders-service.js

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from Orders Service!');
});

app.listen(port, () => {
  console.log(`Orders service is listening on port ${port}`);
});

```

You can run this service locally with:

```bash
node packages/functions/orders-service/lib/orders-service.js
```

## Step 6: Managing Service Dependencies with Workspaces

By using npm workspaces, dependency management is streamlined across all your services and packages in the monorepo. This replaces the legacy `lerna bootstrap` and `lerna add` commands.

To install all dependencies across the entries monorepo, just run:

```bash
npm install
```

Thi will handle linking and hoisting dependencies properly across all services.

