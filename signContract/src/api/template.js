import HttpClient from '../utils/HttpClient';
export default {
    /**
     * 新增模板API，模板列表，模板详情
     */
    templateInsert(data) {
        return HttpClient.post('template/insert', data);
    },
    templateListPage(data) {
        return HttpClient.get('template/listPage', data);
    },
    templateDetail(templateCode) {
        return HttpClient.get(`template/templateCode/${templateCode}`);
    },
    deleteTem(templateCode) {
        return HttpClient.get(`template/delete/${templateCode}`);
    }
    
}
