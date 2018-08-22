function getTime (num,cc) {
    //num  是毫秒时间戳

    //cc  'day','min','day_min','day_min_s'

    if (!num) {
        return ""
    }

    var date=new Date(num*1000);

    //日期格式化
    var week=['日','一','二','三','四','五','六'];
    var y=date.getFullYear()+'-';
    var m=date.getMonth()+1+'-';
    var d=date.getDate()+'';

    var w='  星期'+week[date.getDay()];

    var h=date.getHours();
    // var am=h>=12?'  下午':'  上午';
    //h=h>12  ?  h-12  :  h;

    d=d<10  ?  '0'+d  :  ''+d;
    h=h<10  ?  '0'+h  :  ''+h ;

    var mi=date.getMinutes();
    mi=mi<10  ?  '0'+mi  :  ''+mi;

    var s=date.getSeconds();
    s=s<10  ?  '0'+s  :  ''+s;

    var str='';

    //console.log(cc);
    // var cc = 'day'

    if(cc=='day'){

        str= y+m+d;

    }else if(cc=='min'){

        str= h+' : '+mi;
    }else if(cc=='day_min'){

        str=y+m+d+' '+h+' : '+mi;
    }else if(cc=='day_min_s'){
        str=y+m+d+' '+h+' : '+mi+' : '+s;
    } else if (cc=='month') {
        str=y+m.slice(0, m.length-1)
    }


    return str;
}
export function numFormat(value){
    if (value == 'xx') {
        return '暂无权限查看'
    }
    if(!value) {
        return '0.00'
    }
    var intPart = Number(value).toFixed(0); //获取整数部分
    var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断

    var floatPart = ".00"; //预定义小数部分
    var value2Array = value.toString().split(".");

    //=2表示数据有小数位
    if(value2Array.length == 2) {
        floatPart = value2Array[1].toString(); //拿到小数部分

        if(floatPart.length == 1) { //补0,实际上用不着
            return intPartFormat + "." + floatPart + '0';
        } else {
            return intPartFormat + "." + floatPart;
        }

    } else {
        return intPartFormat + floatPart;
    }
}
export function trim (str) {
    return str.replace(/(^\s*)(\s*$)/g, '')
}
export function time (num) {
    return getTime(num,'day')
}
export function time_s (num) {
    return getTime(num,'day_min_s')
}
export function time_m (num) {
    return getTime(num,'day_min')
}
export function time_month (num) {
    return getTime(num,'month')
}

const filters = {
    trim,
    time,
    time_m,
    time_s,
    time_month,
    numFormat
}
export default filters
