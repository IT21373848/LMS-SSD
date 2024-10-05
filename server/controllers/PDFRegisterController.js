import PDFRegisterModel from "../models/PDFRegisterModel.js";
import fs from "fs";
import {fileSizeFormatter} from "../helpers/FileSizeFormatter.helper.js"
import {encryptFile} from "../helpers/Encrypt.helper.js"

export const singleFileUpload = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      throw Error("No file uploaded. File Not Found.");
    }

    // Check if the uploaded file is a PDF
    if (req.file.mimetype !== "application/pdf") {
      throw Error("Only PDF files are allowed.");
    }

    const { subId, title, desc } = req.body;

    // Check if subId is provided
    if (!subId) {
      throw Error("Subject Id is required.");
    }

    // Create the path for the encrypted file
    const encryptedPath = `${req.file.path}.enc`;

    // Encrypt the uploaded file
    await encryptFile(req.file.path, encryptedPath);

    // Create a new file record in the database
    let file = new PDFRegisterModel({
      subId: subId,
      title: title,
      desc: desc,
      actType: "learning",
      FileName: req.file.originalname,
      FilePath: encryptedPath,
      FileSize: fileSizeFormatter(req.file.size, 2),
    });

    // Save the file record in the database
    await file.save();

    // Remove the original unencrypted file from the server
    fs.unlinkSync(req.file.path);

    // Send a success response
    res.status(200).json("File uploaded and encrypted successfully.");

  } catch (error) {
    // Handle errors and send an error response
    res.status(500).json({ message: error.message });
  }
};


