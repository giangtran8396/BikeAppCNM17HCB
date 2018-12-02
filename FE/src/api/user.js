import Api from '@/api/apiBase'

export default {
    UserLogin (user) {
        return Api().post('/user/login', user)
    }
}