import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import { ComponentResource, ComponentResourceOptions } from '@pulumi/pulumi'

import { SUBNET_TYPE, BOUND_TYPE } from './constants'

interface argsInterface {
    cidr: pulumi.Input<string>;

    azs: pulumi.Input<string[]>;
    private_subnets: pulumi.Input<string[]>;
    public_subnets: pulumi.Input<string[]>;

    enable_nat_gateway: pulumi.Input<boolean>;

    tags?: {
        [key: string]: pulumi.Input<string>;
    }
}

export default class NetworkingComponent extends ComponentResource {
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


    constructor(name: string, args: argsInterface, opts?: ComponentResourceOptions) {
        super("custom:networking:VPC", name, {}, opts);
        this.config = args;
        this.name = name;

        this.vpc = this.createVPC()
        this.internetGateway = this.createInternetGateway()

        // Public
        this.subnetsPublic = this.createSubnetResources(args.public_subnets, SUBNET_TYPE.PUBLIC)
        this.routeTablePublic = this.createRouteTableResource(SUBNET_TYPE.PUBLIC)
        this.routePublic = this.createRouteResource(this.routeTablePublic, SUBNET_TYPE.PUBLIC)
        this.routeTableAssociationPublic = this.createRouteTableAssociation(this.subnetsPublic, this.routeTablePublic, SUBNET_TYPE.PUBLIC)
        this.networkAclPublic = this.createNetworkAcl(this.subnetsPublic, SUBNET_TYPE.PUBLIC)
        this.networkAclRulePublicInbound = this.createNetworkAclRule(this.networkAclPublic, SUBNET_TYPE.PUBLIC, BOUND_TYPE.IN_BOUND)
        this.networkAclRulePublicOutbound = this.createNetworkAclRule(this.networkAclPublic, SUBNET_TYPE.PUBLIC, BOUND_TYPE.ON_BOUND)

        // Private
        this.subnetsPrivate = this.createSubnetResources(args.private_subnets, SUBNET_TYPE.PRIVATE)
        this.routeTablePrivate = this.createRouteTableResource(SUBNET_TYPE.PRIVATE)
        // this.routePrivate = this.createRouteResource(this.routeTablePrivate, SUBNET_TYPE.PRIVATE)
        this.routeTableAssociationPrivate = this.createRouteTableAssociation(this.subnetsPrivate, this.routeTablePrivate, SUBNET_TYPE.PRIVATE)
        this.networkAclPrivate = this.createNetworkAcl(this.subnetsPrivate, SUBNET_TYPE.PRIVATE)
        this.networkAclRulePrivateInbound = this.createNetworkAclRule(this.networkAclPrivate, SUBNET_TYPE.PRIVATE, BOUND_TYPE.IN_BOUND)
        this.networkAclRulePrivateOutbound = this.createNetworkAclRule(this.networkAclPrivate, SUBNET_TYPE.PRIVATE, BOUND_TYPE.ON_BOUND)


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
    private createSubnetResources(cidr: pulumi.Input<string[]>, type: string): pulumi.Output<aws.ec2.Subnet[]> {
        const { azs, tags } = this.config
        const vpcId = this.vpc.id

        return pulumi.all([cidr, azs]).apply(([subnets, azs]) => {
            const subnetResources = subnets.map((cidrBlock, index) => {
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
    private createRouteTableResource(type: string): aws.ec2.RouteTable {
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
    private createRouteResource(routeTable: aws.ec2.RouteTable, type: string): aws.ec2.Route {
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

            if (egress === BOUND_TYPE.ON_BOUND) {
                args.egress = true
            }

            return new aws.ec2.NetworkAclRule(
                name,
                args
            )
        })
    }
}
