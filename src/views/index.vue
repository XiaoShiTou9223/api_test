<template>
    <el-container>
        <!-- 放置一个抽屉用于配置信息 -->
        <el-drawer title :visible.sync="ctl.drawer" direction="rtl" :with-header="false" :show-close="false">
            <el-form :rules="rules" :model="paramLogin" class="pal" label-width="120px" label-position="left">
                <el-divider><i style="font-size: 1.1rem; color: #409EFF; " class="el-icon-user-solid">Account</i></el-divider>
                <el-form-item label="用户类型">
                    <el-radio v-model="radio" label="o">其他</el-radio>
                    <el-radio v-model="radio" label="a">管理员</el-radio>
                    <!--<el-radio v-model="radio" label="t">测试用户</el-radio>-->
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="paramLogin.username" class="stdinput" @input="changeLoginUser"></el-input>
                </el-form-item>
                <!--<el-form-item label="密码">-->
                <!--<el-input v-model="paramLogin.password"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="密码" prop="password">
                    <el-select
                            v-model="paramLogin.password"
                            @input="changeLoginPassword"
                            allow-create
                            filterable
                            default-first-option
                            placeholder="请选择或输入">
                        <el-option
                                v-for="item in passwords"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-row gutter="20px" style="width: 100%;margin-left: 30%;">
                    <el-col :span="5"><el-button @click="ctl.drawer = false">取 消</el-button></el-col>
                    <el-col :span="5"><el-button type="primary" @click="handleLogin">确 定</el-button></el-col>
                </el-row>
                <el-divider><i style="font-size: 1.1rem;color: #409EFF; " class="el-icon-s-tools">Setting</i></el-divider>
                <el-form-item label="登录MD5加密">
                    <el-checkbox label="加密" name="type" v-model="server.isMd5" @change="changeLoginMd5"></el-checkbox>
                </el-form-item>
                <el-form-item label="请求加密">
                    <el-select disabled v-model="server.isEncryptRequest" @change="changeReqEncrypt" placeholder="请选择">
                        <el-option
                                v-for="item in encryptType"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请求协议头">
                    <el-select
                            v-model="server.base"
                            allow-create
                            filterable
                            default-first-option
                            placeholder="请选择">
                        <el-option
                                v-for="item in bases"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-divider><i style="font-size: 1.1rem;color: #409EFF; " class="el-icon-refrigerator">Server</i></el-divider>
                <el-form-item label="请求端口">
                    <el-input v-model="server.port" class="stdinput" @input="handlePortChange"></el-input>
                </el-form-item>
                <el-form-item label="Context Root">
                    <el-input v-model="server.context" class="stdinput" @input="handleContextChange"></el-input>
                </el-form-item>
                <el-form-item label="登录API">
                    <el-select
                            allow-create
                            filterable
                            default-first-option
                            @change="handleLogApiChange"
                            v-model="server.logApi"
                            placeholder="请选择或输入">
                        <el-option
                                v-for="item in logApis"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-divider></el-divider>

            </el-form>
        </el-drawer>

        <!-- 主要的部分 -->
        <el-main>
            <el-form class="post-form" label-width="85px" :model="formData">
                <el-row>

                    <el-col :span="20">
                        <el-form-item label="登录用户">
                            <strong>{{username}}</strong>
                            <el-button @click="ctl.drawer = true" size="mini">Login</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="请求地址">
                            <el-input size="mini" v-model="formData.url" placeholder="input you path"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="请求参数">
                            <el-input
                                    v-if="!server.preview"
                                    size="mini"
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 5}"
                                    v-model="formData.json"
                                    placeholder="Json Params"
                                    title="需要标准的Json"
                            ></el-input>
                            <div v-highlight v-else>
                              <pre
                                      class="hljs json re-size"
                                      id="psrender"
                                      v-html="vpshtml"
                              >{{vpshtml}}</pre>
                            </div>
                            <span> 预览: </span>
                            <el-switch size="mini" v-model="server.preview" @change="handlePreview"></el-switch>
                            <el-button class="color-blue" @click="doGet" size="mini">Get</el-button>
                            <el-button class="color-blue" @click="doPost" size="mini">Post</el-button>
                            <span> 请求分页: </span>
                            <el-switch size="mini" v-model="formData.isPaged"></el-switch>
                            第
                            <el-input
                                    style="width: 80px"
                                    size="mini"
                                    type="number"
                                    min="1"
                                    max="30"
                                    v-model="formData.page"
                            ></el-input>
                            页，数量
                            <el-input
                                    style="width: 80px"
                                    size="mini"
                                    type="number"
                                    min="1"
                                    max="30"
                                    v-model="formData.pageSize"
                            ></el-input>
                            。
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="请求结果">
                            <el-badge :value="this.resultSize" class="item">
                                <div v-highlight>
                  <pre
                          class="hljs json re-size"
                          id="resultrender"
                          v-html="vhtml"
                  >{{vhtml}}</pre>
                                </div>
                            </el-badge>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="URL列表">
                            <el-badge :value="this.urlSet.size" class="item">
                                <ul class="re-size">
                                    <li v-for="(item,i) in dataUrls" :key="i" :data-url="item">
                                        <div class="disableinp">
                                            <span class="txtovf" :title="item">{{item}}</span>
                                            <span class="btn-group">
                        <span class="btn color-blue" @click="applyurl(item)">A</span>
                        <span class="btn" @click="removeurl(item)">D</span>
                      </span>
                                        </div>
                                    </li>
                                </ul>
                            </el-badge>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="参数列表">
                            <el-badge :value="this.paramSet.size" class="item">
                                <ul class="re-size">
                                    <li v-for="(item,i) in dataParams" :key="i" :data-url="item">
                                        <div class="disableinp">
                                            <span class="txtovf" :title="item">{{item}}</span>
                                            <span class="btn-group">
                        <span class="btn color-blue" @click="applyparam(item)">A</span>
                        <span class="btn" @click="removeparam(item)">D</span>
                      </span>
                                        </div>
                                    </li>
                                </ul>
                            </el-badge>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
    // 这个是用于存储在浏览器的localstore的方法
    import {lsget, lsput} from "@/utils/localStore.js";
    // 引用代码的动态渲染需要这个
    import hljs from "highlight.js";
    // 定义了两个key
    const LS_URLS = "_urls_";
    const LS_PARAMS = "_params_";
    const SYS_LOGIN_MD5 = "_sys_md5_login_";
    const SYS_REQ_ENCRYPT = "_sys_encrypt_req_";
    const SYS_LOGIN_LAST = "_sys_login_last_";
    const SYS_LOGIN_API_LAST = "_sys_login_api_last_";
    const SYS_LOGIN_PWD_LAST = "_sys_login_pwd_last_";
    const SYS_PORT_LAST = "_sys_port_last_";
    const SYS_CONTEXT_ROOT_LAST = "_sys_app_path_last_";

    export default {
        name: "page-of-ajax-client",
        computed: {
            deflogin() {
                const ctx = (this.server.context === "/" ?  "" : this.server.context);
                return (
                    this.server.base +
                    this.server.port +
                    (this.server.logApi.charAt(0) === '/'
                        ? ctx + this.server.logApi
                        : ctx + '/' + this.server.logApi)
                );
            },
            rules () {
                return {
                    username: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ]
                }
            }
        },
        data() {
            return {
                radio: "a",
                server: {
                    port: 10201,// process.env.VUE_APP_SPORT,
                    isMd5: false,
                    isEncryptRequest: 'none',
                    base: "http://localhost:",
                    logApi: "/system/authentication/login/unpw.do",
                    preview: false,
                    context: '/'
                },
                bases: ["http://localhost:", "https://localhost:"],
                logApis: [
                    '/system/authentication/login/unpw.do',
                    '/system/authentication/login.do',
                    '/user/login.do',
                    '/login.do'
                ],
                passwords: ['1111', '11111111', 'pw123456', '12345678', '1'],
                paramLogin: {
                    username: "administrator",
                    password: "1111"
                },
                encryptType: ['none', 'md5', 'base64', 'encode'],
                ctl: {
                    drawer: true
                },
                urlSet: new Set(),
                paramSet: new Set(),
                isPaged: false,
                formData: {
                    url: "test.do",
                    json: "{}",
                    page: 1,
                    pageSize: 10,
                    result: undefined,
                    // 请求Url列表串
                    reqUrls: undefined,
                    // 请求参数列表串
                    reqParams: undefined
                },
                // 返回的代码结果
                vhtml: "",
                vpshtml: "",
                dataUrls: [],
                dataParams: [],
                resultSize: undefined,
                username: "",
                count: 0
            };
        },
        watch: {
            // 选择登陆的用户
            radio: function (key) {
                // 根据选择初始化一个密码值
                this.paramLogin.username = {
                    o: "",
                    a: "administrator",
                    t: "test"
                }[key];
                this.paramLogin.password = {
                    o: "",
                    a: "1111",
                    t: "11111111"
                }[key];
            }
        },
        methods: {
            reUrl(url) {
                const regexp = /(http:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/g;
                return url.replace(regexp, '')
            },
            renderCode() {
                setTimeout(() => {
                    var pres = document.querySelectorAll("pre");
                    for (var i = 0; i < pres.length; i++) {
                        hljs.highlightBlock(pres[i]);
                    }
                }, 20);
            },
            handleClose(done) {
                done(); // 弹窗的 ·X· 管理触发
            },
            formatUrl(api) {
                if (typeof api === "string") {
                    // 处理一下url
                    api = this.reUrl(api);
                    // 处理不以 / 打头的情况
                    api = api.charAt(0) === "/" ? api : "/" + api;
                    // 添加项目的context


                    this.urlSet.add(api.trim());
                    this.dataUrls = [...this.urlSet.values()];
                    lsput(LS_URLS, this.dataUrls);
                    this.showUrlArray(this.dataUrls);
                    return this.server.base + this.server.port +
                        (this.server.context === "/" ?  "" : this.server.context) + api;
                }
                return "#";
            },
            showUrlArray(arr) {
                this.formData.reqUrls = "";
                try {
                    arr = arr.reverse();
                } catch (e) {
                    console.debug(e);
                }
                for (let v of arr) {
                    this.formData.reqUrls += v + "\n";
                }
            },
            /** 格式化并将数据显示到页面 */
            showParamArray(arr) {
                this.formData.reqParams = "";
                try {
                    arr = arr.reverse();
                } catch (e) {
                    console.debug(e);
                }
                for (let v of arr) {
                    this.formData.reqParams += v + "\n";
                }
            },
            rls(v, type) {
                if ({url: true}[type]) {
                    this.urlSet = new Set(lsget(LS_URLS) ? JSON.parse(lsget(LS_URLS)) : []);
                    this.urlSet.delete(v);
                    this.dataUrls = [...this.urlSet.values()];
                    lsput(LS_URLS, JSON.stringify(this.dataUrls));
                    this.showUrlArray(this.dataUrls);
                }
                if ({param: true}[type]) {
                    this.paramSet = new Set(
                        lsget(LS_PARAMS) ? JSON.parse(lsget(LS_PARAMS)) : []
                    );
                    this.paramSet.delete(v);
                    this.dataParams = [...this.paramSet.values()];
                    lsput(LS_PARAMS, JSON.stringify(this.dataParams));
                    this.showParamArray(this.dataParams);
                }
            },
            removeurl(v) {
                this.rls(v, "url");
            },
            removeparam(v) {
                this.rls(v, "param");
            },
            applyurl(v) {
                this.formData.url = v;
            },
            applyparam(v) {
                this.server.preview = false;
                this.formData.json = v;
            },
            checkAuthorizingMissing(data) {
                const info = data;
                // 未登陆时
                if (info.error && info.error === "InvalidIdentification") {
                    this.$notify({
                        title: "提示",
                        message: "未登陆",
                        type: "warning"
                    });
                    this.setDefaultlogin();
                    return false;
                } else if (info.error && info.error === "AuthorizingMissing") {
                    this.$notify({
                        title: "提示",
                        message: "无权限",
                        type: "warning"
                    });
                } else if (info.error) {
                    this.$notify({
                        title: "提示",
                        message: info.error,
                        type: "error"
                    });
                } else {
                    console.debug("success");
                }
                return true;
            },
            ajax(method, url, params, callback) {
                this.paramSet.add(params);
                this.dataParams = [...this.paramSet.values()];
                lsput(LS_PARAMS, this.dataParams);
                this.showParamArray(this.dataParams);

                method = method.toUpperCase();

                // 格式化请求参数
                params = params === "" ? "{}" : params;
                params = params.replace(/'/g, '"');

                let reqData = this.formData.isPaged
                    ? {
                        data: params,
                        size: this.formData.pageSize,
                        page: this.formData.page
                    }
                    : {data: params};

                let S = this;
                let size = 0;
                this.$.ajax({
                    type: method,
                    url: url,
                    data: method === "POST" ? JSON.stringify(reqData) : reqData,
                    dataType: "json",
                    contentType: "application/json; charset=UTF-8",
                    success: function (data) {
                        let info = data;
                        size = Array.isArray(data.data) ? data.data.length : 1;
                        callback(info);
                    },
                    error: function (e) {
                        if (e.status === 404) {
                            S.$notify({
                                title: "提示",
                                message: "Page Not Found (404)",
                                type: "error"
                            });
                        }
                        if (e.status === 505) {
                            S.$notify({
                                title: "提示",
                                message: "Service Not Working (505)",
                                type: "error"
                            });
                        }
                    },
                    complete: function () {
                        S.resultSize = size;
                    }
                });
            },
            doPost() {
                this.ajax(
                    "post",
                    this.formatUrl(this.formData.url),
                    this.formData.json,
                    data => {
                        if (this.checkAuthorizingMissing(data)) {
                            this.formData.result = JSON.stringify(data);
                            try {
                                this.vhtml = JSON.stringify(data, null, "\t");
                            } catch (e) {
                                this.vhtml = this.formData.result;
                            }

                            this.renderCode();
                            console.log("> POST[" + this.formData.url + "]", data.data);
                        }
                    }
                );
            },
            doGet() {
                this.ajax(
                    "get",
                    this.formatUrl(this.formData.url),
                    this.formData.json,
                    data => {
                        if (this.checkAuthorizingMissing(data)) {
                            this.formData.result = JSON.stringify(data);

                            try {
                                this.vhtml = JSON.stringify(data, null, "\t");
                            } catch (e) {
                                this.vhtml = this.formData.result;
                            }

                            this.renderCode();
                            console.log("> GET[" + this.formData.url + "]", data.data);
                        }
                    }
                );
            },
            handleLogin() {
                this.ajax(
                    "post",
                    this.deflogin,
                    '{"username":"' +
                    this.paramLogin.username +
                    '","password":"' +
                    (this.server.isMd5
                        ? this.$md5(this.paramLogin.password)
                        : this.paramLogin.password) +
                    '"}',
                    data => {
                        try {
                            this.vhtml = JSON.stringify(data, null, 4);
                        } catch (e) {
                            this.vhtml = "";
                        }
                        this.renderCode();
                        this.username = data.data.username || "";
                    }
                );
            },
            changeLoginMd5(v) {
                lsput(SYS_LOGIN_MD5, v ? 'yes' : 'no')
            },
            changeReqEncrypt(v) {
                lsput(SYS_REQ_ENCRYPT, v)
            },
            changeLoginUser(u) {
                lsput(SYS_LOGIN_LAST, u)
            },
            changeLoginPassword(pwd) {
                lsput(SYS_LOGIN_PWD_LAST, pwd)
            },
            handlePortChange(p) {
                lsput(SYS_PORT_LAST, p)
            },
            handleContextChange(p) {
                lsput(SYS_CONTEXT_ROOT_LAST, p)
            },
            handleLogApiChange(p) {
                lsput(SYS_LOGIN_API_LAST, p)
            },
            handlePreview() {
                const mvpshtml = this.formData.json || '';
                this.vpshtml = mvpshtml.replace(/'/g, '"');
                this.renderCode()
            }
        },
        created() {
            this.$.ajaxSetup({
                cache: false,
                contentType: "application/json; charset=UTF-8",
                xhrFields: {
                    withCredentials: true
                },
                timeout: 20000
            });
            this.urlSet = new Set(lsget(LS_URLS) ? JSON.parse(lsget(LS_URLS)) : []);
            this.paramSet = new Set(
                lsget(LS_PARAMS) ? JSON.parse(lsget(LS_PARAMS)) : []
            );
            this.dataUrls = [...this.urlSet.values()];
            this.showUrlArray(this.dataUrls);
            this.dataParams = [...this.paramSet.values()];
            this.showParamArray(this.dataParams);

            // 设置登录MD5加密
            this.server.isMd5 = lsget(SYS_LOGIN_MD5) ? lsget(SYS_LOGIN_MD5) === 'yes' : false;

            // 设置请求加密方式
            this.server.isEncryptRequest = lsget(SYS_REQ_ENCRYPT) || 'none';

            // 回显上次登录的用户名
            this.paramLogin.username = lsget(SYS_LOGIN_LAST) || this.paramLogin.username;

            // 选择的登录的api
            this.server.logApi = lsget(SYS_LOGIN_API_LAST) || this.server.logApi;

            // 回显上次使用的密码
            this.paramLogin.password = lsget(SYS_LOGIN_PWD_LAST) || this.paramLogin.password;

            // 回显上次使用的端口
            this.server.port = lsget(SYS_PORT_LAST) || this.server.port;

            // 回显上次使用的项目的根
            this.server.context = lsget(SYS_CONTEXT_ROOT_LAST) || this.server.context;
        }
    };
</script>

<style scoped>
    .disableinp {
        border-bottom: 1px solid;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 3px;
        background: #eee;
    }

    .item {
        margin-top: 10px;
        margin-right: 40px;
        width: 95%;
    }

    .btn {
        cursor: pointer;
        background: #f56c6c;
        border-radius: 5px;
        padding: 1px 15px;
        margin: 0 1px;
        color: white;
    }

    .color-blue {
        background: #409eff;
        color: white;
    }

    .btn-group {
        display: flex;
    }

    .txtovf {
        white-space: nowrap;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    ul, li {
        list-style: none;
    }

    .pal {
        margin: 10px;
    }

    .re-size {
        line-height: initial;
        font-size: 0.6rem;
    }

    .stdinput {
        width: 210px
    }
</style>
