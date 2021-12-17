const { User } = require("../models/User");

let auth = (req, res, next) => {
  //인증처리 하는곳

  //클라이언트 쿠키에서 토큰 가져오기
  let token = req.cookies.x_auth;

  //토큰을 복호화 한후 유저찾기
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next();
  });

  //유저가 있으면 인증 okay

  //유저가 없으면 인증 no
};

module.exports = { auth };
