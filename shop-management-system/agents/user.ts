import { userLogin } from "../services/services";
import { mapEntityToUser } from "../utils/mapper";

export const login = async (userName:string, password:string): Promise<IUser> => {
   const entity = await userLogin(userName, password);
   const user = mapEntityToUser(entity);
   return user;
}
