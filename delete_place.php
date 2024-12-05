<?php
require 'config.php';

header('Content-Type: application/json');

try {
    $pdo = getDatabaseConnection();
    $json = file_get_contents('php://input');
    $data = json_decode($json);

    $place_id = $data->place_id;

    $stmt = $pdo->prepare("DELETE FROM visited_places WHERE place_id = :place_id");
    $stmt->bindParam(':place_id', $place_id);
    $stmt->execute();

    echo json_encode(['status' => 'success']);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'データベース削除に失敗しました: ' . $e->getMessage()]);
}
?>
