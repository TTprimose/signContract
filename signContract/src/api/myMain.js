import HttpClient from '../utils/HttpClient';
export default {
    /**
     * 统计接口、当日签约列表
     */
    homeIndex() {
        return HttpClient.get('home/index');
    },
    homeList(data) {
        return HttpClient.get('home/listPage', data);
    }
    
}
