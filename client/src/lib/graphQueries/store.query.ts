import { gql } from 'apollo-boost';

export class StoreQuery {

    public static stores = gql`
        query stores {
            stores {
                id name amountDishes address closeTime openTime hotline logo
            }
        }
    `;

    public static getStore = gql`
        query getStore($id: Int!) {
            getStore(id: $id) {
                id
                name
                description
                logo
                address
                hotline
                rating
                openTime
                closeTime
            }
        }
    `;

    public static createStore = gql`
        mutation createStore($name: String!, $hotline: String!, $address: String!, $closeTime: time, $openTime: time,
                            $description: String, $dishIds: [Int!], $dishPrices: [Float!], $logo: String) {
            createStore(address: $address, hotline: $hotline, name: $name, closeTime: $closeTime, description: $description,
                        dishIds: $dishIds, dishPrices: $dishPrices, logo: $logo, openTime: $openTime) {
                id
            }
        }
    `;

    public static editStore = gql`
        mutation editStore($id: Int!, $name: String, $hotline: String, $address: String, $closeTime: time, $openTime: time,
                            $description: String, $logo: String) {
            editStore(id: $id, address: $address, closeTime: $closeTime, description: $description, hotline: $hotline,
                        logo: $logo, openTime: $openTime, name: $name) {
                id
            }
        }
    `;

    public static deleteStore = gql`
        mutation deleteStore($id: Int!) {
            deleteStore(id: $id)
        }
    `;
}
