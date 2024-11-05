import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import { readFile } from "node:fs/promises";
import { authMiddleware, handleSignin } from './auth.js';
import { resolvers } from './resolvers.js';
import { getUser } from './db/users.js';
import { createCompanyLoader } from './db/companies.js';
const PORT = 9000;
const app = express();
app.use(cors(), express.json(), authMiddleware);
app.post('/login', handleSignin);
const typeDefs = await readFile('./schema.graphql', 'utf8');
async function getContext({ req }) {
    const companyLoader = createCompanyLoader();
    const context = { companyLoader };
    if (req.auth) {
        context.user = await getUser(req.auth.sub);
    }
    return context;
}
const server = new ApolloServer({
    typeDefs, resolvers
});
await server.start();
app.use('/graphql', apolloMiddleware(server, { context: getContext }));
app.listen({ port: PORT }, () => {
    console.log('------server running on---', PORT);
});
