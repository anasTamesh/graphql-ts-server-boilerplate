import { ResolverMap } from "../../types/graphql-utils";
import { GQL } from "../../types/schema";


export const resolvers: ResolverMap = {
    Query: {
      hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Hello from ${name || "World"}`
    },
  };