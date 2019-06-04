import { isIE } from './env';
import { Observable, Observer } from 'rxjs';

export function downloadLink(link: string, fileName?: string): void {
    let anchor = document.createElement('a');
    anchor.href = link;
    anchor.target = '_blank';
    if (fileName) {
        anchor.download = fileName;
    }
    window.document.body.appendChild(anchor);
    anchor.onclick = function() {
        window.open(link);
    }
    anchor.click();
    window.document.body.removeChild(anchor);
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

export function getIp(): Observable<any> {
    return new Observable((observer: Observer<string>) => {
        try {
            const RTCPeerConnection = (window as any).RTCPeerConnection || (window as any).mozRTCPeerConnection || (window as any).webkitRTCPeerConnection;//compatibility for Firefox and chrome
            if (!RTCPeerConnection) {
                observer.next('');
                observer.complete();
            }
            const pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};      
            pc.createDataChannel(''); // create a bogus data channel
            pc.createOffer(pc.setLocalDescription.bind(pc), noop); // create offer and set local description
            pc.onicecandidate = (ice) => {
                if (ice && ice.candidate && ice.candidate.candidate) {
                    const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
                    observer.next(myIP);
                    observer.complete(); 
                    pc.onicecandidate = noop;
                }
            };
        } catch (e) {
            observer.error(e);
        } 
    })
}