import { isIE } from './env';

export function downloadLink(link: string, fileName?: string): void {
    let anchor = document.createElement('a');
    anchor.href = link;
    if (fileName) {
        anchor.download = fileName;
    }
    anchor.click();
    anchor = null;
}

export function downloadText(text: string, type: string, fileName: string): void {
    const blob = new Blob([text], {type: type});
    const fs = new FileReader;
    if (isIE) {
        const win = window.open('', "_blank", "");
        win.document.open();
        win.document.write(text);
        win.document.execCommand("saveAs", false, fileName);
        win.close()
    } else {
        fs.onload = function (e) {
            let anchor = document.createElement('a');
            anchor.download = fileName;
            anchor.href = fs.result as string;
            document.body.append(anchor);
            anchor.click();
            anchor = null;
        }
        fs.readAsDataURL(blob)
    }
}