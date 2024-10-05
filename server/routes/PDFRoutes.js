import express from "express"
import { singleFileUpload} from "../controllers/PDFRegisterController.js";
import {upload} from "../helpers/file.helper.js"

const PDFRoutes = express.Router();

PDFRoutes.post('/add', upload.single('file'),singleFileUpload);


export default PDFRoutes;