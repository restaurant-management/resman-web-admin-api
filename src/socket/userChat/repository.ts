import { ChatMessage } from './chatMessage';
import { ChatUser } from './chatUser';

class Repository {
    private readonly _users: ChatUser[] = [];
    private readonly _messages: ChatMessage[] = [];

    public addUser(user: ChatUser) {
        this._users.push(user);
    }

    public removeUser(user: ChatUser) {
        this._users.splice(this._users.findIndex(u => u === user), 1);
    }

    public addMessage(message: ChatMessage) {
        this._messages.push(message);
    }

    public getUsers() {
        return this._users;
    }

    public getMessages(number: number) {
        return this._messages.slice(this._messages.length - number - 1, this._messages.length - 1);
    }
}

const userChatRepository = new Repository();

export { userChatRepository as UserChatRepository };
