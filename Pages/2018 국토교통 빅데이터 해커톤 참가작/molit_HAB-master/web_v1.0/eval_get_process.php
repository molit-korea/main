<?php  

$conn=mysqli_connect("0.0.0.0","root","0000","molit");  // molit db 참조
 
mysqli_set_charset($conn,"utf8");
  
if (mysqli_connect_errno($conn))  
{  
   echo "Failed to connect to MySQL: " . mysqli_connect_error();  
}  

$k_id = $_GET['k_id'];

$result=mysqli_query($conn, "select avg(q1) FROM bus_member WHERE k_id='".$k_id."'");
//echo($result);

echo("q1 test");
$row=mysql_fetch_row($result);
echo($row);
while($row=mysql_fetch_row($result)){
    echo("IN");
    $q1=$row[0];    
    echo($q1);
}


$result=mysqli_query($conn, "select avg(q2) FROM bus_member WHERE k_id='".$k_id."'");

if($row=mysql_fetch_assoc($result)){
    $q2=$row["avg(q2)"];
}

$result=mysqli_query($conn, "select avg(q3) FROM bus_member WHERE k_id='".$k_id."'");

if($row=mysql_fetch_assoc($result)){
    $q3=$row["avg(q3)"];
}

$q5=($q1+$q2+$q3)/3;

$sql="SELECT q4 FROM bus_member WHERE k_id='".$k_id."'";

$q4_result="";
while($row=mysql_fetch_assoc($result)){
    $q4_result.$row["q4"].";";
}
 
echo json_encode(array($q1, $q2, $q3, $q4, $q5));

mysqli_close($conn);  

?> 