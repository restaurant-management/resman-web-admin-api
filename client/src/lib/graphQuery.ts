import { gql } from 'apollo-boost';

export class GraphQuery {
    public static LOGIN = gql`
        query LOGIN($password: String!, $usernameOrEmail: String!) {
            loginAsUser(password: $password, usernameOrEmail: $usernameOrEmail)
        }
    `;

    public static users = gql`
        query users {
            users {
                uuid username email avatar birthday address roles {
                    name
                }
            }
        }
    `;

    public static createUser = gql`
        mutation createUser($address: String!, $email: String!, $password: String!, $phoneNumber: String!, $username: String!
                            $storeIds: [Int!], $roles: [String!], $avatar: String, $birthday: DateTime, $fullName: String) {
            createUser(
                phoneNumber: $phoneNumber,
                address: $address,
                password: $password,
                email: $email,
                username: $username,
                storeIds: $storeIds,
                roles: $roles,
                avatar: $avatar,
                birthday: $birthday,
                fullName: $fullName,
            ) {
                uuid
            }
        }
    `;

    public static deleteUser = gql`
        mutation deleteUser($username: String!) {
            deleteUser(username: $username)
        }
    `;

    public static roles = gql`
        query roles {
            roles { id slug name description level permissions }
        }
    `;

    public static stores = gql`
        query stores {
            stores {
                id name amountDishes address closeTime openTime hotline logo
            }
        }
    `;
}
