<?php

    session_start();
    include("connection.php");

    $username = "";
    $pw = "";
    $score = array();
    $errorMsg = "";

    $signupStmt = "INSERT INTO `userinfo` (`auth`, `username`, `password`, `signdate`) VALUES (?, ?, ?, ?)";
    $createScoreStmt = "INSERT INTO `userscore` (`besttime`, `bestacc`, `bestwpm`, `username`) VALUES (?, ?, ?, ?)";
    $retrieveCredsStmt = "SELECT `password`, `id` FROM `userinfo` WHERE `username` = ? LIMIT 1";
    $retrieveScoreStmt = "SELECT `besttime`, `bestacc`, `bestwpm` FROM `userscore` WHERE `username`=? LIMIT 1";

    function setIdAndCookie($user)
    {
        $token = md5(uniqid(rand(), TRUE));
        $timeout = time() + 60 * 60 * 24 * 30 * 4;    
        setcookie("auth_k", $token, $timeout);
        $_SESSION["username"] = $user;
        $_SESSION["loggedIn"] = true;

        return $token;
    }

    function returnUserInfoRow($user, $connection, $statement)
    {
        $stmt = $connection->prepare($statement);
        $stmt->bind_param("s", $user);
        $stmt->execute();
        $stmt->store_result();
        
        return $stmt;
    }

    function returnScoresArray($user, $connection, $statement)
    {
        $stmt = $connection->prepare($statement);
        $stmt->bind_param("s", $user);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($besttime, $bestacc, $bestwpm);
        $stmt->fetch();    
        $score = array("besttime"=>$besttime, "bestacc"=>$bestacc, "bestwpm"=>$bestwpm);
        $stmt->close();
        
        return $score;
    }

    if(isset($_SESSION["loggedIn"]))
        $errorMsg = "Your are logged in already.<br />Please log out first if you want to register/login as a different user.";
       
    if ($_POST["submit"] == "Sign Up!" AND !isset($_SESSION["loggedIn"]))
    {            
        if(!($_POST["username"]))
            $errorMsg .= "You must enter a user name. <br />";
        else if(strlen($_POST["username"]) < 3 OR strlen($_POST["username"]) > 12)
            $errorMsg .= "You user name must be between 3 and 8 characters long.<br />";
        else if(!ctype_alnum($_POST["username"]))
            $errorMsg .= "Your user name can contain only letters & numbers. <br />";
        else 
        { 
            $stmt = returnUserInfoRow($_POST["username"], $connection001, $retrieveCredsStmt);
            
            if ($stmt->num_rows > 0)
                $errorMsg = "This username already exists, please choose another one (or login if this is you).<br />";
            else
                $username = $_POST["username"];
            
            $stmt->close();
        }
       
        if(!($_POST["pw"]))
            $errorMsg .= "You must enter a password. <br />";
        else if(strlen($_POST["pw"]) < 8)
            $errorMsg .= "Your password must be at least 8 characters long.<br />";
        else if(!$_POST["confirmpw"])
            $errorMsg .= "You must confirm your password.<br />";
        else if($_POST["confirmpw"] != $_POST["pw"])
            $errorMsg .= "Your password confirmation doesn't match.<br />";
        else
            $pw = password_hash($_POST["pw"], PASSWORD_DEFAULT);
        
        if(!$errorMsg)
        {
            $auth = setIdAndCookie($username);
            $date = date("Y-m-d H:i:s");
            
            $stmt = $connection001->prepare($signupStmt);
            $stmt->bind_param("ssss", $auth, $username, $pw, $date);
            $stmt->execute();
            $stmt->close();
            
            $zVar = 0;
            $stmt = $connection001->prepare($createScoreStmt);
            $stmt->bind_param("ddds", $zVar, $zVar, $zVar, $username);
            $stmt->execute();
            $stmt->close();
            
            $score = returnScoresArray($username, $connection001, $retrieveScoreStmt);            
        }        
    }

    if($_POST["submit"] == "Log In!" AND !isset($_SESSION["loggedIn"]))
    {
        if(!$_POST["username"] OR !$_POST["pw"])
            $errorMsg .= "Please insert your username AND password";
        else
        {
            $pwToCheck = $_POST["pw"];
            
            $stmt = returnUserInfoRow($_POST["username"], $connection001, $retrieveCredsStmt);
            $stmt->bind_result($pw, $id);            
            $stmt->fetch();    
                        
            if($stmt->num_rows() < 1 OR !password_verify($pwToCheck, $pw))
                $errorMsg = "Your typed in a wrong username/password combination"; 
            else
            {
                $username = $_POST["username"];
                $query = "UPDATE `userinfo` SET `auth`='".setIdAndCookie($username)."' WHERE `id`='".$id."'";
                mysqli_query($connection001, $query);
                $score = returnScoresArray($username, $connection001, $retrieveScoreStmt);
            }
            
            $stmt->close();
        }            
    }

    if(!$errorMsg)
        $data = array("loggedIn" => $_SESSION["loggedIn"], "username" => $username, "score" => $score); //more info to be passed............       
    else
        $data = array("errorMsg" => $errorMsg);

    echo json_encode($data); 

//    function test_input($data) {
//      $data = trim($data);
//      $data = stripslashes($data);
//      $data = htmlspecialchars($data);
//      return $data;
//    }
           
?>
