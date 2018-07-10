// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import './assets/css/index.css';
import axios from 'axios';

Vue.prototype.axios = axios;
Vue.config.productionTip = false;

// var clientWidth;
// var clientHeight;
// clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
// clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
// document.body.style.width = clientWidth + 'px';
// document.body.style.height = clientHeight + 'px';
// var cv = document.querySelector('#canvas');
// if (clientWidth > clientHeight) {
//     document.querySelector('#top').className = 'crosswise2';
//     document.querySelector('#bottom').className = 'crosswise1';
//     cv.width = clientWidth;
//     cv.height = clientHeight * 0.8;
// } else {
//     document.querySelector('#top').className = 'lengthways2';
//     document.querySelector('#bottom').className = 'lengthways1';
//     cv.height = clientHeight;
//     cv.width = clientWidth * 0.8;
// }
/* window.onresize = function () {
    clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
    clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    document.body.style.height = clientHeight + 'px';
    document.body.style.width = clientWidth + 'px';
    // if (clientWidth > clientHeight) {
    //     document.querySelector('#top').className = 'crosswise2';
    //     document.querySelector('#bottom').className = 'crosswise1';
    //     cv.width = clientWidth;
    //     cv.height = clientHeight * 0.8;
    // } else {
    //     document.querySelector('#top').className = 'lengthways2';
    //     document.querySelector('#bottom').className = 'lengthways1';
    //     cv.width = clientWidth * 0.8;
    //     cv.height = clientHeight;
    // }
} */

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
});
