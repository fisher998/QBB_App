<template>
    <div class="box" :style="{ 'width': clientWidth + 'px', 'height': clientHeight + 'px' }">
        <div id="top" :class="{'crosswise2': clientWidth > clientHeight, 'lengthways2': clientWidth < clientHeight}">
            <canvas id="canvas" 
                :width="clientWidth > clientHeight ? clientWidth : clientWidth * 0.8" 
                :height="clientWidth > clientHeight ? clientHeight * 0.8 : clientHeight"
                @touchstart.stop="start"
                @touchmove.stop.prevent="move"
                @touchend.stop="end">
            </canvas>
        </div>
        <div id="bottom" :class="{'crosswise1': clientWidth > clientHeight, 'lengthways1': clientWidth < clientHeight}">
            <a :class="{'acrosswise': clientWidth > clientHeight, 'alengthways': clientWidth < clientHeight}" @click="clearCanvas"><span :class="{'splength': clientWidth < clientHeight}">重写</span></a>
            <a :class="{'acrosswise': clientWidth > clientHeight, 'alengthways': clientWidth < clientHeight, 'confirm': true}" @click="uploadAliyunOSS"><span :class="{'splength': clientWidth < clientHeight, 'confirm': true}">确定</span></a>
        </div>
    </div>
</template>

<script>
import { getAliyunOSS } from '../../api/upload';
import { uploadStampByCanvasBoard } from '../../api/MainPage';
import { getFileExtension } from '../../assets/js/feature';
import { setToken } from '../../assets/js/auth';
export default {
    data () {
        return {
            clientWidth: '',
            clientHeight: '',
            canvas: '',
            ctx: '',
            uploadImgs: [],
            aliyunData: {
                'AccessKeyId': '',
                'AccessKeySecret': '',
                'Expiration': '',
                'SecurityToken': '',
                'Bucket': '',
                'Host': ''
            },
            token: null,
        }
    },
    created () {
        this.token = this.$route.query.token;
        console.log(this.token)
        setToken(this.token);
    },
    methods: {
        start (event) {
            this.canvas = this.$el.querySelector('#canvas');
            this.ctx = canvas.getContext('2d');
            this.ctx.lineWidth = 4.0;
            this.ctx.strokeStyle = 'black';
            this.ctx.lineCap = 'round';
            if (event.targetTouches.length === 1) {
                 var touch = event.targetTouches[0];
                this.ctx.beginPath();
                this.ctx.moveTo(touch.clientX-canvas.offsetLeft,touch.clientY-canvas.offsetTop);
            }
        },
        move (event) {
            var touche = event.targetTouches[0];
            this.ctx.lineTo(touche.clientX - canvas.offsetLeft, touche.clientY - canvas.offsetTop);
            this.ctx.stroke();
        },
        end (event) {
            this.ctx.closePath();
        },
        // 清空画布
        clearCanvas () {
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);  
        },
        // 保存画布图片
        uploadAliyunOSS () {
            this.dealwithimage().then(res => {
                var img = res;
                let _this = this;
                this._getAliyunOSS().then(res => {
                    new Promise(resolve => {
                        let file = this.dataURLtoFile(img, 'images');
                        let suffix = 'png';
                        let name = new Date() - 0;
                        let storeAs = name + '.' + suffix;
                        let client = new OSS.Wrapper({
                            accessKeyId: this.aliyunData.AccessKeyId,
                            accessKeySecret: this.aliyunData.AccessKeySecret,
                            region: 'oss-cn-beijing',
                            stsToken: this.aliyunData.SecurityToken,
                            bucket: this.aliyunData.Bucket
                        });
                        client.multipartUpload(storeAs, file).then(function (res) {
                            console.log(res.url.split('/').pop())
                            resolve(res.url.split('/').pop());
                        });
                    }).then(res => {
                        console.log(res)
                        uploadStampByCanvasBoard(res).then(res => {
                            console.log('=================')
                            console.log(res)
                            if (res.data.error === 0) {
                                this.$router.push({
                                    path: '/upload-canvas-success'
                                });
                            }
                        });
                    })
                })
            });
        },
        // 画布转图片
        convertCanvasToImage () {
            let image = this.canvas.toDataURL("image/png");
            return image;
        },
        // 处理图片
        dealwithimage () {
            return new Promise(resolve => {
                let img = this.convertCanvasToImage();
                if (this.clientWidth > this.clientHeight) {
                    resolve(img);
                } else {
                    let cv = document.createElement('canvas')
                    var images = new Image();
                    images.src = img;
                    let newImage;
                    images.onload = () => {
                        cv.height = this.clientWidth * 0.85;
                        cv.width = this.clientHeight;
                        var ctx = cv.getContext("2d");
                        // 平移 (x, y)
                        ctx.translate(0, cv.height); 
                        // 旋转 顺时针方向为正
                        ctx.rotate(-Math.PI / 2);
                        ctx.drawImage(images, 0, 0);
                        newImage = cv.toDataURL("image/png");
                        resolve(newImage)
                    }
                }
            })
        },
        dataURLtoFile(dataurl, filename) {//将base64转换为文件
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type:mime});
        },
        _getAliyunOSS () {
            return new Promise(resolve => {
                getAliyunOSS().then(res => {
                    this.aliyunData = Object.assign({}, this.aliyunData, res.data.data);
                    resolve();
                })
            });
        },
    },
    mounted () {
        // 动态设置背景图的高度为浏览器可视区域高度

        // 首先在Virtual DOM渲染数据时，设置下背景图的高度．
        this.clientHeight = `${document.documentElement.clientHeight}`;
        this.clientWidth = `${document.documentElement.clientWidth}`;
        // 然后监听window的resize事件．在浏览器窗口变化时再设置下背景图高度．
        const _this = this;
        window.onresize = function () {
            _this.clientHeight = `${document.documentElement.clientHeight}`;
            _this.clientWidth = `${document.documentElement.clientWidth}`;
            // if (document.documentElement.clientWidth > document.documentElement.clientHeight) {
            //     _this.clientHeight = `${document.documentElement.clientHeight}`;
            //     _this.clientWidth = `${document.documentElement.clientWidth}`;
            // } else {
            //     _this.clientWidth = `${document.documentElement.clientHeight}`;
            //     _this.clientHeight = `${document.documentElement.clientWidth}`;
            // }
        };
    },
}
</script>

