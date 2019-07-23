# easybrew
OSX到10.14后，LaunchRocket不能用了。虽然启停服务也就是一个命令的事，不过还是喜欢那个小工具，所以自己写一个。本人只会java和js，所以用phonegap做的。因为涉及到一些脚本操作，打开sandbox后不能运行，所以没法发到AppStore。
可以[到这里下载](https://github.com/hagedr/easybrew/releases)已编译好的版本。
所有的服务可以定义一个配置文件来指定和规范参数。配置文件的保存目录为~/Library/Application Support/cn.yanjiashuo.easybrew/files，下面homebrew.mxcl.*.json就是对应的配置文件。下面是一个示例文件：
```
{
    "version": 1,
    "override": true,
    "config": [
        {
            "value": "6379",
            "desp": "监听端口，默认为 6379",
            "reg": "--port\\s+\\d+\\b",
            "prefix": "--port ",
            "type": "number"
        },
        {
            "value": "127.0.0.1",
            "desp": "指定 Redis 只接收来自于该 IP 地址的请求，如果不进行设置，那么将处理所有请求",
            "reg": "--bind\\s+\\w+",
            "prefix": "--bind ",
            "warning": true,
            "type": "text"
        },
        {
            "value": "-Ptest",
            "desp": "测试的参数",
            "type": "label"
        },
        {
            "value": "no",
            "desp": "默认情况下，redis不是在后台运行的，如果需要在后台运行，把该项的值更改为 yes。",
            "reg": "--daemonize\\s+(yes|no)\\b",
            "type": "select",
            "prefix": "--daemonize ",
            "options": [
                {
                    "label": "yes",
                    "value": "yes"
                },
                {
                    "label": "no",
                    "value": "no"
                }
            ]
        }
    ]
}
```
- ***override***:你可以将配置文件手动放入上面所说的目录（~/Library/Application Support/cn.yanjiashuo.easybrew/files）。如果开启了在线获取配置，那么就会用在线获取的配置文件覆盖本地的配置。如果不想这么做，override设置为false。
- ***config***:
   - **type**:参数的展示方式，默认为text，是一个文本框，可以手动输入。number，限制输入为数字。label，不需要用户输入。select，显示为下拉框，配合options属性。
   - **value**:默认的值。
   - **desp**:参数描述。
   - **reg**:参数校验的正则表达式。为空不校验。
   - **warning**:有些参数比较危险，加这个属性可以用黄色的边框提醒下。
   - **prefix，suffix**:参数的前缀和后缀，会和用户的输入值拼接${prefix}${value}${suffix}，注意如果需要空格的话要带上。

