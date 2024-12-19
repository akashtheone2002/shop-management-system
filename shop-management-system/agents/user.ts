import { IUser } from "@/types/apiModels/apiModels";
import { mapEntityToUser } from "../utils/mapper";
import { UserLogin } from "../services/services";

export const login = async (userName:string, password:string): Promise<IUser> => {
   const entity = await UserLogin(userName, password);
   const user = mapEntityToUser(entity);
   return user;
}
