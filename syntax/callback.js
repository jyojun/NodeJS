function a(){
    console.log('A');
}

// 함수를 변수로 정의 할 수 있음

var a = function(){
    console.log('A');
}

function slowfunc(callback) {
    callback();
}

slowfunc(a);