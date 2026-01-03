export class InvalidPasswordException  extends Error {
    code: 404;
    constructor(message?: string) {
        super(message || "Invalid Password");
    }
}