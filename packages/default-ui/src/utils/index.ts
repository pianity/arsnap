export function exhaustive(_: never): never {
    throw new Error("Check wasn't exhaustive");
}

export function sleep(seconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}
