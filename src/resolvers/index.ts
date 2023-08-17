import Query from "./query.js";
import Mutation from "./mutation.js";
import { Resolvers } from "../generated/graphql";

const resolvers: Resolvers = {
  Query,
  Mutation
};

export default resolvers;
