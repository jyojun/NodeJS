var M = {
  v:'v',
  f:function(){
    console.log(this.v);
  }
}

module.exports = M; // M 밖(다른 파일))에서도 모듈을 사용할 수 있게함.
