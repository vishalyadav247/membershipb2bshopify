const BASE_URL = process.env.REACT_APP_BASE_URL ;

 export const loginApi = BASE_URL + '/api/login_admin';
 export const userCheck = BASE_URL + '/api/check-user';
 export const passwordChange = BASE_URL + '/api/update_password';
 
export const options = {
    headers:{
        Authorization:`Bearer ${localStorage.getItem('token')}`
    }
};