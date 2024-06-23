import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"

import mergeResolvers from "./resolvers"
import mergedTypeDefs from "./typeDefs"
 
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergeResolvers,
})
 
const { url } = await startStandaloneServer(server)
 
console.log(`🚀 Server ready at ${url}`)
