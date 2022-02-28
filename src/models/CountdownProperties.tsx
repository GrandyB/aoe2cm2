export class CountdownProperties {
    public static DEFAULT_VALUE:number = 30;
    private countdownValue: number;
    interval: NodeJS.Timeout | null;

    constructor(initialValue: number) {
        this.countdownValue = initialValue;
        this.interval = null;
    }

    public resetValue() {
        this.countdownValue = CountdownProperties.DEFAULT_VALUE;
    }

    public decrement() {
        this.countdownValue--;
    }

    get value(): number {
        return this.countdownValue;
    }
}
