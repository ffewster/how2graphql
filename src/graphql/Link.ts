import { objectType, extendType, nonNull, stringArg, intArg } from "nexus";
import { NexusGenObjects } from '../../nexus-typegen'

// In memory db basically
const links: NexusGenObjects['Link'][] = [
    {
        id: 1,
        url: 'http://howtographql.com',
        description: 'Fullstack tutorial for GraphQL'
    },
    {
        id: 2,
        url: 'http://graphql.org',
        description: 'GraphQL official website'
    }
];


// Implementation
export const Link = objectType({
    name: "Link",
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.string('description');
        t.nonNull.string('url');
    },
})


export const LinksQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.nonNull.field('getAllLinks', {
            type: 'Link',
            description: 'Retrieve all links',
            resolve(_parent, _args, _context, _info) {
                return links;
            }
        })
    },
});

export const LinkQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('getOneLink', {
            type: 'Link',
            description: 'Retrieve one link by ID',
            args: {
                id: nonNull(intArg()),
            },
            resolve(_parent, args, _context, _info) {
                return links.find((link) => link.id === args.id) || null;
            }
        })
    }
});

export const DeleteLinkMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('deleteLink', {
            type: 'Link',
            description: 'Delete one link by ID',
            args: {
                id: nonNull(intArg()),
            },
            resolve(_parent, args, _context, _info) {
                let found: NexusGenObjects['Link'];
                for (let i = 0; i < links.length; i++) {
                    if(links[i].id === args.id) {
                        found = links[i];
                        links[i] = links[links.length - 1];
                        links.pop()
                        return found
                    }
                }
                return null;
            }
        })
    },
});

export const UpdateLinkMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('updateLink', {
            type: 'Link',
            description: 'updates a link',
            args: {
                id: nonNull(intArg()),
                description: stringArg(),
                url: stringArg(),
            },
            resolve(_parent, args, _context, _info) {
                const { url, description, id } = args
                const index = links.findIndex(link => link.id === id);
                if(index === -1) return null;
                if(description) links[index].description = description;
                if(url) links[index].url = url;
                return links[index];
            }
        })
    },
})

export const CreateLinkMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('createLink', {
            type: 'Link',
            description: 'creates a new link',
            args: {
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },
            resolve (_parent, args, _context, _info) {
                const { description, url } = args;
                const link = { id: links.length + 1, description, url }
                links.push(link);
                return link;
            }
        })
    }
})
