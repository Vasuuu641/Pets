//Created this class to use the Logs from types.ts
export class Log {
    constructor(
        public action: string,
        public userId: number,
        public petId: number,
        public timestamp: string,
        public userName?: string,
        public petName?: string
    ) {}


// getMessage function enables the action performed by the user to be displayed to admin in a readable format
    getMessage(): string {
        if (!this.userName || !this.petName) {
            return 'Unknown action';
        }

        switch (this.action) {
            case 'feed':
                return `${this.userName} fed ${this.petName}.`;
            case 'play':
                return `${this.userName} played with ${this.petName}.`;
            case 'return':
                return `${this.userName} returned ${this.petName}.`;
            default:
                return `${this.userName} did something to ${this.petName}.`;
        }
    }
}
