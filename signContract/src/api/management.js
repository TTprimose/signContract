import HttpClient from '../utils/HttpClient';
export default {
    /**
     * 新增客户API ，新增列表，新增详情
     */
    customerInsert(data) {
        return HttpClient.post('customer/insert', data);
    },
    customerListPage(data) {
        return HttpClient.get('customer/listPage', data);
    },
    customerDetail(cardNo) {
        return HttpClient.get(`/customer/cardNo/${cardNo}`);
    }
    
}
