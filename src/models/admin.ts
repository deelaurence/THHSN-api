import mongoose, { Schema, model, Document } from 'mongoose';
import bcrypt from "bcryptjs";
import jwt,{Secret} from "jsonwebtoken";

interface IAdmin extends Document {
  generateJWT(JWT_SECRET: string | Secret): unknown;
  comparePassword(password: string | undefined): boolean;
  name: string;
  firstName:string;
  lastName:string;
  email?: {
    type: string;
    unique?: string|undefined;
    trim?: boolean|undefined;
    lowercase?: boolean|undefined;
    match?: [RegExp]|undefined;
  };
  password: string;
  canResetPassword:boolean;  
}

const AdminSchema = new Schema<IAdmin>({
    name: {
      type: String,//for email sending purposes only
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    // _id: mongoose.Types.ObjectId,
    email: {
      type: String,
      lowercase:true,
      trim:true,
      unique: [true, "email already registered"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ],
    },
    password: {
      type: String,
      minlength: 6,
    },
    canResetPassword: {
      type: Boolean,
      default: false,
    }
  },
);


AdminSchema.pre('save', async function (this: IAdmin, next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    if (this.password && !this.password.startsWith('$2a')) {
      console.log('hashing password...');
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
  next();
});

AdminSchema.methods.generateJWT = function (this: IAdmin, signature: string): string {
  return jwt.sign({ id: this._id, name: this.name }, signature, { expiresIn: '24h' });
};

AdminSchema.methods.comparePassword = async function (
  this: IAdmin,
  passwordInput: string
): Promise<boolean> {
  return await bcrypt.compare(passwordInput, this.password);
};



const BaseAdmin = model<IAdmin>('Admin', AdminSchema);

export { BaseAdmin,IAdmin };
