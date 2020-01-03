import { gql } from 'apollo-boost';

export class WarehouseQuery {
    public static warehouses = gql`
        query warehouses {
            warehouses {
                id
                name
                hotline
                description
                address
            }
        }
    `;

    public static getWarehouse = gql`
        query getWarehouse($id: ID!) {
            getWarehouse(id: $id) {
                address
                description
                id
                hotline
                name
                warehouseStocks {
                    quantity
                    stockId
                    warehouseId
                }
            }
        }
    `;

    public static createWarehouse = gql`
        mutation createWarehouse($address: String!, $description: String, $hotline: String!, $name: String!, $storeId: ID) {
            createWarehouse(address: $address, hotline: $hotline, name: $name, description: $description, storeId: $storeId) {
                id
            }
        }
    `;

    public static editWarehouse = gql`
        mutation editWarehouse($address: String, $description: String, $hotline: String, $name: String, $storeId: ID, $id: ID!) {
            editWarehouse(id: $id, name: $name, storeId: $storeId, hotline: $hotline, description: $description, address: $address) {
                id
            }
        }
    `;

    public static deleteWarehouse = gql`
        mutation deleteWarehouse($id: ID!) {
            deleteWarehouse(id: $id)
        }
    `;

    public static deleteWarehouses = gql`
        mutation deleteWarehouses($ids: [ID!]!) {
            deleteWarehouses(ids: $ids)
        }
    `;
}
