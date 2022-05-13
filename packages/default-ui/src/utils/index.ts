export function exhaustive(_: never): never {
    throw new Error("Check wasn't exhaustive");
}

export function sleep(seconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}

export type MediaType = "application/json";

export function downloadFile(content: string, mediaType: MediaType, name: string) {
    const linkElement = document.createElement("a");

    const file = new Blob([content], {
        type: mediaType,
    });

    linkElement.href = URL.createObjectURL(file);
    linkElement.download = name;

    document.body.appendChild(linkElement);

    linkElement.click();

    linkElement.remove();
}
