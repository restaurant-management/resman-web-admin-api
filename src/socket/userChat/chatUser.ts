import { User } from '../../entity/user';

export class ChatUser {

    public static fromJson(json: string) {
        try {
            const object = JSON.parse(json);

            return new ChatUser(object['uid'], object['name'], object['avatar']);
        } catch (e) {
            console.error(e);
        }
    }

    public static fromUser(user: User) {
        return new ChatUser(user.uuid, user.fullName || user.username, user.avatar || '');
    }

    public readonly uid: string;
    public readonly name: string;
    public readonly avatar: string;

    constructor(uid: string, name: string, avatar: string) {
        this.uid = uid;
        this.name = name;
        this.avatar = avatar;
    }

    public toJson() {
        return JSON.stringify(this);
    }
}
