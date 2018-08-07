const http = require('https')

const params = process.argv

console.log(params)

http.get('http://www.baidu.com', res => {
  console.log(res)
})