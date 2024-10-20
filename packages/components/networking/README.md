# NetworkingComponent Documentation

## Overview

This `NetworkingComponent` class, built with Pulumi and AWS SDK, is designed to create and manage an AWS Virtual Private Cloud (VPC) with associated resources such as subnets, route tables, NAT gateways, and flow logs. It allows for flexible configuration by accepting various parameters, enabling the creation of public/private subnets, NAT gateway, and VPC flow logs as needed.

![Networking](docs/images/networking.svg)

## Installation

To use this component, ensure you have Pulumi and the AWS SDK installed.

```bash
npm install @pulumi/pulumi @pulumi/aws
```

## Usage

### Parameters

The `NetworkingComponent` accepts the following arguments through the `argsInterface` interface:

- **`cidr`** (required): The CIDR block for the VPC.
- **`availabilityZones`** (required): A list of availability zones for subnets.
- **`privateSubnets`** (required): CIDR blocks for private subnets.
- **`publicSubnets`** (required): CIDR blocks for public subnets.
- **`enableNatGateway`** (optional): Boolean to enable the creation of a NAT Gateway.
- **`enableFlowLogs`** (optional): Boolean to enable VPC Flow Logs.
- **`tags`** (optional): A dictionary of tags to apply to all resources created by the component.

### Example

```typescript
import * as pulumi from '@pulumi/pulumi';
import NetworkingComponent from "@iac-monorepo-template/vpc-networking-component";

const VPC = new NetworkingComponent("MyVPC", {
    cidr: "10.0.0.0/16",

    availabilityZones: ["ap-northeast-1a", "ap-northeast-1c", "ap-northeast-1d"],
    privateSubnets: ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"],
    publicSubnets: ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"],

    enableNatGateway: true,
    enableFlowLogs: true,

    tags: {
       Environment: "dev"
    }
})
```

### Resources Created

- **VPC**: A new VPC is created using the provided CIDR block.
- **Subnets**: Both public and private subnets are created, distributed across the specified availability zones.
- **Internet Gateway**: An Internet Gateway is created and attached to the VPC.
- **Route Tables and Associations**: Separate route tables are created for public and private subnets.
- **Network ACLs**: Network ACLs are created for public and private subnets.
- **NAT Gateway** (optional): A NAT Gateway is created if `enableNatGateway` is true.
- **Flow Logs** (optional): Flow Logs are created if `enableFlowLogs` is true.

### Key Methods

1. **`createVPC()`**: Creates the VPC using the provided CIDR block.
2. **`createInternetGateway()`**: Creates an Internet Gateway and attaches it to the VPC.
3. **`createSubnet()`**: Creates public/private subnets in the specified availability zones.
4. **`createRouteTable()`**: Creates a route table for public/private subnets.
5. **`createRouteTableAssociation()`**: Associates the route tables with subnets.
6. **`createNetworkAcl()`**: Creates a Network ACL for public/private subnets.
7. **`createNetworkAclRule()`**: Creates Network ACL rules for inbound and outbound traffic.
8. **`createNatGateway()`**: Creates a NAT Gateway (if enabled).
9. **`createRoutePrivateNatGateway()`**: Creates a private route to the NAT Gateway.
10. **`createFlowLogs()`**: Sets up flow logs for the VPC.

### Tags

You can apply custom tags to all resources by passing a `tags` object in the `argsInterface`. For example:

```typescript
tags: {
    Name: "MyVPC",
    Environment: "dev"
}
```

### Enabling Flow Logs

If you wish to enable VPC flow logs, set the `enableFlowLogs` argument to `true`. This will automatically set up CloudWatch logs to capture VPC traffic.

```typescript
enableFlowLogs: true
```

### Enabling NAT Gateway

To route private subnet traffic through a NAT Gateway, set `enableNatGateway` to `true`. A NAT Gateway will be created in one of the public subnets.

```typescript
enableNatGateway: true
```

Certainly! Here’s how you can add a section about retrieving outputs after the networking component has run in your class documentation:


### Outputs

Once the `NetworkingComponent` has successfully run, you can retrieve the following outputs for use in other components or to verify the network configuration:

- **`vpcId`**: The ID of the created VPC.
    ```typescript
    const vpcId = networkingComponent.vpc.id;
    ```

- **`internetGatewayId`**: The ID of the created Internet Gateway.
    ```typescript
    const igwId = networkingComponent.internetGateway.id;
    ```

- **`subnetsPublic`**: A list of IDs for the created public subnets.
    ```typescript
    const publicSubnets = networkingComponent.subnetsPublic.apply(subnets => 
        subnets.map(subnet => subnet.id)
    );
    ```

- **`subnetsPrivate`**: A list of IDs for the created private subnets.
    ```typescript
    const privateSubnets = networkingComponent.subnetsPrivate.apply(subnets => 
        subnets.map(subnet => subnet.id)
    );
    ```

- **`routeTablePublic`**: The ID of the public route table.
    ```typescript
    const publicRouteTableId = networkingComponent.routeTablePublic.id;
    ```

- **`routeTablePrivate`**: The ID of the private route table.
    ```typescript
    const privateRouteTableId = networkingComponent.routeTablePrivate.id;
    ```

- **`networkAclPublic`**: The ID of the public network ACL.
    ```typescript
    const publicNetworkAclId = networkingComponent.networkAclPublic.apply(nacl => nacl.id);
    ```

- **`networkAclPrivate`**: The ID of the private network ACL.
    ```typescript
    const privateNetworkAclId = networkingComponent.networkAclPrivate.apply(nacl => nacl.id);
    ```

#### Example

After creating a `NetworkingComponent`, you can easily retrieve the outputs for further use in your Pulumi project.

```typescript
const networkingComponent = new NetworkingComponent('my-networking', {
    cidr: "10.0.0.0/16",
    availabilityZones: ["us-west-2a", "us-west-2b"],
    privateSubnets: ["10.0.1.0/24", "10.0.2.0/24"],
    publicSubnets: ["10.0.101.0/24", "10.0.102.0/24"],
});

// Retrieve the VPC ID
export const vpcId = networkingComponent.vpc.id;

// Get the list of public subnet IDs
export const publicSubnets = networkingComponent.subnetsPublic.apply(subnets =>
    subnets.map(subnet => subnet.id)
);
```

