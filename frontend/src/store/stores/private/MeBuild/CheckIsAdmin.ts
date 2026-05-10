import { AxiosError } from "axios";
import queryApi from "../../../../api/queryApi";

export const checkIsAdmin = async (myId: string): Promise<boolean> => {
  try{
    await queryApi.admin.user.get(myId);
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