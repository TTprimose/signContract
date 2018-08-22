import HttpClient from '../utils/HttpClient';
export default {
    // 列表
    getcontractlistPage(data) {
        return HttpClient.get('contract/listPage', data);
    },
    // 详情
    getcontractcontractNo(data, date) {
        return HttpClient.get(`contract/contractNo/${data}/${date}`);
    },
    // 新增
    postcontractinsert(data) {
        return HttpClient.postJSON('contract/insert', data);
    },
    // 更新
    getcontractreplace(data) {
        return HttpClient.get(`contract/replace/${data}`);
    },
    // 合同模板列表
    gettemplatelistPage(data) {
        return HttpClient.get('template/listPage', data);
    },

    // 甲乙客户列表
    getcustomerlistPage(data) {
        return HttpClient.get('customer/listPage', data);
    }


}
