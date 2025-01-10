<?php

use Slim\Factory\AppFactory;
use Dotenv\Dotenv;

require __DIR__ . '/../vendor/autoload.php';

// load env
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// create slim router
$app = AppFactory::create();
$app->addRoutingMiddleware();
$errorMiddleware = $app->addErrorMiddleware(true, true, true);

// load database
require __DIR__ . '/../public/database.php';

// load routes
require __DIR__ . '/../public/routes.php';

$app->run();