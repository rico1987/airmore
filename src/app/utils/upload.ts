const OSS = require('ali-oss');
import { getAuthentications } from '../cloud/service/cloud-base.service';

export function upload(file: File) {
    getAuthentications()
        .then((token) => {

        });
};
