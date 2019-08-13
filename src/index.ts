let RegularJs: any;

export type WatchId = number;

export type Computed<Data> = {
    [P in keyof Data]: Function | { get?: Function, set?: Function };
}

export abstract class RegularT<Props = {}, State = {}, Data = Props & State> {
    name: string;
    template: string;
    data: Data;

    $refs: any;
    computed: Computed<Partial<Data>>;

    static setRegular(regular: any) {
        RegularJs = regular;
    }

    static extend(regularT: { new(): RegularT }) {
        const regularTInstance = new regularT();
        const regularObject = Object.create({});

        let prototype: any = regularTInstance;

        while (prototype) {
            if (prototype.constructor === RegularT) {
                break;
            }

            Object.keys(prototype).forEach(key => {
                regularObject[key] = prototype[key];
            });

            prototype = prototype.__proto__;
        }

        delete regularObject.constructor;

        return RegularJs.extend(regularObject);
    }

    config(data?: Data): void {

    }

    init(data?: Data): void {

    }

    destroy(): void {

    }

    supr(): void {

    }

    $watch<T extends keyof Data>(key: T | Partial<Data>, watchHandle: (newValue: Data[T], oldValue?: Data[T]) => void): WatchId {
        return 0;
    }

    $unwatch(watchId: WatchId): void {

    }

    $on(name: string, handle?: Function): void {

    }

    $off(name: string, handle?: Function): void {

    }

    $emit(name: string, params?: any): void {

    }

    $ref(name: string) {
        return this.$refs[name];
    }

    $inject(target: any): void {

    }

    $update(target?: keyof Data | Partial<Data>, value?: any) {

    }

    [key: string]: any;
}
