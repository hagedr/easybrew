import listPage from './pages/listPage.html';
// import service from './service';

export default angular.module('easy-brew', ['ui.router'])
    .run(['$state', function ($state) {
        window.$state = $state;
    }])
    .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
        //app.config配置项
        //$stateProvider 状态供应商，（名字可以看出关于路由的一系列配置需要由$stateProvider完成）
        //$urlRouterProvider 路由重定向
        $stateProvider.state("listPage", {
            url: "/listPage",
            template: listPage,
            controller: 'listPageCtrl'
        });
    }])
    .service('shell', [function () {
        return {
            //处理表格式的返回结果，例如
            /*
            Name          Status  User Plist
            elasticsearch stopped      
            logstash      stopped      
            mysql         started ming /Users/ming/Library/LaunchAgents/homebrew.mxcl.mysql.plist
            redis         started ming /usr/local/opt/redis/homebrew.mxcl.redis.plist
            tomcat        stopped
            */
            //    以第一行作为title返回json对象
            shellTableResult: function (result) {
                if (result) {
                    result = result.split('\n');

                    let indexs = [];
                    let firstLetter = true;
                    let title = result[0];
                    let values = [];

                    if (title.indexOf('\t') > -1) {
                        for (let i = 1; i < result.length; i++) {
                            let v = {};
                            let s = result[i].split('\t');
                            let t = title.split('\t');
                            for (let j = 0; j < s.length; j++) {
                                v[t[j].trim()] = s[j].trim();
                            }
                            values.push(v);
                        }
                    } else {
                        for (let i = 0; i < title.length; i++) {
                            let c = title.charAt(i);
                            if (c != ' ' && firstLetter == true) {
                                indexs.push(i);
                                firstLetter = false;
                            } else if (c == ' ') {
                                firstLetter = true;
                            }
                        }

                        for (let i = 1; i < result.length; i++) {
                            let v = {};
                            let s = result[i];
                            let t = result[0];
                            for (let j = 0; j < indexs.length; j++) {
                                if (j == indexs.length - 1) {
                                    v[t.substring(indexs[j]).trim()] = s.substring(indexs[j]).trim();
                                    // v.push(s.substring(indexs[j]).trim());
                                } else {
                                    v[t.substring(indexs[j], indexs[j + 1] - 1).trim()] = s.substring(indexs[j], indexs[j + 1] - 1).trim();
                                    // v.push(s.substring(indexs[j], indexs[j + 1] - 1).trim());
                                }
                            }
                            values.push(v);
                        }
                    }
                    return values;
                }
                return [];
            }
        };
    }])
    .controller('listPageCtrl', ['$scope', '$timeout', '$http', 'shell', function ($scope, $timeout, $http, shell) {

        let brew = '/usr/local/bin/brew';
        let find = '/usr/bin/find';
        let rm = '/bin/rm';
        let cp = '/bin/cp';
        let launchctl = '/bin/launchctl';
        let userHome = `/Users/${window.user}`;
        let supportPath = `/Users/${window.user}/Library/Application Support/cn.yanjiashuo.easybrew/files`;

        $scope.globalConfig = {};
        $scope.selectedModule = {};
        $scope.showParamPanel = false;
        $scope.servicesList = [];
        $scope.config = {};

        $scope.init = function () {
            let defaultConfig = {
                onlineConfig: false,
                serverUrl: 'http://' + 'easybr' + 'ew.' + 'yanjia' + 'shuo.c' + 'n/co' + 'nf'
            };
            debugger;
            OSXShellExec.readTextFile(`${supportPath}/config.json`)
                .then((conf) => {
                    if (!conf) {
                        OSXShellExec.saveTextFile(`${supportPath}/config.json`, angular.toJson(defaultConfig));
                    }
                    conf = angular.fromJson(conf);

                    $scope.globalConfig = angular.extend({}, defaultConfig, conf);

                    Promise.all([
                        OSXShellExec.execShell(`${brew} services list`),
                        OSXShellExec.execShell(`${find} ${userHome}/Library/LaunchAgents -iname homebrew.mxcl.*.plist`),
                        OSXShellExec.execShell(`${launchctl} list`)
                    ])
                        .then((datas) => {
                            let data = datas[0];
                            let plist = datas[1];
                            let services = datas[2];
                            data = shell.shellTableResult(data);
                            services = shell.shellTableResult(services);

                            debugger;

                            data.map(d => {
                                d.BrewStatus = d.Status;
                                d.AtLogin = plist.split('\n').some(p => {
                                    return p.endsWith(`${d.Name}.plist`);
                                });
                                let sv = services.filter(s => {
                                    return s.Label == `homebrew.mxcl.${d.Name}`;
                                });
                                if (sv.length == 1) {
                                    let ss = sv[0];
                                    if (ss.PID == '-') {
                                        d.Status = 'stopped';
                                    } else {
                                        d.Status = 'started';
                                    }
                                }
                            });
                            $timeout(function () {
                                console.log(data);
                                $scope.servicesList = data;
                            });
                        });
                });
        };

        $scope.updateConfig = function(){
            console.log(angular.toJson($scope.globalConfig));
            OSXShellExec.saveTextFile(`${supportPath}/config.json`, angular.toJson($scope.globalConfig));
        };

        $scope.showParams = function (d, event) {
            debugger;

            event.preventDefault();
            event.stopPropagation();
            if (d == $scope.selectedModule) {
                $scope.showParamPanel = !$scope.showParamPanel;
                return;
            }
            let name = d.Name;
            $scope.selectedModule = d;
            $scope.showParamPanel = true;

            let defaultConfig = {
                type: 'text',
                value: '',
                prefix: '',
                suffix: '',
                desp: '',
                warning: false,
                options: []
            };

            // let promises = [];
            // promises.push(OSXShellExec.execShell(`${find} /usr/local/Cellar -iname homebrew.mxcl.${name}.plist`));
            // promises.push(OSXShellExec.readTextFile(`${supportPath}/homebrew.mxcl.${name}.json`));
            // if(configOnline == true){
            // }

            OSXShellExec.execShell(`${find} /usr/local/Cellar -iname homebrew.mxcl.${name}.plist`)
                .then((data) => {
                    if (data && data.length > 0) {
                        return OSXShellExec.readPlist(data)
                    }
                })
                .then((plist) => {
                    console.log(plist);
                    $scope.config = plist;
                    return OSXShellExec.readTextFile(`${supportPath}/homebrew.mxcl.${name}.json`)
                })
                .then((conf) => {
                    if (conf) {
                        conf = angular.fromJson(conf);
                    } else {
                        conf = [];
                    }

                    debugger;

                    let params = [];
                    angular.forEach($scope.config.ProgramArguments, (v, k) => {
                        if (k == 0) {
                            params.push(angular.extend({}, defaultConfig, {
                                value: v,
                                checked: true
                            }));
                        } else {
                            let result = false;
                            for (let c of conf) {
                                let reg = c.reg;
                                if (reg && reg.trim().length > 0) {
                                    result = new RegExp(reg).test(v);//eval(`/${reg}/.test("${v}")`);
                                    if (result == true) {
                                        c.matched = true;
                                        v = v.replace(c.prefix, '').replace(c.suffix, '').trim();
                                        params.push(angular.extend({}, defaultConfig, c, { value: v, checked: true }));
                                        break;
                                    }
                                }
                            }
                            // angular.forEach(conf, (c, i) => {
                            //     let reg = c.reg;
                            //     if (reg && reg.trim().length > 0) {
                            //         result = new RegExp(reg).test(v);//eval(`/${reg}/.test("${v}")`);
                            //         if (result == true) {
                            //             cf = c;
                            //             c.matched = true;
                            //             return
                            //         }
                            //     }
                            // });
                            if (result != true) {
                                params.push(angular.extend({}, defaultConfig, {
                                    value: v,
                                    checked: true
                                }));
                            }
                        }
                    });
                    angular.forEach(conf, (c) => {
                        if (!c.matched) {
                            params.push(angular.extend({}, defaultConfig, c, { checked: false }));
                        }
                    });

                    angular.forEach(params, p => {
                        p.realValue = `${p.prefix}${p.value}${p.suffix}`;
                        if (p.type == 'number') {
                            p.value = parseInt(p.value);
                        }
                        if (p.prefix.trim().length > 0 || p.suffix.trim().length > 0) {
                            p.hasAddons = true;
                        }
                    });

                    $timeout(() => {
                        $scope.config.params = params;
                    });
                });
        };

        $scope.toggleModule = function (d) {

            debugger;

            let name = d.Name;
            let option = 'run';
            if (d.Status == 'started') {
                option = 'stop';
            } else {
                if (d.AtLogin == true) {
                    option = 'start';
                }
                if (d.BrewStatus == 'started') {
                    option = 'restart';
                }
            }
            OSXShellExec.execShell(`${brew} services ${option} ${name}`)
                .then(() => {
                    if (option == 'stop') {
                        d.AtLogin = false;
                        d.Status = 'stopped';
                        $scope.setAtLogin(d);
                    } else {
                        $scope.init();
                    }
                })
        };

        /**
         * 是否自启动
         */
        $scope.toggleAtLogin = function (d, event) {
            // event.preventDefault();
            // event.stopPropagation();

            debugger;

            console.log(d);
            let name = d.Name;
            let target = `${userHome}/Library/LaunchAgents/homebrew.mxcl.${name}.plist`;

            if (d.AtLogin == false) {
                $scope.setAtLogin(d);
            } else {
                OSXShellExec.execShell(`${launchctl} unload ${target}`)
                    .then(() => {
                        return OSXShellExec.execShell(`${rm} -f ${userHome}/Library/LaunchAgents/homebrew.mxcl.${name}.plist`)
                    }, (err) => {
                        console.log(err);
                        $scope.init();
                    })
                    .then(function () {
                        $scope.init();
                    }, (err) => {
                        console.log(err);
                        $scope.init();
                    });
            }
        };

        $scope.setAtLogin = function (d) {
            let name = d.Name;
            let target = `${userHome}/Library/LaunchAgents/homebrew.mxcl.${name}.plist`;

            let RunAtLoadOld = true;
            let KeepAliveOld = true;
            let plist = {};

            OSXShellExec.execShell(`${find} /usr/local/Cellar -iname homebrew.mxcl.${name}.plist`)
                .then((data) => {
                    console.log(data);
                    if (data && data.length > 0) {
                        return OSXShellExec.execShell(`${cp} ${data} ${target}`);
                    }
                }, (err) => {
                    console.log(err);
                    $scope.init();
                })
                .then(() => {
                    if (d.Status == 'started') {
                        return OSXShellExec.execShell(`${launchctl} load ${target}`)
                    } else {
                        return OSXShellExec.readPlist(target)
                            .then((p) => {
                                plist = p;
                                RunAtLoadOld = plist.RunAtLoad;
                                KeepAliveOld = plist.KeepAlive;
                                plist.RunAtLoad = false;
                                plist.KeepAlive = false;
                                return OSXShellExec.savePlist(angular.toJson(plist), target)
                                    .then(() => {
                                        return OSXShellExec.execShell(`${launchctl} load ${target}`);
                                    });
                            })
                            .then(() => {
                                return OSXShellExec.execShell(`${launchctl} load ${target}`);
                            })
                    }
                }, (err) => {
                    console.log(err);
                    $scope.init();
                })
                .then(() => {
                    if (d.Status != 'started') {
                        plist.RunAtLoad = RunAtLoadOld;
                        plist.KeepAlive = KeepAliveOld;
                        OSXShellExec.savePlist(angular.toJson(plist), target)
                            .then(() => {
                                $scope.init();
                            })
                    }
                    $scope.init();
                }, (err) => {
                    console.log(err);
                    $scope.init();
                })
        };

        $scope.addParam = function () {
            $scope.config.params.push({
                checked: true,
                value: ''
            });
        };

        $scope.saveParams = function (d) {
            debugger;
            let valid = true;
            angular.forEach($scope.config.params, (p) => {
                p.value += '';
                if (p.reg && p.reg.length > 0 && p.value && p.value.trim().length > 0) {
                    p.realValue = `${p.prefix}${p.value}${p.suffix}`
                    let result = new RegExp(p.reg).test(p.realValue);//(`/${p.reg}/.test("${p.value}")`);
                    if (result == false) {
                        valid = false;
                        p.valid = false;
                    }
                }
            });

            if (valid == false) {
            } else {
                let params = $scope.config.params.filter(p => {
                    return p.realValue && p.realValue.trim().length > 0 && p.checked;
                }).map(p => {
                    return p.realValue;
                });

                let name = d.Name;
                let target2 = '';
                let target = `${userHome}/Library/LaunchAgents/homebrew.mxcl.${name}.plist`;

                OSXShellExec.execShell(`${find} /usr/local/Cellar -iname homebrew.mxcl.${name}.plist`)
                    .then((data) => {
                        target2 = data;
                        return OSXShellExec.readPlist(target2);
                    })
                    .then(plist => {
                        plist.ProgramArguments = params;
                        return OSXShellExec.savePlist(angular.toJson(plist), target2);
                    })
                    .then(() => {
                        return OSXShellExec.readPlist(target);
                    })
                    .then((plist) => {
                        if (plist) {
                            return OSXShellExec.savePlist(angular.toJson(plist), target);
                        } else {
                            $scope.init();
                        }
                    })
                    .then(() => {
                        $scope.init();
                    });

            }
        };

        $scope.exitApp = function () {
            navigator.app.exitApp();
        };

        $scope.selectRow = function (d) {
            $scope.selectedModule = d;
        };
    }]);
