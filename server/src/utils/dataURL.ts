import DatauriParser from "datauri/parser";
import path from "path";
const getDataURL = (file: Express.Multer.File | undefined) => {
  if (file) {
    const parser = new DatauriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
  }
};

export default getDataURL;
