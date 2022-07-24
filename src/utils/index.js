import { Store } from "../store"

export function isLoggedIn() {
    return Store.state.auth.token
}

export function clearFormErrors() {
    Store.commit("SET_FORM_ERRORS", null)
}

export function getErrorMessage( error ) {
    let errorMessage = '';	
    if ( error.response?.data?.errors ) {
        Object.values(error.response.data.errors).forEach(error => {
            errorMessage += error + '<br/>';
        });
    } else if ( error.response?.data?.message ) {
        errorMessage = error.response.data.message;
    } else {
        errorMessage = 'Se produjo un error inesperdado';
    }

    return errorMessage;
}