import { ChatUser } from './chatUser';

export class ChatMessage {
    public static fromJson(json: string) {
        try {
            const object = JSON.parse(json);
            const user = ChatUser.fromJson(object['user']);

            return new ChatMessage(object['text'], user, object['id'], object['createAt']);
        } catch (e) {
            console.error(e);
        }
    }

    private static _currentId: number = 0;

    public readonly id: string;
    public readonly text: string;
    public readonly createdAt: Date;
    public readonly user: ChatUser;

    constructor(text: string, user: ChatUser, id?: string, createAt?: Date) {
        if (id) {
            this.id = id;
        } else {
            this.id = ChatMessage._currentId.toString();
            ChatMessage._currentId++;
        }
        this.text = text;
        this.user = user;
        if (createAt) {
            this.createdAt = createAt;
        } else {
            this.createdAt = new Date();
        }
    }

    public toJson() {
        return JSON.stringify(this);
    }
}
