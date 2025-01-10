<?php

namespace Api\Controllers;

use Api\Models\Token;
use Api\Models\User;
use Api\Utils\Utils;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AuthController
{
    public function login(Request $request, Response $response)
    {
        $body = $request->getParsedBody();
        $formEmail = $body['email'];
        $formPassword = $body['password'];

        $requiredFields = ['email', 'password'];
        $validated = Utils::validateInputs($response, $requiredFields, $body);

        if (!$validated) {
            return;
        }

        // Find user
        $user = User::getUserByEmail($formEmail);

        if (!$user) {
            return Utils::errorResponse($response, 'Invalid email', 401);
        }

        // Compare passwords
        if (password_verify($formPassword, $user['password'])) {
            $refreshPayload = [
                'issued_at' => time(),
                'expires_at' => time() + (7 * 24 * 60 * 60),
                'user' => $user['id'],
            ];

            $accessPayload = [
                'issued_at' => time(),
                'expires_at' => time() + 3600,
                'user' => $user['id'],
            ];

            $refreshToken = JWT::encode($refreshPayload, $_ENV['JWT_SECRET'], 'HS256');
            $accessToken = JWT::encode($accessPayload, $_ENV['JWT_SECRET'], 'HS256');

            Token::updateToken($user['id'], $refreshToken);
        } else {
            return Utils::errorResponse($response, 'Invalid password', 401);
        }

        return Utils::jsonResponse($response, [
            'message' => 'Login successful',
            'refreshToken' => $refreshToken,
            'accessToken' => $accessToken
        ]);
    }

    public function refreshToken(Request $request, Response $response)
    {
        $authHeader = $request->getHeader('Authorization');

        if (empty($authHeader)) {
            return Utils::errorResponse($response, 'Authorization header missing', 401);
        }

        // Decrypt refresh token
        $refreshToken = str_replace('Bearer ', '', $authHeader[0]);

        if (!$refreshToken) {
            return Utils::errorResponse($response, 'Authorization header invalid', 403);
        }

        try {
            $decodedJwt = JWT::decode($refreshToken, new Key($_ENV['JWT_SECRET'], 'HS256'));
        } catch (\Exception $e) {
            return Utils::errorResponse($response, 'Invalid token', 403);
        }

        $uid = $decodedJwt->user;

        // Expired token
        if ($decodedJwt->expires_at < time()) {
            return Utils::errorResponse($response, 'Access token expired', 401);
        }

        // Verify token by matching from db
        $storedToken = Token::getTokenByUid($uid);
        $tokenMatch = password_verify($refreshToken, $storedToken['refresh_token']);

        if ($tokenMatch || $storedToken) {
            // Keep original expiration but generate a new token
            $refreshPayload = [
                'issued_at' => time(),
                'expires_at' => $decodedJwt->expires_at,
                'user' => $uid,
            ];

            // New access token
            $accessPayload = [
                'issued_at' => time(),
                'expires_at' => time() + 3600,
                'user' => $uid,
            ];

            $newRefreshToken = JWT::encode($refreshPayload, $_ENV['JWT_SECRET'], 'HS256');
            $newAccessToken = JWT::encode($accessPayload, $_ENV['JWT_SECRET'], 'HS256');

            Token::updateToken($uid, $newRefreshToken);

            return Utils::jsonResponse($response, [
                'message' => 'Token refreshed',
                'refreshToken' => $newRefreshToken,
                'accessToken' => $newAccessToken
            ]);
        } else {
            $message = ['error' => 'Invalid refresh token'];
            return Utils::errorResponse($response, 'Invalid refresh token', 401);
        }
    }
}