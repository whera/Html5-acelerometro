<?php

declare(strict_types=1);

use App\Chat;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

require_once '../vendor/autoload.php';

$port = 6080;
$wsServer = new WsServer(new Chat);
$httpServer = new HttpServer($wsServer);
$server = IoServer::factory($httpServer, $port);

echo "WebSocket server is running and listen on port ". $port . PHP_EOL;

$server->run();
