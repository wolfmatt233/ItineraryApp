<?php

use Api\Controllers\ActivityController;
use Api\Controllers\AuthController;
use Api\Controllers\ItineraryController;
use Api\Controllers\UserController;
use Api\Middleware\AuthMiddleware;
use Api\Middleware\ReAuthMiddleware;
use Slim\Routing\RouteCollectorProxy as Group;
use Slim\Middleware\BodyParsingMiddleware as ParserMiddleware;

$app->group('/api', function (Group $group) {
    // Unprotected auth Routes
    $group->group('/auth', function (Group $group) {
        $group->post('/register', [UserController::class, 'create']);
        $group->post('/login', [AuthController::class, 'login']);
        $group->post('/refresh-token', [AuthController::class, 'refreshToken']);
    });

    // Protected auth Routes
    $group->group('/auth', function (Group $group) {
        $group->get('', [UserController::class, 'view']);

        // Rauthorize with email and password
        $group->group('', function (Group $group) {
            $group->patch('/update-password', [UserController::class, 'update']);
            $group->delete('', [UserController::class, 'delete']);
        })->add(new ReAuthMiddleware());

    })->add(new AuthMiddleware());

    // Itineraries
    $group->group('/itineraries', function (Group $group) {
        $group->get('', [ItineraryController::class, 'index']);
        $group->get('/{id}', [ItineraryController::class, 'view']);
        $group->post('', [ItineraryController::class, 'create']);
        $group->patch('/{id}', [ItineraryController::class, 'update']);
        $group->delete('/{id}', [ItineraryController::class, 'delete']);

        // Activities by itinerary id
        $group->group('/{id}/activities', function (Group $group) {
            $group->get('', [ActivityController::class, 'index']);
            $group->get('/{actId}', [ActivityController::class, 'view']);
            $group->post('', [ActivityController::class, 'create']);
            $group->patch('/{actId}', [ActivityController::class, 'update']);
            $group->delete('/{actId}', [ActivityController::class, 'delete']);
        });
    })->add(new AuthMiddleware());
})->add(new ParserMiddleware());