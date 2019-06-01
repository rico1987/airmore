const pinyin = require('pinyin');

export const PictureFileExtensions = ['.bmp', '.jpg', '.jpeg', '.png', '.gif', '.pic', '.tif'];

export const AudioFileExtensions = ['.wav', '.aif', '.au', '.mp3', '.ram', '.wma', '.mmf', '.amr', '.aac', '.flac'];

export const VideoFileExtensions = ['.avi', '.mov', '.mpg', '.mpeg', '.vob', '.asf', '.3gp', '.mp4', '.wmv', '.rm', '.rmvb', '.flv', '.mkv'];

export const DocFileExtensions = ['.doc', '.docx', '.xls', '.xlsx', '.txt', '.pdf', '.ppt', '.pptx', '.zip'];

export const DocFileTypes = ['doc', 'docx', 'xls', 'xlsx', 'txt', 'pdf', 'ppt', 'pptx', 'zip'];

export function getFileShortName(fileName: string, maxLength: number): string {
    if (!fileName) {
        return '';
    }
    const index = fileName.lastIndexOf('.');
    const extension = fileName.substring(index);
    const name = fileName.substr(0, index);
    if (name.length > maxLength - extension.length) {
        return name.substr(0, maxLength - extension.length) + '...' + extension;
    } else {
        return fileName;
    }
}
/**
 * 根据文件后缀名判断文件类型
 * @param fileName 
 */
export function getFileType(fileName: string): string {
    const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

    if (PictureFileExtensions.some(ele => ele === extension)) {
        return 'images';
    } else if (AudioFileExtensions.some(ele => ele === extension)) {
        return 'audios';
    } else if (VideoFileExtensions.some(ele => ele === extension)) {
        return 'videos';
    } else {
        return 'resources';
    }
}

/**
 * 生成随机字符串
 * @param length 
 */
export function generateRandomString(length: number): string {
    const charArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
				'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
				'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
				'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
				'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let result = '';
    for (var i = 0; i < length; i++) {
        result += charArr[Math.floor(Math.random() * charArr.length)];
    }
    return result;
}

/**
 * 获取字符串第一个字符的字母
 * @param s 
 */
export function getFirstLetters(s: string): string {
    if (/^[A-Za-z]/.test(s)) {
        return s[0];
    } else if (/^[0-9]/.test(s)) {
        return '#';
    } else {
        return pinyin(s, {
            style: pinyin.STYLE_FIRST_LETTER,
        });
    }
}

export function isDocument(fileName: string): boolean {
    const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    return DocFileExtensions.some((ele) => ele === extension);
}

export function getDocTye(fileName: string): string {
    const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    const index = DocFileExtensions.findIndex((ele) => ele === extension);
    return DocFileTypes[index];
}