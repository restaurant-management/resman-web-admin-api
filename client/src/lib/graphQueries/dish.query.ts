import { gql } from 'apollo-boost';

export class DishQuery {
    public static dishes = gql`
        query dishes($storeId: Int) {
            dishes(storeId: $storeId) {
                id
                name
                images
                description
                defaultPrice
                price
            }
        }
    `;

    public static getDish = gql`
        query getDish($id: ID!) {
            getDish(id: $id) {
                id
                name
                images
                description
                defaultPrice
                price
            }
        }
    `;

    public static createDish = gql`
        mutation createDish($name: String!, $images: [String!], $description: String, $defaultPrice: Float) {
            createDish(name: $name, images: $images, description: $description, defaultPrice: $defaultPrice) {
                id
            }
        }
    `;

    public static editDish = gql`
        mutation editDish($id: ID!, $name: String, $images: [String!], $description: String, $defaultPrice: Float) {
            editDish(id: $id, name: $name, images: $images, description: $description, defaultPrice: $defaultPrice) {
                id
            }
        }
    `;

    public static deleteDish = gql`
        mutation deleteDish($id: ID!) {
            deleteDish(id: $id)
        }
    `;

    public static deleteDishes = gql`
        mutation deleteDishes($ids: [ID!]!) {
            deleteDishes(ids: $ids)
        }
    `;
}
