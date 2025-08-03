import { User } from "../entities/User.entity";

declare global {
  namespace Express {
    export interface Request {
      user: Partial<User>;
    }
  }
}
