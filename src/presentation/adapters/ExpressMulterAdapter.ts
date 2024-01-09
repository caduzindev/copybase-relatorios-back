import multer from 'multer'
import { resolve } from 'path'

const rootDirectory = resolve(__dirname,'..','..','..')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${rootDirectory}/static`)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        var extension = file.originalname.substr(file.originalname.lastIndexOf("."));
        cb(null, file.fieldname + '-' + uniqueSuffix + extension)
    }
})

export class ExpressMulterAdapter {
    static adapt(field: string) {
        const upload = multer({ storage });
        return upload.single(field);
    }
}