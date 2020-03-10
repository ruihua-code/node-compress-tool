let fs = require("fs");
let path = require('path');
let tinify = require("tinify");
let tinifyConfig = require('./config/tinify-config')
let images = require("images");
tinify.key = tinifyConfig.key;
console.log('*** 图片压缩开始 ***')
let baseDir = `${process.argv[2]}/`;
let checkDir = fs.existsSync(`${baseDir}min`)
console.log("当前目录:", baseDir);
if (!checkDir) {
    fs.mkdirSync(`${baseDir}min`);
}
let extnames = ['.jpeg', '.png', '.jpg'];
let imgs = fs.readdirSync(baseDir);
let data = imgs.filter(ele => extnames.includes(path.extname(ele).toLowerCase()));
/**
 * tinify模块压缩
 */
function CompressByTinify() {
    return new Promise((resolve, reject) => {
        function compress(arr, idx) {
            let index = idx || 0
            console.time('压缩时间')
            tinify.fromFile(`${baseDir}${arr[idx]}`).toFile(`${baseDir}min/${arr[idx]}`).then(() => {
                console.timeEnd('压缩时间')
                index++
                console.log(`共${arr.length}张,正在压缩第[${index}]张...`);
                if (arr.length === index) {
                    console.log('*** 图片压缩完成 ***')
                    resolve('ok')
                } else {
                    setTimeout(() => {
                        compress(arr, index)
                    }, 1000)

                }
            }).catch(err => {
                console.log('err:', err)
                reject(err)
            })
        }
        compress(data, 0)
    })
}

/**
 * images模块压缩
 */
function CompressingByImages() {
    return new Promise((resolve, reject) => {
        function compress(arr, idx) {
            let index = idx || 0
            console.time('压缩时间')
            images(`${baseDir}${arr[idx]}`).size(1600).saveAsync(`${baseDir}min/${arr[idx]}`, null, {
                quality: 60
            }, () => {
                console.timeEnd('压缩时间')
                index++
                console.log(`共${arr.length}张,正在压缩第[${index}]张...`);
                if (arr.length === index) {
                    console.log('*** 图片压缩完成 ***')
                    resolve('ok')
                } else {
                    compress(arr, index)
                }
            });
        }
        compress(data, 0)
    })
}
// CompressByTinify()
CompressingByImages()


