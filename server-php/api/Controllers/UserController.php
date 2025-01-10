<?php

namespace Api\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Api\Models\Token;
use Api\Models\User;
use Api\Utils\Utils;

class UserController
{
    public function view(Request $request, Response $response, array $args)
    {
        // Only view user from JWT user id
        $uid = $request->getAttribute('userId');
        $user = User::getUserByUid($uid);

        if (!$user) {
            return Utils::errorResponse($response, 'User not found', 404);
        }

        return Utils::jsonResponse($response, $user);
    }

    public function create(Request $request, Response $response, array $args)
    {
        $body = $request->getParsedBody();
        $requiredFields = ['username', 'email', 'password'];

        $validated = Utils::validateInputs($response, $requiredFields, $body);

        if (!$validated) {
            return $response;
        }

        $emailValid = User::getUserByEmail($body['email']);

        if ($emailValid !== null) {
            return Utils::errorResponse($response, 'Email already in use', 401);
        }

        // Generate new user
        $userId = User::createUser($body);
        if (!is_int($userId)) {
            return Utils::errorResponse($response, '', 500);
        }

        // Generate token entry for user
        $tokenId = Token::createToken($userId);
        if (!is_int($tokenId)) {
            return Utils::errorResponse($response, '', 500);
        }

        return Utils::jsonResponse($response, 'Account successfully created');
    }

    public function update(Request $request, Response $response, array $args)
    {
        $body = $request->getParsedBody();
        $uid = $request->getAttribute('userId');
        $validated = Utils::validateInputs($response, ['newPassword'], $body);

        if (!$validated) {
            return $response;
        }

        User::updatePassword($uid, newPassword: $body['newPassword']);

        return Utils::jsonResponse($response, ['message' => 'Password updated']);
    }

    public function delete(Request $request, Response $response, array $args)
    {
        $uid = $request->getAttribute('userId');
        User::deleteUser($uid);

        return Utils::jsonResponse($response, ['message' => 'Account successfully deleted']);
    }
}