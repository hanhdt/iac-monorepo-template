import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';

import { SUBNET_TYPE, FLOW_DIRECTION } from './constants'

interface argsInterface {
    cidr: pulumi.Input<string>;

    availabilityZones: pulumi.Input<string[]>;
    privateSubnets: pulumi.Input<string[]>;
    publicSubnets: pulumi.Input<string[]>;

    enableNatGateway?: pulumi.Input<boolean>;
    enableFlowLogs?: pulumi.Input<boolean>;

    tags?: {
        [key: string]: pulumi.Input<string>;
    }
}

export default class NetworkingComponent extends pulumi.ComponentResource {
    public readonly name: string;
    public readonly config: argsInterface;
    public readonly vpc: aws.ec2.Vpc;
    public readonly internetGateway: aws.ec2.InternetGateway;

    // Public
    public readonly subnetsPublic: pulumi.Output<aws.ec2.Subnet[]>;
    public readonly routeTablePublic: aws.ec2.RouteTable;
    public readonly routePublic: aws.ec2.Route
    public readonly routeTableAssociationPublic: pulumi.Output<aws.ec2.RouteTableAssociation[]>
    public readonly networkAclPublic: pulumi.Output<aws.ec2.NetworkAcl>
    public readonly networkAclRulePublicInbound: pulumi.Output<aws.ec2.NetworkAclRule>
    public readonly networkAclRulePublicOutbound: pulumi.Output<aws.ec2.NetworkAclRule>

    // Private
    public readonly subnetsPrivate: pulumi.Output<aws.ec2.Subnet[]>;
    public readonly routeTablePrivate: aws.ec2.RouteTable;
    // public readonly routePrivate: aws.ec2.Route
    public readonly routeTableAssociationPrivate: pulumi.Output<aws.ec2.RouteTableAssociation[]>
    public readonly networkAclPrivate: pulumi.Output<aws.ec2.NetworkAcl>
    public readonly networkAclRulePrivateInbound: pulumi.Output<aws.ec2.NetworkAclRule>
    public readonly networkAclRulePrivateOutbound: pulumi.Output<aws.ec2.NetworkAclRule>

    // Nat
    public readonly natGateway?: pulumi.Output<aws.ec2.NatGateway>
    public readonly routePrivateNatGateway?: pulumi.Output<aws.ec2.Route>


    constructor(name: string, args: argsInterface, opts?: pulumi.ComponentResourceOptions) {
        super("custom:networking:VPC", name.toLowerCase(), {}, opts);
        this.config = args;
        this.name = name.toLowerCase();

        this.vpc = this.createVPC()
        this.internetGateway = this.createInternetGateway()

        // Public
        this.subnetsPublic = this.createSubnet(args.publicSubnets, SUBNET_TYPE.PUBLIC)
        this.routeTablePublic = this.createRouteTable(SUBNET_TYPE.PUBLIC)
        this.routePublic = this.createRoute(this.routeTablePublic, SUBNET_TYPE.PUBLIC)
        this.routeTableAssociationPublic = this.createRouteTableAssociation(this.subnetsPublic, this.routeTablePublic, SUBNET_TYPE.PUBLIC)
        this.networkAclPublic = this.createNetworkAcl(this.subnetsPublic, SUBNET_TYPE.PUBLIC)
        this.networkAclRulePublicInbound = this.createNetworkAclRule(this.networkAclPublic, SUBNET_TYPE.PUBLIC, FLOW_DIRECTION.IN_BOUND)
        this.networkAclRulePublicOutbound = this.createNetworkAclRule(this.networkAclPublic, SUBNET_TYPE.PUBLIC, FLOW_DIRECTION.ON_BOUND)

        // Private
        this.subnetsPrivate = this.createSubnet(args.privateSubnets, SUBNET_TYPE.PRIVATE)
        this.routeTablePrivate = this.createRouteTable(SUBNET_TYPE.PRIVATE)
        // this.routePrivate = this.createRoute(this.routeTablePrivate, SUBNET_TYPE.PRIVATE)
        this.routeTableAssociationPrivate = this.createRouteTableAssociation(this.subnetsPrivate, this.routeTablePrivate, SUBNET_TYPE.PRIVATE)
        this.networkAclPrivate = this.createNetworkAcl(this.subnetsPrivate, SUBNET_TYPE.PRIVATE)
        this.networkAclRulePrivateInbound = this.createNetworkAclRule(this.networkAclPrivate, SUBNET_TYPE.PRIVATE, FLOW_DIRECTION.IN_BOUND)
        this.networkAclRulePrivateOutbound = this.createNetworkAclRule(this.networkAclPrivate, SUBNET_TYPE.PRIVATE, FLOW_DIRECTION.ON_BOUND)

        // NAT Gateway
        if (args.enableNatGateway) {
            this.natGateway = this.createNatGateway(this.subnetsPublic)
            this.routePrivateNatGateway = this.createRoutePrivateNatGateway(this.natGateway, this.routeTablePrivate)
        }

        // Flow Logs
        if (args.enableFlowLogs) {
            this.createFlowLogs()
        }
    }

