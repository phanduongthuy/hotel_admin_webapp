import axios from 'axios'
import store from "../store";
import router from "../router";

const baseUrl = process.env.VUE_APP_BASE_URL;

export const apiAxios = axios.create({
    baseURL: `${baseUrl}/api`,
    headers: {
        post: {
            'Content-Type': 'application/json'
        }
    }
})

apiAxios.interceptors.request.use(config => {
    let token = store.state.auth.accessToken
    if (token) {
        config.headers.common['Authorization'] = `Bearer ${token}`
    }
    return config
}, error => {
    return Promise.reject(error)
})

apiAxios.interceptors.response.use(undefined, (error) => {
    if (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry && router.currentRoute.name !== 'Login') {
            store.commit('auth/updateLoginStatus', false)
            store.commit('auth/updateAuthUser', {})
            store.commit('auth/updateAccessToken', '')
            return router.push({name: 'Login'})
        }
    }
    return Promise.reject(error);
})

apiAxios.interceptors.response.use(undefined, error => {
    if (error) {
        if (error.response.status === 403) {
            if (
                error.response.data.error.error_permission &&
                error.response.data.error.error_permission.length > 0
            ) {
                return router.push({ name: 'Home', params: { errorPermission: "true" } });
            }
        }
    }
    return Promise.reject(error);
});

