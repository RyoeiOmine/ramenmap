<?php
// データベース接続情報を一元管理
define('DB_HOST', 'localhost');
define('DB_NAME', 'ramen_map');
define('DB_USER', 'root');
define('DB_PASSWORD', '');

function getDatabaseConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASSWORD
        );
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        die('データベース接続に失敗しました: ' . $e->getMessage());
    }
}
?>
