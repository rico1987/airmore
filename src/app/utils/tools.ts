export function downloadLink(link: string, fileName?: string): void {
    let anchor = document.createElement('a');
    anchor.href = link;
    if (fileName) {
        anchor.download = fileName;
    }
    anchor.click();
    anchor = null;
}
