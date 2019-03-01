export function downloadLink(link: string): void {
    let anchor = document.createElement('a');
    anchor.download = link;
    anchor.click();
    anchor = null;
}
