module.exports = {
  presets: [
    // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
    '@vue/cli-plugin-babel/preset'
  ],
  'env': {
    'development': {
      // babel-plugin-dynamic-import-node plugin only does one thing by converting all import() to require().
      // This plugin can significantly increase the speed of hot updates, when you have a large number of pages.
      'plugins': ['dynamic-import-node']
    }
  },
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: (name) => `${name}/style/less`,
    }, 'vant']
  ],
  // plugins: [
  //   [
  //     'import',
  //     {
  //       libraryName: '@',
  //       libraryDirectory: 'es',
  //       // 指定样式路径
  //       style: (name) => `/assets/vantStyles/${name}/style/less`,
  //     },
  //     'vant',
  //   ],
  // ],
}
