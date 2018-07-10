import axios from 'axios';
import { getToken } from '../assets/js/auth';
export function uploadStampByCanvasBoard(stamp_url) {
    const params = {
        stamp_url: stamp_url,
        type: 2
    };
    return axios({
        method: 'post',
        url: 'api/qbb/web/user/account/stamp/add',
        headers: {
            'source': 'web',
            'auth-token': getToken()
        },
        params
    });
}