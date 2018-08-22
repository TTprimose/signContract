import HttpClient from '../utils/HttpClient';
export default {
    // 列表
    getoperatelistPage(data) {
        return HttpClient.get('operate/listPage', data);
    }

}
