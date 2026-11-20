<?php
/*
  Sends Kate a Telegram message when someone opens the portfolio.
  The bot token lives in notify-config.php (same folder, never in git):

    <?php return ['token' => '123456:ABC...', 'chat' => '123456789'];

  Limits: one message of each kind per visitor per 20 s, at most 40 messages an hour in total.
  Nothing about the visitor is saved (the IP is only hashed for the 20 s limit).
*/

header('Content-Type: text/plain; charset=utf-8');
header('X-Robots-Tag: noindex');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }

$cfgFile = __DIR__ . '/notify-config.php';
if (!is_file($cfgFile)) { http_response_code(204); exit; }
$cfg = include $cfgFile;
if (empty($cfg['token']) || empty($cfg['chat'])) { http_response_code(204); exit; }

// robots and link previews
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
if ($ua === '' || preg_match('/bot|crawl|spider|preview|facebookexternalhit|kakaotalk-scrap|headless|curl|wget|python/i', $ua)) {
  http_response_code(204); exit;
}

$in = json_decode(file_get_contents('php://input', false, null, 0, 2048), true);
if (!is_array($in)) { http_response_code(400); exit; }

// ---- rate limits (small files in the system temp folder) ----
$dir = sys_get_temp_dir() . '/kate-notify';
@mkdir($dir, 0700, true);
$now = time();

// per visitor *and* per kind of message, so a visit, a project and a like don't block each other
$kind = (is_string($in['type'] ?? null) ? $in['type'] : '') . '|' . (is_string($in['title'] ?? null) ? $in['title'] : '');
$who = $dir . '/v_' . substr(hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . $ua . $kind . date('Ymd')), 0, 20);
if (is_file($who) && $now - filemtime($who) < 20) { http_response_code(429); exit; }
@touch($who);

$hour = $dir . '/hour_' . date('YmdH');
$count = (int) @file_get_contents($hour);
if ($count >= 40) { http_response_code(429); exit; }
@file_put_contents($hour, $count + 1);

// tidy old files now and then
if (mt_rand(1, 50) === 1) {
  foreach (glob($dir . '/*') ?: [] as $f) if ($now - filemtime($f) > 86400) @unlink($f);
}

// ---- message ----
$clean = function ($v, $max = 60) {
  $v = is_string($v) ? $v : '';
  $v = preg_replace('/[^\p{L}\p{N} \-_.:\/·()]/u', '', $v);
  return mb_substr(trim($v), 0, $max);
};
$type   = is_string($in['type'] ?? null) ? $in['type'] : 'visit';
$r      = $clean($in['r'] ?? '', 30);
$device = ['phone' => '📱 телефон', 'tablet' => '📱 планшет', 'desktop' => '💻 компьютер'][$in['device'] ?? ''] ?? '';
$tz     = $clean($in['tz'] ?? '', 40);
$lang   = $clean($in['lang'] ?? '', 12);
$time   = (new DateTime('now', new DateTimeZone('Asia/Seoul')))->format('m.d H:i');

if ($type === 'like') {
  $text = '❤️ Портфолио лайкнули!' . ($r !== '' ? "\nСсылка: $r" : '') . "\n$device · $time (KST)";
  $silent = false;
} elseif ($type === 'project') {
  $text = '📂 Открыли проект: ' . $clean($in['title'] ?? '') . ($r !== '' ? "  · ссылка $r" : '');
  $silent = true;
} else {
  $lines = ['👀 Портфолио открыли'];
  $lines[] = $r !== '' ? "Ссылка: $r" : 'Ссылка: без метки';
  $lines[] = trim("$device · $tz · $lang", ' ·');
  $lines[] = "$time (KST)";
  $text = implode("\n", $lines);
  $silent = false;
}

$ch = curl_init('https://api.telegram.org/bot' . $cfg['token'] . '/sendMessage');
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => http_build_query([
    'chat_id' => $cfg['chat'],
    'text' => $text,
    'disable_notification' => $silent ? 'true' : 'false',
  ]),
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT => 5,
]);
curl_exec($ch);
curl_close($ch);
http_response_code(204);
