export function setUsername (state, payload) {
    state.username = payload;
}

export function setToken (state, payload) {
    state.token = payload;
}

export function login (state, payload) {
    state.username = payload.username;
    state.token    = payload.token;
}

export function logout (state) {
    state.username = null;
    state.token    = null;
}