import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { MutationOptions, QueryOptions } from 'apollo-client/core/watchQueryOptions';

export class GraphClient {
    public static create(token?: string) {
        const config = {
            uri: '/graph',
            cache: new InMemoryCache(),
            headers: { Authorization: token }
        };

        return new ApolloClient(config);
    }

    public static async query(data: {
        token?: string,
        query: QueryOptions
    }) {
        try {
            return (await GraphClient.create(data.token)
                .query(data.query)).data;
        } catch (e) {
            if (e.graphQLErrors && e.graphQLErrors.length > 0) {
                throw e.graphQLErrors[0].message;
            } else { throw e.toString(); }
        }
    }

    public static async mutation(data: {
        token?: string,
        mutation: MutationOptions
    }) {
        try {
            return (await GraphClient.create(data.token)
                .mutate(data.mutation)).data;
        } catch (e) {
            if (e.graphQLErrors && e.graphQLErrors.length > 0) {
                throw e.graphQLErrors[0].message;
            } else { throw e.toString(); }
        }
    }
}
