<?php
//訪問済みのラーメン屋をデータベースに保存するスクリプト
require 'config.php';

header('Content-Type: application/json');

try {
    $pdo = getDatabaseConnection();
    $json = file_get_contents('php://input');
    $data = json_decode($json);

    $place_id = $data->place_id;
    $name = $data->name;

    $stmt = $pdo->prepare("INSERT INTO visited_places (place_id, name) VALUES (:place_id, :name) ON DUPLICATE KEY UPDATE name = :name");
    $stmt->bindParam(':place_id', $place_id);
    $stmt->bindParam(':name', $name);
    $stmt->execute();

    echo json_encode(['status' => 'success']);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'データベース書き込みに失敗しました: ' . $e->getMessage()]);
}
?>
