export enum HttpErrorCode {
    UNAUTHORIZED = 401,
    ERROR = 500,
    NOT_FOUND = 404
}

export class HttpError {
    private _code: number;
    private _message: string;

    constructor(code: HttpErrorCode, message?: string) {
        this._code = code;
        this._message = message;
    }

    get code() {
        return this._code;
    }

    get message() {
        return this._message;
    }
}
