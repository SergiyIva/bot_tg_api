import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import "dotenv/config";
import fs from "fs";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import resolvers from "./resolvers/index.js";
import { print } from "./utility/const.js";
import { bot } from "./bot/index.js";
const port = process.env.PORT || 3000;
const typeDefs = fs.readFileSync("./src/typeDefs.graphql", "utf-8");
const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    //validationRules: [depthLimit(15), complexity.createComplexityLimitRule(1000)]
});
await server.start();
app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token })
}));
app.get("/", (req, res) => {
    res.send("Hello from there!");
});
await new Promise((resolve) => httpServer.listen({ port }, resolve));
print(`🚀 Server ready at http://localhost:${port}/graphql`);
await bot.launch();
// ниже действия выполняются при остановке node процесса
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
