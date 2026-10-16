import multer from "multer"
import { uploadDir } from "../constants/index.js"
import configMulter from "../config/multer.js"

const { storage, fileFilter } = configMulter(uploadDir);

const upload = multer({
    storage,
    fileFilter,
});


export default upload;