var q = {
  v1:'v1',
  v2:'v2',
  f1:function (){
    console.log(this.v1); // 자신을 뜻하는 객체 this
  },
  f2:function(){
    console.log(this.v2);
  }
}

q.f1();
q.f2();
