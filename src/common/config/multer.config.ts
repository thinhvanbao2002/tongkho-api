import { MulterModuleAsyncOptions } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

const storage = diskStorage({
	destination: (req: any, file, callback) => {
		callback(null, path.join("uploads", file.mimetype === "video/mp4" ? "video" : "image"));
	},
	filename: (req, file, cb) => {
		const id = uuidv4().replace(/-/g, "");
		cb(null, `${file.fieldname}_${id}${path.extname(file.originalname)}`);
	},
});

const fileFilter = (req: any, file: any, cb: any) => {
	if (file.mimetype === "video/mp4") {
		cb(null, true);
	} else if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		cb(null, true);
	} else {
		cb(new Error("File uploaded is not of type jpg/jpeg or png or video/mp4"), false);
	}
};

export const multerModuleOptions: MulterModuleAsyncOptions = {
	useFactory: async () => ({
		fileFilter,
		storage,
	}),
};
