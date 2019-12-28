import ApolloClient, { InMemoryCache } from 'apollo-boost';

export class GraphClient {
    public static create(token?: string) {
        return new ApolloClient({
            uri: '/graph',
            cache: new InMemoryCache(),
            headers: { Authorization: token },
        });
    }
}
