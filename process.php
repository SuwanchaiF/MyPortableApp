<?php
ob_start();
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

define('DATA_FILE', __DIR__ . '/database.json');
define('BACKUP_DIR', __DIR__ . '/backups');

function loadData() {
    if (!file_exists(DATA_FILE)) return [];
    $content = file_get_contents(DATA_FILE);
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

function createAutoBackup() {
    if (!file_exists(DATA_FILE)) return;
    if (!file_exists(BACKUP_DIR)) @mkdir(BACKUP_DIR, 0755, true);
    $backup_filename = BACKUP_DIR . '/backup_' . date('Y-m-d_H-i-s') . '.json';
    @copy(DATA_FILE, $backup_filename);
    $backups = glob(BACKUP_DIR . '/backup_*.json');
    if ($backups && count($backups) > 10) {
        usort($backups, function($a, $b) { return filemtime($a) - filemtime($b); });
        @unlink($backups[0]);
    }
}

function saveData($data) {
    createAutoBackup();
    $json = json_encode($data, JSON_UNESCAPED_UNICODE);
    $res = @file_put_contents(DATA_FILE, $json, LOCK_EX);
    if ($res === false) {
        file_put_contents(DATA_FILE, $json);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'fetch') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(loadData(), JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    if ($action === 'add') {
        $raw_text = trim($_POST['text_input'] ?? '');
        $text = htmlspecialchars($raw_text, ENT_QUOTES, 'UTF-8');
        if (!empty($text) && mb_strlen($text, 'UTF-8') <= 1500) {
            $data = loadData();
            $data[] = [
                'id' => bin2hex(random_bytes(8)),
                'text' => $text,
                'timestamp' => date('Y-m-d H:i:s')
            ];
            saveData($data);
        }
    }
    if ($action === 'delete') {
        $id_to_delete = $_POST['id'] ?? '';
        if (ctype_xdigit($id_to_delete)) {
            $data = loadData();
            $filtered_data = array_filter($data, function($item) use ($id_to_delete) {
                return $item['id'] !== $id_to_delete;
            });
            saveData(array_values($filtered_data));
        }
    }

    if (isset($_GET['ajax']) || (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => true, 'data' => loadData()], JSON_UNESCAPED_UNICODE);
        exit;
    }

    header('Location: index.php');
    exit;
}

