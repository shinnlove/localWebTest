/**
 * Created by chensheng.zcs on 2017/4/11.
 */
var urlHandle = {
    parseStr: function (str, key) {
        var params = str.split('&'); // 字符串以&分割name=shinnlove,pwd=abcd
        var query = {}; // 解析后的URL传参键值对
        var q = []; // 临时解析用的字符串数组，q[0]是name;q[1]是value
        var name = ''; // 临时存放urldecode后的key键名

        for (var i = 0; i < params.length; i++) {
            q = params[i].split('='); // name=shinnlove再通过等号分割
            name = decodeURIComponent(q[0]); // decodeURIComponent，如果urlencode函数编码过，则可以转成正常的编码
            if (!name) {
                continue; // 空字符串处理下一个
            }
            if (name.substr(-2) == '[]') {
                // substr()形参如果是负数，-1代表最后一个字符到末尾即最后一个字符；-2代表倒数第二个字符到末尾即最后两个字符
                // 如果形参是个空数组
                if (!query[name]) {
                    query[name] = [];
                }
                query[name].push(q[1]);
            } else {
                query[name] = q[1]; // 存入解析对象中
            }
        }

        // 如果形参传入key则寻找key
        if (key) {
            if (query[key]) {
                return query[key]; // 如果对象中该key索引存在则返回
            } else {
                return null; // 没找到key直接返回null
            }
        } else {
            return query; // 单纯解析URL则直接返回
        }
    },
    /**
     * 查询url参数函数。
     *
     * 特别注意：传入形参代表搜索要找的字段值xxx，如果没有对应字段返回null，可以直接if(xxx)来判断；
     * 如果没有传入任何要找的字段，则代表解析整个url的传参对象，返回object。
     *
     * @param key 可能要找寻的url的key值
     *
     * 解析字段值：
     * var eventId = urlHandle.getQuery("eventId");
     * if (eventId) {
     *      console.log(eventId);
     * } else {
     *      console.log("没找到字段对应的值");
     * }
     *
     * 解析url对象
     * var urlParams = urlHandle.getQuery();
     * if (urlParams) {
     *      console.log("url参数" + JSON.stringify(urlParams));
     * } else {
     *      console.log("没有url参数");
     * }
     *
     */
    getQuery: function (key) {
        var search = window.location.search; // window.location.search返回连同?后边的参数
        if (search.indexOf('?') != -1) {
            // 如果search字符串中带上了url传参
            var str = search.substr(1); // 截取?后边到末尾的字符串
            return this.parseStr(str, key); // 进行解析
        }
        // 没有匹配到返回空字符串
        return null;
    },
};

