<?php
    
    session_start();
    include("connection.php");

    $bestPlayers = array();

    if(!empty($_POST))
    {
        $updateHiscoreStmt = "UPDATE `userscore` SET `besttime`='".$_POST["besttime"]."', `bestacc`='".$_POST["bestacc"]."', `bestwpm`='".$_POST["bestwpm"]."' WHERE `username`=? LIMIT 1";        
        $stmt = $connection001->prepare($updateHiscoreStmt);
        $stmt->bind_param("s", $_SESSION["username"]);
        $stmt->execute();
    }
    else
    {
        $query = "SELECT `username`, `besttime` from `userscore` WHERE `besttime` != 0 ORDER BY `besttime` ASC LIMIT 3";
        $result = mysqli_query($connection001, $query);
        
        while ($row = mysqli_fetch_assoc($result))
            array_push($bestPlayers, array($row["username"], $row["besttime"]));           
    }

    echo json_encode($bestPlayers);
    
?>    