export class RandomCode {
    public static generate(length: number = 10) {
        return Math.random().toString(36).substr(2, length);
    }
}
