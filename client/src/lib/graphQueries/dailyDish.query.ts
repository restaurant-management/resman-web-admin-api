import { gql } from 'apollo-boost';

export class DailyDishQuery {
    public static dailyDishes = gql`
        query dailyDishes($day: date!, $storeId: ID!) {
            dailyDishes(day: $day, storeId: $storeId) {
                confirmAt
                confirmBy {
                    username
                    uuid
                }
                day
                dishId
                session
                storeId
                dish {
                    name
                    defaultPrice
                    price
                }
            }
        }
    `;

    public static addDailyDish = gql`
        mutation addDailyDish($day: date!, $dishIds: [ID!]!, $storeId: ID!) {
            addDailyDish(day: $day, dishIds: $dishIds, storeId: $storeId)
        }
    `;

    public static removeDailyDish = gql`
        mutation removeDailyDish($day: date!, $dishId: ID!, $storeId: ID!) {
            removeDailyDish(day: $day, dishId: $dishId, storeId: $storeId)
        }
    `;

    public static removeDailyDishes = gql`
        mutation removeDailyDishes($day: date!, $dishIds: [ID!]!, $storeId: ID!) {
            removeDailyDishes(day: $day, dishIds: $dishIds, storeId: $storeId)
        }
    `;

    public static confirmDailyDishForAdmin = gql`
        mutation confirmDailyDishForAdmin($day: date!, $dishId: ID!, $storeId: ID!) {
            confirmDailyDishForAdmin(day: $day, dishId: $dishId, storeId: $storeId)
        }
    `;
}
