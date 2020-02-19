<?php  
$con=mysqli_connect("localhost","root","0000","molit", "3306");  // molit db 참조
 
mysqli_set_charset($con,"utf8");
  
if (mysqli_connect_errno($con))  
{  
   echo "Failed to connect to MySQL: " . mysqli_connect_error();  
}  
$k_id = $_POST['k_id'];  
$bus_num = $_POST['bus_num'];  
$bus_name = $_POST['bus_name'];  
$q1 = $_POST['q1'];
$q2 = $_POST['q2'];
$q3 = $_POST['q3'];
$q4 = $_POST['q4']; // comment
/*
db 명세
member 테이블
CREATE TABLE bus_member(
idx int(11) NOT NULL AUTO_INCREMENT,
k_id varchar(50) NOT NULL,
bus_num varchar(20) NOT NULL,
bus_name varchar(30) NOT NULL,
q1 int(3) NOT NULL,
q2 int(3) NOT NULL,
q3 int(3) NOT NULL,
q4 varchar(1000),
PRIMARY KEY(idx)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

*/
  
$result = mysqli_query($con,"insert into bus_member (k_id, bus_num, bus_name, q1, q2, q3, q4) values ('$k_id','$bus_num','$bus_name','$q1','$q2','$q3','$q4')");  
  
  if($result){  
    echo 'success';
  }  
  else{  
    echo 'failure';  
  }  
  
  
mysqli_close($con);  

?> 