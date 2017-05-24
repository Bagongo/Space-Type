<?php
    
    session_start();
    include("connection.php");

    if(isset($_COOKIE["auth_k"]))
    {        
        $query = "SELECT `username` FROM `userinfo` WHERE `auth`= '".$_COOKIE["auth_k"]."'";
        $result = mysqli_query($connection001, $query);
        $row = mysqli_fetch_assoc($result);
                
        $_SESSION["username"] = $row["username"];
        $_SESSION["loggedIn"] = true;  

        $query = "SELECT `besttime`, `bestacc`, `bestwpm` FROM `userscore` WHERE `username`= '".$_SESSION["username"]."' LIMIT 1";
        $result = mysqli_query($connection001, $query);
        $row = mysqli_fetch_assoc($result);
        $score = array("besttime"=>$row["besttime"], "bestacc"=>$row["bestacc"], "bestwpm"=>$row["bestwpm"]);
        $data = array("loggedIn" => $_SESSION["loggedIn"], "username" => $_SESSION["username"], "score" => $score);       
    }
    else
    {
        $score = array("besttime"=>0, "bestacc"=>0, "bestwpm"=>0);
        $data = array("loggedIn" => false, "username" => "", "score" => $score);
    }

    echo json_encode($data);           

?>
    