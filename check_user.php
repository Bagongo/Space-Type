<?php
  
    include("connection.php");

    if(isset($_COOKIE["auth_k"]))
    {
        $loggedIn = true;  
        
        $query = "SELECT `username` FROM `userinfo` WHERE `auth`= '".$_COOKIE["auth_k"]."'";
        $result = mysqli_query($connection001, $query);
        $row = mysqli_fetch_assoc($result);
        
        $username = $row["username"];
        
        $query = "SELECT `besttime`, `bestacc`, `bestwpm` FROM `userscore` WHERE `username`= '".$username."' LIMIT 1";
        $result = mysqli_query($connection001, $query);
        $row = mysqli_fetch_assoc($result);
        $score = array("besttime"=>$row["besttime"], "bestacc"=>$row["bestacc"], "bestwpm"=>$row["bestwpm"]);
        $data = array("loggedIn" => $loggedIn, "username" => $username, "scoreData" => $score);       
        echo json_encode($data);           
    }
    
?>
    