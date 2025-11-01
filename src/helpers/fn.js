import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

export const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

