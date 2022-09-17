const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLNonNull } = graphql;
const { clients, projects } = require('../sampleData');
const Client = require('../models/Client');
const Project = require('../models/Project');
const { resolve } = require('path');

// Client Type
/*
 * 1. fields is written as function to hoist the objects and avoid run time errors
 * 2. In arrow funtion, ({}) is used and not {}, this is because {} signifies a function block syntax, but we want this to retun an object 
 */
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
    })
});


// ProjectType
const ProjectType = new GraphQLObjectType({
    name:'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findById(parent.clientId);
                // return clients.find(client => client.id === parent.clientId);
            }
        }
    })
})

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        client: { 
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Client.findById(args.id);
                // return clients.find(client => client.id === args.id)
            }
        },
        clients: {
            type: new graphql.GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find();
                // return clients;
            }
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Project.findById(args.id);
                // return projects.find(project => project.id === args.id);
            }
        },
        projects: {
            type: new graphql.GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find();
                // return projects;
            }
        }
    }
});

// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addClient: {
            type: ClientType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                const newClient = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                });
                return newClient.save();
                /**
                 * OR
                 * return await Client.create({
                 *  name: args.name,
                    email: args.email,
                    phone: args.phone
                 * })
                 */
            }
        },
        deleteClient: {
            type: ClientType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                return Client.findByIdAndRemove(args.id);
            }
        },
        addProject: {
            type: ProjectType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                status: { type: new GraphQLNonNull(GraphQLString) },
                clientId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                const newProject = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                });

                return newProject.save();
            }
        },
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLID}
            },
            resolve(parent, args) {
                return Project.findByIdAndDelete(args.id);
            }
        },
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: { type: GraphQLString },
            },
            resolve(parent, args) {
                return Project.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            description: args.description,
                            status: args.status
                        },
                    },
                    // if not found, create a new entry
                    { new: true, upsert: true }
                )
            }
        }
    }
})

// export the schema
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation,
});