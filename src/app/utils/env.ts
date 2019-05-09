/* eslint-disable no-undef */
export const inBrowser = typeof window !== 'undefined';
export const UA = inBrowser && window.navigator.userAgent.toLowerCase();
export const isIE = UA && /msie|trident/.test(UA);
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0;
export const isEdge = UA && UA.indexOf('edge/') > 0;
export const isMicroMessenger = (UA && UA.indexOf('micromessenger') > 0);
export const isAndroid = (UA && UA.indexOf('android') > 0);
export const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA));
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

export function isNative(Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}

export const hasProto = '__proto__' in {};
