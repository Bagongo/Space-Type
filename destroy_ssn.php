<?php

    session_start(); 

    if(isset($_COOKIE["auth_k"]))
        setcookie("auth_k", "", 1);

    session_destroy();

    $score = array("besttime"=>0, "bestacc"=>0, "bestwpm"=>0);
    $data = array("loggedIn" => false, "username" => "", "score" => $score);

    echo json_encode($data);

?>