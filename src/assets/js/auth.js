import Cookies from 'js-cookie';

export function getToken() {
    return Cookies.get('auth-token');
}
// Create a cookie, valid across the entire site: 从现在起有效期为1天
export function setToken(token) {
    return Cookies.set('auth-token', token);
}
// Delete cookie:
export function removeToken() {
    return Cookies.remove('auth-token');
}
export function getCookie() {
    return Cookies.get('set-cookie');
}
