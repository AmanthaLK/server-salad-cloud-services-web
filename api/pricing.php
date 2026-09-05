<?php
/**
 * Live pricing API for the cPanel Hosting page's plan table.
 *
 * This is the ONLY server-side code in the project — everything else is static
 * HTML/CSS/JS. Exists only because a browser cannot query MySQL directly, and DB
 * credentials must never reach client-side code (see README "Stack" and
 * "Pricing API" for the full reasoning).
 *
 * Read-only. Returns ONLY the 3 plan prices as JSON — nothing else from the
 * `cpanel_package_pricing` table (e.g. `discount`, `edu_support_discount`) is
 * exposed here; their display logic hasn't been confirmed yet (see README
 * "Open items" — don't add them to the SELECT/response until that's settled).
 *
 * Credentials live here, in a .php file, deliberately — Apache executes .php
 * files rather than serving their source, so this is not downloadable as plain
 * text the way a .env/.json config file placed under htdocs would be. Never move
 * these into any file the browser can fetch directly.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store'); // pricing must always be fetched fresh, per "real time" requirement
header('Access-Control-Allow-Origin: https://serversalad.com'); // adjust if the real production domain differs

// This site currently runs locally via XAMPP (not yet deployed to the real
// serversalad.com hosting), so the fallback must point at the DB's real remote
// host — 'serversalad.com' — for local testing to actually reach it (owner
// enabled Remote MySQL access for this dev machine's IP). IMPORTANT: once this
// project is deployed onto serversalad.com itself, MySQL becomes local to that
// same server (per the phpMyAdmin screenshot showing "Server: localhost:3306",
// taken from inside production) — at that point this hardcoded fallback should
// change to 'localhost', or better, set SS_DB_HOST=localhost as a real
// environment variable on that server so this line never needs editing again.
$host    = getenv('SS_DB_HOST') ?: 'serversalad.com';
$user    = getenv('SS_DB_USER') ?: 'serversa_serversa_website_data_user';
$pass    = getenv('SS_DB_PASS') ?: 'xnc7"Z856\oB';
$db      = getenv('SS_DB_NAME') ?: 'serversa_website_data';
$charset = 'utf8mb4';

try {
    $dsn = "mysql:host={$host};dbname={$db};charset={$charset}";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    $stmt = $pdo->query(
        'SELECT package_name, price_in_lkr_month FROM cpanel_package_pricing'
    );

    $byName = [];
    foreach ($stmt as $row) {
        $byName[$row['package_name']] = (float) $row['price_in_lkr_month'];
    }

    echo json_encode([
        'ok' => true,
        'prices' => [
            'starter_salad'  => $byName['starter_salad']  ?? null,
            'standard_salad' => $byName['standard_salad'] ?? null,
            'premium_salad'  => $byName['premium_salad']  ?? null,
        ],
    ]);
} catch (Throwable $e) {
    // Never echo $e->getMessage() here — a PDO exception can include the DSN,
    // hostname, or other schema details that shouldn't reach the client.
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'pricing_unavailable']);
}
