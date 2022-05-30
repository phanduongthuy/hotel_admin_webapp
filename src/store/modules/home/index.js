export default {
    namespaced: true,
    state: {
        unread: "",
        activeMenu: "1",
        requestOrder: 0,
        supportRequest: 0
    },
    getters: {
        //
    },
    mutations: {
        updateUnread(state, unread) {
            state.unread = unread
        },
        updateActiveMenu(state, activeMenu) {
            state.activeMenu = activeMenu
        },
        updateRequestOrder(state, requestOrder) {
            state.requestOrder = requestOrder
        },
        updateSupportRequest(state, supportRequest) {
            state.supportRequest = supportRequest
        }
    },
}