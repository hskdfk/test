
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const fileName = path.resolve(__dirname, './access_token.js')
console.log(fileName)
const updateAccessToken = async () => {
    let token = await axios({
        url: 'https://api.weixin.qq.com/cgi-bin/token',
        params: {
            grant_type: 'client_credential',
            appid: 'wx5eb6e48586526f13',
            secret: '249a5dda7d1fa486b78e81387ed6e893'
        }
    })

    console.log(token.data)

    if (token.data.access_token) {

        fs.writeFileSync(fileName, JSON.stringify({
            access_token: token.data.access_token,
            insertTime: new Date()
        }))

    } else {
        await updateAccessToken()
    }
}

const getAccessToken = async () => {
    try {
        const res = fs.readFileSync(fileName, 'utf8')
        let r = JSON.parse(res)
        console.log(r)
        if (new Date().getTime() - new Date(r.insertTime).getTime() > 7200 * 1000) {
            await updateAccessToken()
            await getAccessToken()
        }
        return r.access_token
    }
    catch (e) {
        await updateAccessToken()
        await getAccessToken()
    }
}


setInterval(async () => {
    await updateAccessToken()
}, (7200 - 300) * 1000)


//updateAccessToken()
//getAccessToken()

module.exports = getAccessToken
