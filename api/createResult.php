<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['tulemuse_nimi']) || empty($data['tulemuse_nimi'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing or empty 'tulemuse_nimi'."]);
    exit;
}

$tulemuse_nimi = $data['tulemuse_nimi'];

$stmt = $conn->prepare("INSERT INTO TULEMUSED (
    tulemuse_nimi, haaletanute_arv, h_alguse_aeg, poolt_haali, vastu_haali, lõppenud
) VALUES (?, 0, NOW(), 0, 0, 'ei')");

$stmt->bind_param("s", $tulemuse_nimi);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "inserted_id" => $conn->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();