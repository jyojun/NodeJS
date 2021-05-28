var fs = require('fs'); // fs라는 모듈을 사용함

//readFileSync
console.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf8'); //return 값을 주는데
console.log(result);
console.log('C');


// nodejs 에서는 비동기적인 방식이 더 선호된다.
console.log('A');
fs.readFile('syntax/sample.txt', 'utf8', function(err, result){ // return 값이 아닌 err 뒤에있는 인자가 읽은값으로 저장된다.
    console.log(result);
}); 
console.log('C');