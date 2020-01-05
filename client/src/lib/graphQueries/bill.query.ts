import { gql } from 'apollo-boost';

export class BillQuery {
    public static bills = gql`
        query bills($storeId: Int!, $startDay: DateTime, $endDay: DateTime) {
            bills(storeId: $storeId, startDay: $startDay, endDay: $endDay) {
                collectAt
                collectValue
                createAt
                discountValue
                id
                note
                prepareAt
                voucherValue
                voucherCode
                voucherIsPercent
                tableNumber
                rating
                discountCode
                customer {
                    username uuid
                }
                createBy {
                    username uuid
                }
                prepareBy {
                    username uuid
                }
                collectBy {
                    username uuid
                }
            }
        }
    `;

    public static getBill = gql`
        query getBill($id: ID!) {
            getBill(id: $id) {
                collectAt
                collectBy {
                    username uuid
                }
                collectValue
                createAt
                createBy {
                    username uuid
                }
                discountCode
                discountValue
                customer {
                    username uuid
                }
                id
                note
                prepareAt
                rating
                prepareBy {
                    username uuid
                }
                tableNumber
                voucherCode
                voucherIsPercent
                voucherValue
                dishes {
                    price
                    quantity
                    note
                    dishId
                }
            }
        }
    `;

    public static createBillByAdmin = gql`
        mutation createBillByAdmin(
            $collectAt: DateTime, $collectByUuid: String, $collectValue: Float, $prepareAt: DateTime, $prepareByUuid: String,
            $customerUuid: String, $discountCode: String, $dishIds: [ID!]!, $dishQuantities: [Int!], $note: String,
            $storeId: ID!, $tableNumber: Int!, $voucherCode: String, $createByUuid: String!) {
            createBillByAdmin(dishIds: $dishIds, storeId: $storeId, tableNumber: $tableNumber, dishQuantities: $dishQuantities,
                note: $note, discountCode: $discountCode, customerUuid: $customerUuid, voucherCode: $voucherCode,
                createByUuid: $createByUuid, collectAt: $collectAt, collectByUuid: $collectByUuid, collectValue: $collectValue,
                prepareAt: $prepareAt, prepareByUuid: $prepareByUuid
            ) {
                id
            }
        }
    `;

    public static editBill = gql`
        mutation editBill($collectAt: DateTime, $collectByUuid: String, $collectValue: Float, $customerUuid: String, $discountCode: String
            $dishIds: [ID!], $dishNotes: [String!], $dishQuantities: [Int!], $id: ID!, $note: String, $prepareAt: DateTime
            $prepareByUuid: String, $rating: Float, $tableNumber: Int, $voucherCode: String) {
            editBill(dishIds: $dishIds, id: $id, tableNumber: $tableNumber, collectAt: $collectAt, collectByUuid: $collectByUuid,
                collectValue: $collectValue, customerUuid: $customerUuid, discountCode: $discountCode, dishNotes: $dishNotes,
                dishQuantities: $dishQuantities, note: $note, prepareAt: $prepareAt, prepareByUuid: $prepareByUuid,
                rating: $rating, voucherCode: $voucherCode) {
                id
            }
        }
    `;

    public static deleteBill = gql`
        mutation deleteBill($id: ID!) {
            deleteBill(id: $id)
        }
    `;
}
