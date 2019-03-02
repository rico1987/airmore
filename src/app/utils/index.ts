export function getFileShortName(fileName: string, maxLength: number): string {
    const index = fileName.lastIndexOf('.');
    const extension = fileName.substring(index);
    const name = fileName.substr(0, index);
    if (name.length > maxLength - extension.length) {
        return name.substr(0, maxLength - extension.length) + '...' + extension;
    } else {
        return fileName;
    }
}
