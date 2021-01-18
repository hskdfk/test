//'use strict';
//var http = require('http');
//var port = process.env.PORT || 1337;
//var j = [1, 2, 3]

//http.createServer(function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/plain' });
//    res.end(JSON.stringify(j));
//}).listen(port);


const Koa = require('koa')
const axios = require('axios')
const cors = require('koa2-cors')
const Router = require('koa-router')
const router = new Router()
const ENV = 'test-o9vva'

const app = new Koa()

app.use(cors({
    //origin: ['http://localhost:8081', 'http://dxq.asia'],
    origin: function (ctx) { //设置允许来自指定域名请求
        console.log(ctx)
        console.log(ctx.header)
        const whiteList = ['http://dxq.asia', 'http://localhost:8081']; //可跨域白名单
        if (ctx.header.referer) {
            let url = ctx.header.referer.substr(0, ctx.header.referer.length - 1);
            if (whiteList.includes(url)) {
                return url //注意，这里域名末尾不能带/，否则不成功，所以在之前我把/通过substr干掉了
            }
        }
        else
            return 'http://localhost:3000' //默认允许本地请求3000端口可跨域
    },
    credentials: true
}))


app.use(async (ctx, next) => {

    ctx.state.env = ENV
    await next()

})

const playlist = require('./controller/playlist.js')
router.use('/playlist', playlist.routes())

app.use(router.routes())
app.use(router.allowedMethods())



app.listen(3000, () => {
    console.log('服务已开启')
})


function xmlP(res) {
    var Parser = require('../PBMIF/util/dom-parser.js');
    var xmlParser = new Parser.DOMParser();

    var doc = xmlParser.parseFromString(res);
    var s = doc.getElementsByTagName("string")[0];
    //console.log('firstchild', s.firstChild.nodeValue);
    return JSON.parse(s.firstChild.nodeValue);

}
