module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = "Trang quản trị hệ thống khách sạn Đông Phong";
        return args;
      })
  }
}
