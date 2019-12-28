export class Role {

    public static fromJson(jsonObject: any) {
        let role = new Role();
        role = { ...jsonObject };

        return role;
    }

    public readonly slug: string;
    public readonly name: string;
    public readonly description?: string;
    public readonly level: number;
    public readonly permissions: string[];

    private constructor() {
        this.slug = '';
        this.name = '';
        this.description = '';
        this.level = 0;
        this.permissions = [];
    }
}