<style scoped>
.box {
    /* width: 100%;
    height: 100%; */
    /* position: absolute;
    top: 0;
    left: 0; */
    /* touch-action: none; */
}
canvas{ 
    width: 100%;
    height: 100%;
    /* transform-origin: center center; */
    /* transform: rotate(90deg); */
    /* touch-action: none; */
}
/* 纵向 */
.lengthways1 {
    width: 15%;
    height: 100%;
    float: left;
    border-right: 1px dashed #d5d5d5;
    padding: 10px 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
}
.lengthways2 {
    width: 85%;
    height: 100%;
    float: right;
}
/* 横向 */
.crosswise1 {
    width: 100%;
    height: 15%;
    border-top: 1px dashed #d5d5d5;
    display: flex;
    align-items: center;
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
}
.crosswise2 {
    width: 100%;
    height: 85%;
}
.acrosswise {
    display: inline-block;
    font-size: 16px;
    color: #333333;
    padding: 7px 15px;
    border: 1px solid #000;
    border-radius: 5px;
}
.alengthways {
    display: inline-block;
    font-size: 16px;
    color: #333333;
    padding: 20px 0px;
    border: 1px solid #000;
    border-radius: 5px;

}
.splength {
    display: inline-block;
    transform: rotate(90deg);
}
.confirm {
    background: #10c786;
    border: none;
    color: #fff;
}
</style>
