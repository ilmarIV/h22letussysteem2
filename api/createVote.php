<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
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

$stmt = $conn->prepare("INSERT INTO HAALETUS (ees_perenimi, haaletuse_aeg, otsus) VALUES (?, NOW(), ?)");
$stmt->bind_param("ss", $name, $otsus);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "inserted_id" => $conn->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>