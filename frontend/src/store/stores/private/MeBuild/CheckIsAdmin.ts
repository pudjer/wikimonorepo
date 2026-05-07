import { AxiosError } from "axios";
import api from "../../../../api";

export const checkIsAdmin = async (myId: string): Promise<boolean> => {
  try{
    await api.admin.user.get(myId);
    return true;  
  }catch(e) {
    if (e instanceof AxiosError && e.status === 403) {
      return false;
    }else{
      console.error(e);
      return false;
    }
  }
}