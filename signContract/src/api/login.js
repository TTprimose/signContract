import HttpClient from '../utils/HttpClient';
export default {

    // 登陆登出API
    postlogin(data) {
        return HttpClient.post('user/login', data);
    },
    getlogout() {
        return HttpClient.get('user/logout');
    },

    // 查询
    getuserName(data) {
        return HttpClient.get(`user/${data}`);
    },
    // 修改
    postuserupdate(data) {
        return HttpClient.post('user/update', data);
    }
}
