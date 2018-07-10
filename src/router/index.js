import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/canvas-board'
        },
        {
            name: 'CanvasBoard',
            path: '/canvas-board/',
            // query: {
            //     id: id,
            //     token: token
            // },
            component: resolve => require(['@/components/CanvasBoard/CanvasBoard'], resolve)
        },
        {
            name: 'UploadCanvasSuccess',
            path: '/upload-canvas-success',
            component: resolve => require(['@/components/UploadCanvasSuccess/UploadCanvasSuccess'], resolve)
        }
    ]
});
