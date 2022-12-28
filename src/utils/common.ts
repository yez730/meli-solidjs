let startTimeList:{value:string,text:string}[]  = [];
let time=0; // 分钟
while(time<24*60){
  let hh=Math.trunc(time / 60) < 10 ? '0'+Math.trunc(time / 60) : Math.trunc(time / 60);
  let mm=time % 60 < 10 ? '0'+time % 60:time % 60;
  startTimeList.push({ value: hh+':'+mm, text: hh+':'+mm });
  time=time+5;
}

let durationList:{value:number,text:string}[] = []; //TODO type?
let val=0; // 分钟
while(val< 12 * 60){
  if(val<2*60){
    val=val+5;
  } else if(val<4*60){
    val=val+15;
  } else if(val<7*60){
    val=val+30;
  }else if(val<12*60){
    val=val+60;
  }
  durationList.push({ value: val, text: Math.trunc(val / 60) >0 ?`${ Math.trunc(val / 60)} 小时${val % 60===0?"": " "+val % 60+ "分钟"  }`:`${val % 60} 分钟` });
}

export {startTimeList,durationList};
