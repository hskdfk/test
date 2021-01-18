
const Router = require('koa-router')
const router = new Router()
const axios = require('axios')

const Parser = require('../util/dom-parser.js');
const BaseURL = 'https://t-sfa.yili.com/PBMIF/MCSWSIAPI.asmx/CallTest'

const getAccessToken = require('../util/getAccessToken.js')



router.get('/list', async (ctx, next) => {
    let token = await getAccessToken()
    // POST https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=ACCESS_TOKEN&env=ENV&name=FUNCTION_NAME
    const url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${token}&env=${ctx.state.env}&name=boke`
    const query = ctx.request.query
    let r = await axios({
        method: 'post',
        url: url,
        data: {
            $url: 'getBokeList',
            start: parseInt(query.start),
            count: parseInt(query.count),
            content: query.content
        }
    })

    console.log(r.data)
    ctx.body = r.data

})


router.get('/delete', async (ctx, next) => {

    //let res = await axios.get('https://t-sfa.yili.com/PBMIF/MCSWSIAPI.asmx/CallTest?Method=PBMService.GetProductBrandList&Authkey=02a51514-facc-4893-aca8-c147dbbf822a&Params={}')
    // console.log(typeof (res.data), res.data)
    let res = await axios({
        method: 'get',
        url: BaseURL,
        params: {
            Method: 'PBMService.GetProductBrandList',
            Authkey: '02a51514-facc-4893-aca8-c147dbbf822a',
            Params: {}
        }
    })

    //let res = await axios.get(BaseURL, {
    //    params: {
    //        Method: 'PBMService.GetProductBrandList',
    //        Authkey: '02a51514-facc-4893-aca8-c147dbbf822a',
    //        Params: {}
    //    }
    //})

    console.log(typeof (res.data), res.data)
    ctx.body = xmlP(res.data)



})






module.exports = router


function xmlP(res) {
    //var Parser = require('../util/dom-parser.js');
    var xmlParser = new Parser.DOMParser();

    var doc = xmlParser.parseFromString(res);
    var s = doc.getElementsByTagName("string")[0];
    //console.log('firstchild', s.firstChild.nodeValue);
    return JSON.parse(s.firstChild.nodeValue);

}
