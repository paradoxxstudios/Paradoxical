export interface ValidatorLike {
    readonly errorMessage: string;
    readonly check: (value: unknown) => boolean;
}
export interface Validator<T> extends ValidatorLike {
    readonly check: (value: unknown) => value is T;
}
