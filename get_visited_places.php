<?php
//訪問済みのラーメン屋リストをデータベースから取得して返すスクリプト
require 'config.php';

header('Content-Type: application/json');

try {
    $pdo = getDatabaseConnection();
    $stmt = $pdo->query("SELECT place_id, name FROM visited_places");
    $places = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($places);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'データベース読み込みに失敗しました: ' . $e->getMessage()]);
}
?>
