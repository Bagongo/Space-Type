<?php

    $user = 'root';
    $password = 'root';
    $db = 'spacetype';
    $host = 'localhost';
    $port = 8889;

    $connection001 = new mysqli($host, $user, $password, $db, $port);

    if($connection001->connect_errno)
        trigger_error($mysql->connect_error,E_USER_ERROR); 
        
?>