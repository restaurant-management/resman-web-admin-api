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
                uuid username email avatar birthday phoneNumber address roles {
                    name
                }
            }
        }
    `;

    public static getUser = gql`
        query getUser($username: String!) {
            getUser(username: $username) {
                uuid
                username
                fullName
                email
                avatar
                birthday
                phoneNumber
                address
                roles {
                    slug
                }
                stores {
                    id
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

    public static editUser = gql`
        mutation editUser($address: String, $password: String, $phoneNumber: String, $username: String
                            $storeIds: [Int!], $roles: [String!], $avatar: String, $birthday: DateTime, $fullName: String) {
            editUser(
                username: $username,
                password: $password,
                phoneNumber: $phoneNumber,
                address: $address,
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

    public static deleteUsers = gql`
        mutation deleteUsers($usernames: [String!]!) {
            deleteUsers(usernames: $usernames)
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
