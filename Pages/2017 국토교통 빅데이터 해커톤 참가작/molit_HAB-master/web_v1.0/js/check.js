function input_check(){
    var input_date_str=document.getElementById('input_date').value;
    var dateReg = /^\d{8}$/;
    
    //"22-03-1981".match(dateReg);
    var today=new Date();
    
    if(!input_date_str.match(dateReg)){
        alert("입력값을 확인해 주세요");
        return false;
    }
    
    var year=input_date_str.substr(0,4);
    var month=input_date_str.substr(4,2);
    var day=input_date_str.substr(6,2);
    if(month>12 || month<1 || day>31 || day<1){
        alert("입력값을 확인해 주세요");
        return false;
    }
    //if(!input_date.substring(5,2))
    
    var input_date=new Date(year, month, day);
    
    var max_date=today.setDate(today.getDate()+3);
    alert(max_date);
    console.log(input_date);
    
    if(max_date<input_date){
        alert("입력값을 확인해 주세요");
        return false;
    }
    
    return true;
    
    
    
}