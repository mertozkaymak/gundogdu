<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    $conInfo = array(
        "HOST" => "localhost",
        "DBNAME" => "db030225",
        "USER" => "user030225",
        "PASS" => "LiRfg65M8C!4Cq3"
    );
    $dbh = new PDO("mysql:host=" . $conInfo["HOST"] . "; dbname=" . $conInfo["DBNAME"] . "; charset=utf8;", $conInfo["USER"], $conInfo["PASS"]);
    $stmt = $dbh->prepare("SELECT * FROM product_images");
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "<pre>";
    print_r($result);
    echo "</pre>";
?>