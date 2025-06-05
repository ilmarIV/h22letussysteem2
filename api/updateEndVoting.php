<?php
require_once "db.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$sql = "UPDATE TULEMUSED SET lõppenud = 'jah' WHERE lõppenud = 'ei'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Update failed: " . $conn->error]);
}

$conn->close();
?>