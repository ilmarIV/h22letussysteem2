<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

$sql = "SELECT * FROM HAALETUS ORDER BY haaletuse_aeg DESC";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $votes = [];
    while ($row = $result->fetch_assoc()) {
        $votes[] = $row;
    }
    echo json_encode($votes);
} else {
    echo json_encode([]);
}

$conn->close();
?>