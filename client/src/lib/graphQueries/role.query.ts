import { gql } from 'apollo-boost';

export class RoleQuery {

    public static roles = gql`
        query roles {
            roles {
                id
                slug
                name
                description
                level
                permissions
            }
        }
    `;

    public static getRole = gql`
        query getRole($slug: String!) {
            getRole(slug: $slug) {
                id
                slug
                name
                description
                level
                permissions
            }
        }
    `;

    public static createRole = gql`
        mutation createRole($description: String, $level: Int, $name: String!, $permissions: [String!], $slug: String) {
            createRole(name: $name, description: $description, level: $level, permissions: $permissions, slug: $slug) {
                id
            }
        }
    `;

    public static editRole = gql`
        mutation editRole($description: String, $level: Int, $name: String, $permissions: [String!], $slug: String!) {
            editRole(slug: $slug, description: $description, level: $level, name: $name, permissions: $permissions) {
                id
            }
        }
    `;

    public static deleteRole = gql`
        mutation deleteRole($slug: String!) {
            deleteRole(slug: $slug)
        }
    `;

    public static deleteRoles = gql`
        mutation deleteRoles($slugs: [String!]!) {
            deleteRoles(slugs: $slugs)
        }
    `;
}
