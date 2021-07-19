module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    },
    //下面是无需定义，也可以使用的全局变量
    globals:{
        //define 主要是解决 echart的theme的macarons.js中的，全局变量问题
        define : true
    }
}