<?php
/**
 * ИТЭС-Хоум – обработчик формы обратной связи
 * Отправка через Яндекс SMTP (PHPMailer)
 *
 * Зависимость: PHPMailer – папка phpmailer/ рядом с этим файлом:
 *   phpmailer/PHPMailer.php
 *   phpmailer/SMTP.php
 *   phpmailer/Exception.php
 *
 * Учётные данные SMTP берутся из файла ВНЕ веб-корня:
 *   ../../secrets/mail_credentials.php  (права 600)
 * Если файла нет или пароль пуст – используются значения ниже (прежний ящик).
 */

// ─── Настройки (запасной вариант) ─────────────────────────────────────────────
define('SMTP_USER_FALLBACK',     'noreply@ltd-ites.com');
define('SMTP_PASSWORD_FALLBACK', '');   // пароль живёт только в secrets/mail_credentials.php
define('SMTP_HOST',     'smtp.yandex.ru');
define('SMTP_PORT',     465);
define('MAIL_TO',       'ites-home@ltd-ites.com');
define('MAIL_FROM_FALLBACK', 'noreply@ltd-ites.com');
define('MAIL_FROM_NAME','ИТЭС-Хоум сайт');
define('ALLOWED_ORIGIN','https://home.ltd-ites.com');
define('RATE_LIMIT_MAX', 5);     // максимум заявок с одного IP
define('RATE_LIMIT_WINDOW', 3600); // за 1 час (в секундах)
define('MIN_FILL_TIME_MS', 3000);  // форма должна заполняться ≥ 3 секунды
// ──────────────────────────────────────────────────────────────────────────────

// ─── Учётные данные из файла вне веб-корня ───────────────────────────────────
$secretsPath = __DIR__ . '/../../secrets/mail_credentials.php';
$secrets = @include $secretsPath;
if (is_array($secrets) && !empty($secrets['smtp_password'])) {
    define('SMTP_USER',     $secrets['smtp_user'] ?: SMTP_USER_FALLBACK);
    define('SMTP_PASSWORD', $secrets['smtp_password']);
    define('MAIL_FROM',     $secrets['mail_from'] ?: SMTP_USER);
} else {
    define('SMTP_USER',     SMTP_USER_FALLBACK);
    define('SMTP_PASSWORD', SMTP_PASSWORD_FALLBACK);
    define('MAIL_FROM',     MAIL_FROM_FALLBACK);
}
// ──────────────────────────────────────────────────────────────────────────────

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// Читаем тело запроса
$body = json_decode(file_get_contents('php://input'), true);
if (!$body) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Bad request']);
    exit;
}

// ── Спам-защита: Honeypot ─────────────────────────────────────────────────────
// Поле website скрыто CSS – человек не видит и не заполняет; бот заполняет.
if (!empty($body['website'])) {
    // Притворяемся успехом, чтобы не раскрывать факт обнаружения
    http_response_code(200);
    echo json_encode(['ok' => true]);
    exit;
}

// ── Спам-защита: минимальное время заполнения ─────────────────────────────────
$loadTime = (int)($body['_load_time'] ?? 0);
if ($loadTime > 0) {
    $elapsedMs = (int)(microtime(true) * 1000) - $loadTime;
    if ($elapsedMs < MIN_FILL_TIME_MS) {
        http_response_code(200);
        echo json_encode(['ok' => true]); // тихо игнорируем
        exit;
    }
}

// ── Спам-защита: Rate limit по IP ────────────────────────────────────────────
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitFile = sys_get_temp_dir() . '/ites_form_' . md5($ip) . '.json';
$now = time();

$timestamps = [];
if (file_exists($rateLimitFile)) {
    $stored = json_decode(file_get_contents($rateLimitFile), true);
    if (is_array($stored)) {
        $timestamps = array_values(array_filter($stored, fn($t) => $now - $t < RATE_LIMIT_WINDOW));
    }
}

if (count($timestamps) >= RATE_LIMIT_MAX) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'Слишком много запросов. Попробуйте позже или позвоните нам напрямую.']);
    exit;
}

$timestamps[] = $now;
file_put_contents($rateLimitFile, json_encode($timestamps), LOCK_EX);

// ── Валидация полей ───────────────────────────────────────────────────────────
$name    = trim($body['name']    ?? '');
$phone   = trim($body['phone']   ?? '');
$email   = trim($body['email']   ?? '');
$message = trim($body['message'] ?? '');

if (!$name || !$phone) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Заполните обязательные поля']);
    exit;
}

