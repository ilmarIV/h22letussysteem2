<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'db.php';

$sql = "SELECT * FROM LOGI";
$result = $conn->query($sql);

$logs = [];

while($row = $result->fetch_assoc()) {
    $logs[] = $row;
}

echo json_encode($logs);
?>