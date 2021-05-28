var f = function(){
  console.log(1+1);
  console.log(1+2);
}

// 함수를 배열이나 객체에 담을 수 있다.
var a = [f];
a[0]();

var o = {
  func:f
}
o.func();
