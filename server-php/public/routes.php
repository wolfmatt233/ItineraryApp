<?php

use ItineraryApi\Controllers\AuthController;
use ItineraryApi\Controllers\UserController;
use ItineraryApi\Controllers\ItineraryController;
use ItineraryApi\Controllers\ActivityController;
use ItineraryApi\Middleware\AuthMiddleware;
use ItineraryApi\Middleware\ParserMiddleware;
use ItineraryApi\Routing\Router;

$router = new Router();

$jsonMware = [ParserMiddleware::class, 'handleParse'];
$authMware = [AuthMiddleware::class, 'verifyToken'];

$router->get('/', function () {
    return ['status' => 200, 'data' => 'API HOME'];
});

$router->group('/api', [$jsonMware], function ($router) use ($authMware) {
    // Unprotected user routes
    $router->post('/auth/register', [UserController::class, 'create']);
    $router->post('/auth/login', [AuthController::class, 'login']);
    $router->post('/auth/refresh-token', [AuthController::class, 'refreshToken']);

    // Protected user routes
    $router->group('/auth', [$authMware], function ($router) {
        $router->get('/users', [UserController::class, 'index']);
        $router->get('/user', [UserController::class, 'account']);
        $router->get('/{id}', [UserController::class, 'view']);

        $router->patch('/{id}', [UserController::class, 'update']);
        $router->delete('/{id}', [UserController::class, 'delete']);
    });

    $router->group('/itineraries', [$authMware], function ($router) {
        $router->get('', [ItineraryController::class, 'index']);
        $router->get('/{id}', [ItineraryController::class, 'view']);
        $router->get('/{id}/activities', [ActivityController::class, 'index']);

        $router->post('', [ItineraryController::class, 'create']);
        $router->patch('/{id}', [ItineraryController::class, 'update']);
        $router->delete('/{id}', [ItineraryController::class, 'delete']);
    });

    $router->group('/activities', [$authMware], function ($router) {
        $router->get('/{id}', [ActivityController::class, 'view']);

        $router->post('/{id}', [ActivityController::class, 'create']);
        $router->patch('/{id}', [ActivityController::class, 'update']);
        $router->delete('/{id}', [ActivityController::class, 'delete']);
    });
});

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$router->dispatch($method, $uri);