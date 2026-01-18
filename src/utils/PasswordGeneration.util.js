import bcrypt from 'bcrypt'
import { config } from 'dotenv'
config();
export const GeneratePassword =async(password)=>{
    const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
    return passwordHash
}
