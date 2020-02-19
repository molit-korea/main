<?php  
$con=mysqli_connect("localhost","root","0000","molit", "3306");  // molit db 참조
 
mysqli_set_charset($con,"utf8");
  
if (mysqli_connect_errno($con))  
{  
   echo "Failed to connect to MySQL: " . mysqli_connect_error();  
}  
//$k_id = $_POST['k_id'];  
//$bus_num = $_POST['bus_num'];  
//$bus_name = $_POST['bus_name'];  

$lon= floatval($_GET['lon']);  
$lat = floatval($_GET['lat']);  
//$q1 = $_POST['q1'];
//$q2 = $_POST['q2'];
//$q3 = $_POST['q3'];
//$q4 = $_POST['q4']; // comment
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
);

*/
  
//echo($lat);
//echo($lon);
$sql="select * FROM accident WHERE lat=".$lat." and lon=".$lon;
//$sql="select * FROM accident WHERE lat=".$lat;
//echo("SQL");
//echo($sql);

$result=mysqli_query($con, $sql);

$array=array();
//echo$result);

while($row=mysqli_fetch_array($result))
{
    array_push($array, array('accident'=> $row[0], 'death' => $row[1], 'very_hurt' => $row[2], 'light_hurt'=>$row[3], 'injury'=>$row[4], 'many'=>$row[5], 'severity'=>$row[6], 'total' => $row[7], 'accident_type' => $row[8], 'lat' => $row[9], 'lon' => $row[10]));
}

echo json_encode($array);
  
mysqli_close($con);  

?> 