    // Create a VPC
    private createVPC(): aws.ec2.Vpc {
        const nameVPC = `${this.name}-vpc`
        const {
            cidr,
            tags
        } = this.config

        return new aws.ec2.Vpc(
            nameVPC,
            {
                cidrBlock: cidr,
                enableDnsSupport: true,
                enableDnsHostnames: true,
                tags: {
                    ...tags,
                    Name: nameVPC
                }
            }
        )
    }

    // Create InternetGateway
    private createInternetGateway(): aws.ec2.InternetGateway {
        const nameIGW = `${this.name}-igw`;
        const { tags } = this.config;

        return new aws.ec2.InternetGateway(
            nameIGW,
            {
                vpcId: this.vpc.id,
                tags: {
                    ...tags,
                    Name: nameIGW
                }
            }
        )
    }

    // Create subnet resource
    private createSubnet(cidrs: pulumi.Input<string[]>, type: string): pulumi.Output<aws.ec2.Subnet[]> {
        const { availabilityZones, tags } = this.config
        const vpcId = this.vpc.id

        return pulumi.all([cidrs, availabilityZones]).apply(([cidrs, azs]) => {
            const subnetResources = cidrs.map((cidrBlock, index) => {
                const nameSubnet = `${this.name}-${type}-${index}`
                return new aws.ec2.Subnet(nameSubnet, {
                    vpcId: vpcId,
                    cidrBlock: cidrBlock,
                    availabilityZone: azs[index],
                    tags: {
                        ...tags,
                        Name: nameSubnet
                    }
                });
            });

            return subnetResources;
        })
    }

    // create route table resource
    private createRouteTable(type: string): aws.ec2.RouteTable {
        const nameRouteTable = `${this.name}-${type}-rt`
        const { tags } = this.config

        return new aws.ec2.RouteTable(
            nameRouteTable,
            {
                vpcId: this.vpc.id,
                tags: { ...tags, Name: nameRouteTable }
            }
        )
    }

    // create route resource
    private createRoute(routeTable: aws.ec2.RouteTable, type: string): aws.ec2.Route {
        const nameRouteTable = `${this.name}-${type}-rt`
        let customArgs: aws.ec2.RouteArgs = {
            routeTableId: routeTable.id,
        }

        if (type === SUBNET_TYPE.PUBLIC) {
            customArgs = {
                ...customArgs,
                destinationCidrBlock: "0.0.0.0/0",
                gatewayId: this.internetGateway.id
            }
        }

        return new aws.ec2.Route(
            nameRouteTable,
            customArgs
        )
    }

