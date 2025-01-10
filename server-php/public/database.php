<?php

use Illuminate\Database\Capsule\Manager;

$capsule = new Manager();

$capsule->addConnection([
    'driver' => $_ENV['DB_DRIVER'],
    'host' => $_ENV['DB_HOST'],
    'database' => $_ENV['DB_DATABASE'],
    'username' => $_ENV['DB_USERNAME'],
    'password' => $_ENV['DB_PASSWORD']
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();