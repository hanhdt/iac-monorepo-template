# Create a new package with Lerna

Lerna is a tool used to manage monorepos, where multiple packages are maintained in a single repository. To create a new package in the `packages` directory using `Lerna` with version 8.1.8, follow these steps.

## Step 1: Initialize a Lerna Project

If you haven't already initialized a Lerna project, you need to do so first. Run the following command to initialize your Lerna monorepo:

```bash
lerna init
```

> Before that, you need to install Lerna in the global environment
> npm install -g lerna

This will create the basic structure of your monorepo, including a `lerna.json` file and a `packages` folder where your packages will be stored.

## Step 2: Create a new package

To create a new package in the `packages` directory, you can use the `lerna create` command. This command will automatically create a new package with the necessary files (like `packages.json`) and place it in the `packages` directory.

Here is the command

```sh
lerna create app1
```

This will:
1. Create a new folder `app1` inside the `packages` directory.
2. Set up a new package with a basic `package.json` file inside the `app1` folder.
3. Initialize the package as a separate module within your monorepo.

> Note: there is no need to specify the `packages` directory manually because Lerba automatically manages packages in the directories in the `lerna.json` file.

## Step 3: Customize the `lerna.json` (Optional)

By default, Lerna uses the `packages` directory to store all the packages. If you want to create packages in different directories, you can modify the `lerna.json` file.

For example, if you want to manage packages in multiple directories like `modules` or `components` or `packages/functions` you can update your `lerna.json` as follows:

```json
{
  "packages": [
    "packages/*",
    "modules/*",
    "components/*",
    "packages/functions/*",
 ],
  "version": "independent"
}

```

## Step 4: Install Dependencies

To install all dependencies and link internal packages, simply use your package manager's `install`

```bash
npm install
# or
yarn install
# or
pnpm install
```

This will install external dependencies and link internal packages automatically, replacing the need for `lerna bootstrap`

## Step 5: Adding Dependencies

To add a dependency to a specific package, use the following command based on your package manager:

```bash
npm install <dependency> -w <package-name>

# example: npm install moment -s -w app1
```

This will update the `package.json` of the specified package and link the dependency correctly within the workspace, replacing the need for `lerna add`.


---
With these steps, you can easily create and manage new packages using Lerna within the packages directory or any other directory specified in your lerna.json configuration.