if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Некорректный email']);
    exit;
}

// Базовая санитизация длин
if (mb_strlen($name) > 200 || mb_strlen($phone) > 50 || mb_strlen($message) > 5000) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Данные слишком длинные']);
    exit;
}

// ── Логирование заявки ────────────────────────────────────────────────────────
$logDir  = __DIR__ . '/logs';
$logFile = $logDir . '/form_submissions.log';

if (!is_dir($logDir)) {
    mkdir($logDir, 0750, true);
}

$consentMeta = $body['_consent_meta'] ?? [];
$userAgent   = substr($body['_ua'] ?? '', 0, 300);

// Оцениваем признаки реального взаимодействия
$isRealInteraction = (
    !empty($consentMeta['checked_at']) &&
    !empty($consentMeta['input_type']) &&
    $consentMeta['input_type'] !== 'unknown' &&
    ($consentMeta['ms_since_load'] ?? 0) > 500
);

$logEntry = [
    'ts'               => date('c'),           // время сервера (ISO 8601)
    'ip'               => $ip,
    'ua'               => $userAgent,
    'name'             => $name,
    'phone'            => $phone,
    'email'            => $email,
    // Данные о чекбоксе
    'consent_checked'  => true,
    'consent_ms_after_load' => $consentMeta['ms_since_load'] ?? null,
    'consent_input_type'    => $consentMeta['input_type']    ?? 'unknown',
    'consent_client_x'      => $consentMeta['client_x']      ?? null,
    'consent_client_y'      => $consentMeta['client_y']      ?? null,
    'consent_unchecked_before' => (int)($consentMeta['unchecked_count'] ?? 0),
    // Оценка: human / suspicious
    'interaction_verdict' => $isRealInteraction ? 'human' : 'suspicious',
];

file_put_contents($logFile, json_encode($logEntry, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);

// ── Отправка письма ───────────────────────────────────────────────────────────
require_once __DIR__ . '/phpmailer/Exception.php';
require_once __DIR__ . '/phpmailer/PHPMailer.php';
require_once __DIR__ . '/phpmailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = SMTP_PORT;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
    $mail->addAddress(MAIL_TO);
    if ($email) {
        $mail->addReplyTo($email, $name);
    }

    $mail->Subject = 'Заявка с сайта ИТЭС-Хоум – ' . $name;
    $mail->isHTML(true);
    $mail->Body = '
<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><title>Заявка с сайта</title></head>
<body style="font-family:Arial,sans-serif;color:#222;max-width:560px;margin:0 auto;padding:24px">
  <h2 style="color:#00b4c8;margin-bottom:4px">Новая заявка с сайта ИТЭС-Хоум</h2>
  <hr style="border:none;border-top:2px solid #00b4c8;margin-bottom:20px">
  <table style="width:100%;border-collapse:collapse">
    <tr><td style="padding:8px 12px;font-weight:bold;width:120px;background:#f4f4f4">Имя</td>
        <td style="padding:8px 12px;background:#fafafa">' . htmlspecialchars($name) . '</td></tr>
    <tr><td style="padding:8px 12px;font-weight:bold;background:#f4f4f4">Телефон</td>
        <td style="padding:8px 12px;background:#fafafa"><a href="tel:' . htmlspecialchars($phone) . '" style="color:#00b4c8">' . htmlspecialchars($phone) . '</a></td></tr>
    <tr><td style="padding:8px 12px;font-weight:bold;background:#f4f4f4">Email</td>
        <td style="padding:8px 12px;background:#fafafa">' . ($email ? '<a href="mailto:' . htmlspecialchars($email) . '" style="color:#00b4c8">' . htmlspecialchars($email) . '</a>' : '–') . '</td></tr>
    <tr><td style="padding:8px 12px;font-weight:bold;background:#f4f4f4;vertical-align:top">Сообщение</td>
        <td style="padding:8px 12px;background:#fafafa">' . nl2br(htmlspecialchars($message ?: '–')) . '</td></tr>
  </table>
  <p style="margin-top:24px;font-size:12px;color:#999">Письмо отправлено автоматически с сайта home.ltd-ites.com</p>
</body>
</html>';

    $mail->AltBody = "Новая заявка с сайта ИТЭС-Хоум\n\n"
        . "Имя: $name\nТелефон: $phone\nEmail: " . ($email ?: '–') . "\nСообщение: " . ($message ?: '–');

    $mail->send();
    echo json_encode(['ok' => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $mail->ErrorInfo]);
}
