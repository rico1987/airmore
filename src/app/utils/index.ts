export const PictureFileExtensions = ['.bmp', '.jpg', '.jpeg', '.png', '.gif', '.pic', '.tif'];

export const AudioFileExtensions = ['.wav', '.aif', '.au', '.mp3', '.ram', '.wma', '.mmf', '.amr', '.aac', '.flac'];

export const VideoFileExtensions = ['.avi', '.mov', '.mpg', '.mpeg', '.vob', '.asf', '.3gp', '.mp4', '.wmv', '.rm', '.rmvb', '.flv', '.mkv'];

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