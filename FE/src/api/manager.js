import Api from '@/api/apiBase'

export default {
    requestInfoCustomer (model) {
        return Api().post('/manager/receiverRequest', model)
    },
    getRequest(status){
        return Api().get(`/manager/receiverRequest/${status}`);
    }
}