export default {
    login(data) {
        return apiAxios({
            method: 'post',
            url: '/admins/auth/login',
            data: data
        })
    },
    getAuthUser() {
        return apiAxios({
            method: 'get',
            url: 'admins/auth/me'
        })
    },
    getEmployee(data) {
        return apiAxios({
            method: 'get',
            url: 'admins/employees',
            params: data
        })
    },
    getAllRoles() {
        return apiAxios({
            method: 'get',
            url: 'admins/roles/all',
        })
    },
    addEmployee(data) {
        return apiAxios({
            method: 'post',
            url: 'admins/employees',
            data: data
        })
    },
    deleteEmployee(id) {
        return apiAxios({
            method: 'delete',
            url: 'admins/employees/' + id,
        })
    },
    updateEmployee(data, id) {
        return apiAxios({
            method: 'post',
            url: 'admins/employees/' + id,
            data: data
        })
    },
    resetPasswordUser(data, id) {
        return apiAxios({
            method: 'put',
            url: '/admins/employees/' + id,
            data: data
        })
    },
    getSupportRequest(data) {
        return apiAxios({
            method: 'get',
            url: 'admins/support-request',
            params: data
        })
    },
    getAmountSupportRequest() {
        return apiAxios({
            method: 'get',
            url: 'admins/support-request/amount',
        })
    },
    sendResponse(data, id) {
        return apiAxios({
            method: 'post',
            url: 'admins/support-request/' + id,
            data: data
        })
    },
    getOrder(data) {
        return apiAxios({
            method: 'get',
            url: 'admins/orders',
            params: data
        })
    },
    getOrderRequest(data) {
        return apiAxios({
            method: 'get',
            url: 'admins/orders/order-request',
            params: data
        })
    },
    confirmRequestOrder(data, id) {
        return apiAxios({
            method: 'post',
            url: 'admins/orders/confirm/' + id,
            data: data
        })
    },
    cancelRequestOrder(data, id) {
        return apiAxios({
            method: 'post',
            url: 'admins/orders/cancel/' + id,
            data: data
        })
    },

    updateOrder(data) {
        return apiAxios({
            method: 'put',
            url: 'admins/orders',
            data: data
        })
    },

    getUser(data) {
        return apiAxios({
            method: 'get',
            url: 'admins/users',
            params: data
        })
    },
    getCountUser() {
        return apiAxios({
            method: 'get',
            url: 'admins/users/count-user',
        })
    },
    getCountOrder() {
        return apiAxios({
            method: 'get',
            url: 'admins/orders/count-order',
        })
    },
    getSumRevenue() {
        return apiAxios({
            method: 'get',
            url: 'admins/orders/get-revenue',
        })
    },
    statisticOrder() {
        return apiAxios({
            method: 'get',
            url: 'admins/orders/statistic-order',
        })
    },


    getServiceRule() {
        return apiAxios({
            method: 'get',
            url: '/service-rule'
        })
    },
    createServiceRule(data) {
        return apiAxios({
            method: 'post',
            url: 'admins/service-rule',
            data: data
        })
    },

    getBankAccount() {
        return apiAxios({
            method: 'get',
            url: 'admins/bank/get-data',
        })
    },
    addOrUpdateBank(data) {
        return apiAxios({
            method: 'post',
            url: 'admins/bank/update-bank',
            data: data
        })
    },


    getCommunication() {
        return apiAxios({
            method: 'get',
            url: 'admins/communication/get-data',
        })
    },
    addOrUpdateCommunication(data) {
        return apiAxios({
            method: 'post',
            url: 'admins/communication',
            data: data
        })
    },
    getFooterInfo() {
        return apiAxios({
            method: 'get',
            url: 'admins/footers/get-data',
        })
    },
    createOrUpdateFooterInfo(data) {
        return apiAxios({
            method: 'post',
            url: 'admins/footers',
            data: data
        })
    },
    getMembers(data) {
        return apiAxios({
            method: 'get',
            url: 'admins/members',
            params: data
        })
    },
    addMember(data) {
        return apiAxios({
            method: 'post',
            url: 'admins/members',
            data: data
        })
    },
    updateMember(data, id) {
        return apiAxios({
            method: 'post',
            url: 'admins/members/' + id,
            data: data
        })
    },
    deleteMember(id) {
        return apiAxios({
            method: 'delete',
            url: 'admins/members/' + id
        })
    },

    getListEmails(data) {
        return apiAxios({
            method: 'get',
            url: 'admins/emails',
            params: data
        })
    },
    updateEmailTemplate(data, id) {
        return apiAxios({
            method: 'post',
            url: 'admins/emails/' + id,
            data: data
        })
    },
    getEmail(id) {
        return apiAxios({
            method: 'get',
            url: 'admins/emails/' + id,
        })
    },

    getListNotifications(data) {
        return apiAxios({
            method: 'get',
            url: 'admins/notification-popups',
            params: data
        })
    },
    updateNotifyPopup(data, id) {
        return apiAxios({
            method: 'post',
            url: 'admins/notification-popups/' + id,
            data: data
        })
    },
    getCategories(params = null) {
        return apiAxios({
            method: 'get',
            url: 'admins/categories',
            params: params
        })
    },
    addCategory(data) {
        return apiAxios({
            method: 'post',
            url: 'admins/categories',
            data: data
        })
    },
    updateCategory(data, id) {
        return apiAxios({
            method: 'put',
            url: 'admins/categories/' + id,
            data: data
        })
    },
    deleteCategory(id) {
        return apiAxios({
            method: 'delete',
            url: 'admins/categories/' + id
        })
    },
    getAllCategories() {
        return apiAxios({
            method: 'get',
            url: 'admins/categories/all',
        })
    },
    getRooms(params = null) {
        return apiAxios({
            method: 'get',
            url: 'admins/rooms',
            params: params
        })
    },
    getAllRooms() {
        return apiAxios({
            method: 'get',
            url: 'admins/rooms/all',
        })
    },
    addRoom(data) {
        return apiAxios({
            method: 'post',
            url: 'admins/rooms',
            data: data
        })
    },
    updateRoom(data, id) {
        return apiAxios({
            method: 'put',
            url: 'admins/rooms/' + id,
            data: data
        })
    },
    deleteRoom(id) {
        return apiAxios({
            method: 'delete',
            url: 'admins/rooms/' + id
        })
    },
    changeStatusRoom(id, data) {
        return apiAxios({
            method: 'put',
            url: 'admins/rooms/' + id + '/active',
            data: data
        })
    },


}
