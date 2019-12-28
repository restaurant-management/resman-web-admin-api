import { gql } from 'apollo-boost';

export class GraphQuery {
    public static LOGIN = gql`
        query LOGIN($password: String!, $usernameOrEmail: String!) {
            loginAsUser(password: $password, usernameOrEmail: $usernameOrEmail)
        }
    `;

    public static GET_USER = gql`
        query GET_USER {
            users {
                uuid username email avatar birthday address roles {
                    name
                }
            }
        }
    `;

    public static CREATE_USER = gql`
        mutation CREATE_USER($address: String!, $email: String!, $password: String!, $phoneNumber: String!, $username: String!
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

    public static GET_ROLES = gql`
        query GET_ROLES {
            roles {
                id description level name permissions slug
            }
        }
    `;

    public static GET_STORES = gql`
        query GET_STORES {
            stores {
                id name amountDishes address closeTime openTime hotline logo
            }
        }
    `;
}