    // Create route table asociation 
    private createRouteTableAssociation(subnets: pulumi.Output<aws.ec2.Subnet[]>, routeTable: aws.ec2.RouteTable, type: string): pulumi.Output<aws.ec2.RouteTableAssociation[]> {
        return pulumi.all([subnets]).apply(([subnets]) => {
            const assoc = subnets.map((subnet, index) => {
                const name = `${this.name}-${type}-assoc-${index}`

                return new aws.ec2.RouteTableAssociation(
                    name,
                    {
                        subnetId: subnet.id,
                        routeTableId: routeTable.id
                    }
                )
            })

            return assoc
        })
    }

    // Create Network ACL
    private createNetworkAcl(subnets: pulumi.Output<aws.ec2.Subnet[]>, type: string): pulumi.Output<aws.ec2.NetworkAcl> {
        return pulumi.output(subnets).apply((subnets) => {
            const subnetIds = subnets.map((subnet) => subnet.id)
            const name = `${this.name}-${type}-acl`

            return new aws.ec2.NetworkAcl(
                name,
                {
                    vpcId: this.vpc.id,
                    subnetIds
                }
            )
        })
    }

    // Create Network ACL rule
    private createNetworkAclRule(networkAcl: pulumi.Output<aws.ec2.NetworkAcl>, type: string, egress: string) {
        return pulumi.output(networkAcl).apply((networkAcl) => {
            const networkAclId = networkAcl.id
            const name = `${this.name}-${type}-${egress}-acl-rule`
            let args: aws.ec2.NetworkAclRuleArgs = {
                networkAclId,
                egress: false,
                ruleNumber: 100,
                ruleAction: 'allow',
                fromPort: 0,
                toPort: 0,
                protocol: "-1",
                cidrBlock: "0.0.0.0/0"
            }

            if (egress === FLOW_DIRECTION.ON_BOUND) {
                args.egress = true
            }

            return new aws.ec2.NetworkAclRule(
                name,
                args
            )
        })
    }

    // Create a Nat Gateway
    private createNatGateway(subnets: pulumi.Output<aws.ec2.Subnet[]>): pulumi.Output<aws.ec2.NatGateway> {
        const { tags } = this.config

        return pulumi.all([subnets]).apply(([subnets]) => {
            const natEip = new aws.ec2.Eip(`${this.name}-eip`)
            const name = `${this.name}-nat`

            return new aws.ec2.NatGateway(
                name,
                {
                    subnetId: subnets[0].id,
                    allocationId: natEip.id,
                    tags: {
                        ...tags,
                        Name: name
                    }
                }
            )
        })
    }

    //  Create a Route for Private to NAT
    private createRoutePrivateNatGateway(nat: pulumi.Output<aws.ec2.NatGateway>, privateRoute: aws.ec2.RouteTable): pulumi.Output<aws.ec2.Route> {
        return pulumi.output(nat).apply((nat) => {
            const name = `${this.name}-route-nat-gateway`

            return new aws.ec2.Route(
                name,
                {
                    natGatewayId: nat.id,
                    routeTableId: privateRoute.id,
                    destinationCidrBlock: "0.0.0.0/0"
                }
            )
        })
    }

    // Create Flow logs for VPC
    private createFlowLogs(): aws.ec2.FlowLog {
        // Create role.
        const role = new aws.iam.Role(`${this.name}-flow-log-role`, {
            assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
                Service: "vpc-flow-logs.amazonaws.com"
            })
        })

        // Attach policy to allow log to log to cloudwatch
        new aws.iam.RolePolicyAttachment(`${this.name}-log-role-rolicy`, {
            role: role.name,
            policyArn: aws.iam.ManagedPolicies.CloudWatchLogsFullAccess
        })

        // Create log group on Cloudwatch to store Flow Logs
        const logGroup = new aws.cloudwatch.LogGroup(`${this.name}-vpc-flow-logs-log-group`)

        // Create Flow logs for VPC
        return new aws.ec2.FlowLog(`${this.name}-vpc-flow-logs`, {
            vpcId: this.vpc.id,
            trafficType: "ALL",
            logDestinationType: "cloud-watch-logs",
            logDestination: logGroup.arn,
            iamRoleArn: role.arn
        })
    }
}
