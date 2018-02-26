//기본 모듈
var express = require('express');
var http = require('http');
var path = require('path');
//get_post 파싱 모듈
var static = require('serve-static');
var bodyParser = require('body-parser');
//cookie_session 파싱 모듈
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

//express 객체 생성
var app = express();
//express 기본 설정
app.set('port', process.env.PORT || 3000);

//미들웨어 설정
app.use(static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(expressSession({
  secret:'my key',
  resave:true,
  saveUninitialized:true
}));

//router 객체 생성
var router = express.Router();

//상품정보 라우팅 함수
router.route('/process/product').get(function(req, res){
  console.log('/process/product 호출됨.');

  if(req.session.user){
    res.redirect('/product.html');
  } else{
    res.redirect('/login.html');
  }
});

//로그인 라우팅 함수 - 로그인 후 세션 저장함
router.route('/process/login').post(function(req, res){
  console.log('/process/login 호출됨.');

  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;

  if(req.session.user){
      //이미 로그인된 상태
      console.log('이미 로그인되어 상품 페이지로 이동합니다.');

      res.redirect('/product.html');
  } else{
    //세션 저장
    req.session.user = {
      id: paramId,
      name: '소녀시대',
      authorized:true
    };
    //세션 저장 후, 로그인 성공 및 상품 페이지 이동 여부 안내
    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>로그인 성공</h1>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
    res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
    res.write(" <br><br><a href='/process/product'>상품 페이지로 이동하기</a>");
    res.end();
  }
});

//로그아웃 라우팅 함수 - 로그아웃 후 세션 삭제함
router.route('/process/logout').get(function(req, res){
  console.log('/process/logout 호출됨.');

  if(req.session.user){
    //로그인 된 상태
    console.log('로그아웃 합니다.');

    req.session.destroy(function(err){
      if(err){throw err;}

      console.log('세션을 삭제하고 로그아웃되었습니다.');
      res.redirect('/login.html');
    });
  } else{
    //로그인 안된 상태
    console.log('아직 로그인되어 있지 않습니다.');

    res.redirect('/login.html');
  }
});

app.use('/',router);

http.createServer(app).listen(3000,function(){
  console.log('Express 서버가 3000번 포트에서 시작됨.');
});
