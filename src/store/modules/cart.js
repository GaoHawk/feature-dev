const state = {
    currentData: []
}

const getters = {
    getRootData(state, getters, rootState) {
        return rootState.axiosData;
    }
}

export default {
    namespaced: true,
    state,
    getters
}