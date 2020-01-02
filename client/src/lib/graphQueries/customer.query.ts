import { gql } from 'apollo-boost';

export class CustomerQuery {
    public static customers = gql`
        query customers {
            customers {
                uuid
                username
                fullName
                email
                avatar
                birthday
                phoneNumber,
                addresses {
                    address
                }
            }
        }
    `;

    public static getCustomer = gql`
        query getCustomer($username: String!) {
            getCustomer(username: $username) {
                uuid
                username
                fullName
                email
                avatar
                birthday
                phoneNumber
                addresses {
                    id
                    address
                    longitude
                    latitude
                }
            }
        }
    `;

    public static createCustomer = gql`
        mutation createCustomer($email: String!, $password: String!, $phoneNumber: String, $username: String!
                            $avatar: String, $birthday: DateTime, $fullName: String, $addresses: [AddressInput!]) {
            createCustomer(
                username: $username,
                email: $email,
                password: $password,
                phoneNumber: $phoneNumber,
                fullName: $fullName,
                avatar: $avatar,
                birthday: $birthday,
                addresses: $addresses
            ) {
                uuid
            }
        }
    `;

    public static editCustomer = gql`
        mutation editCustomer($password: String, $phoneNumber: String, $username: String!
                            $avatar: String, $birthday: DateTime, $fullName: String, $addresses: [AddressInput!]) {
            editCustomer(
                username: $username,
                password: $password,
                phoneNumber: $phoneNumber,
                fullName: $fullName,
                avatar: $avatar,
                birthday: $birthday,
                addresses: $addresses
            ) {
                uuid
            }
        }
    `;

    public static deleteCustomer = gql`
        mutation deleteCustomer($username: String!) {
            deleteCustomer(username: $username)
        }
    `;

    public static deleteCustomers = gql`
        mutation deleteCustomers($usernames: [String!]!) {
            deleteCustomers(usernames: $usernames)
        }
    `;
}
