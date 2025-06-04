<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['ees_perenimi']) || !isset($data['otsus'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing fields"]);
    exit;
}

$name = $data['ees_perenimi'];
$otsus = $data['otsus'];

$stmt = $conn->prepare("UPDATE HAALETUS SET haaletuse_aeg = NOW(), otsus = ? WHERE LOWER(ees_perenimi) = LOWER(?)");
$stmt->bind_param("ss", $otsus, $name);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>