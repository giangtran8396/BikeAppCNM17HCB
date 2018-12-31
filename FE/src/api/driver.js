import Api from '@/api/apiBase'

export default {
    updatelocationdrive (model) {
        return Api().put('/driver/updatelocationdriver', model)
    },
    updatestatusrequest(model){
        return Api().put(`/driver/updatestatusrequest`,model);
    },
    updatestatusdriver(model){
        return Api().put(`/driver/updatestatusdriver`,model);
    },
    receiverDriverRequest(model){
        return Api().post('/driver/receiverDriverRequest', model); 
    },
    getStatusDriver(model){
        return Api().post('/driver/getStatusDriver', model); 
    },
}