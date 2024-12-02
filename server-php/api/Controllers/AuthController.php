<?php

namespace ItineraryApi\Controllers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use ItineraryApi\Models\Token;
use ItineraryApi\Models\User;

class AuthController
{
    public $secret;

    public function __construct()
    {
        $this->secret = $_ENV['JWT_SECRET'];
    }

    public function login()
    {
        $user = User::getUserByEmail($_REQUEST['email']);

        if (password_verify($_REQUEST['password'], $user['password'])) {
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

            $refreshToken = JWT::encode($refreshPayload, $this->secret, 'HS256');
            $accessToken = JWT::encode($accessPayload, $this->secret, 'HS256');

            Token::updateToken($user['id'], $refreshToken);

            return [
                'status' => 200,
                'data' => [
                    'refreshToken' => $refreshToken,
                    'accessToken' => $accessToken,
                ]
            ];
        }
    }

    public function refreshToken()
    {
        $refreshToken = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);

        // decrypt token
        $decodedRefresh = JWT::decode($refreshToken, new Key($this->secret, 'HS256'));
        $userId = $decodedRefresh->user;
        $expiresAt = $decodedRefresh->expires_at;

        if ($expiresAt < time()) {
            return ['status' => 403, 'message' => 'Refresh token expired'];
        }

        $storedToken = Token::getToken($userId);
        $tokenMatch = Token::verifyToken($refreshToken, $storedToken['refresh_token']);

        if ($storedToken && $tokenMatch) {
            // Keep original expiration but generate a new token
            $refreshPayload = [
                'issued_at' => time(),
                'expires_at' => $expiresAt,
                'user' => $userId,
            ];

            // New access token
            $accessPayload = [
                'issued_at' => time(),
                'expires_at' => time() + 3600,
                'user' => $userId,
            ];

            $newRefreshToken = JWT::encode($refreshPayload, $this->secret, 'HS256');
            $newAccessToken = JWT::encode($accessPayload, $this->secret, 'HS256');

            Token::updateToken($userId, $newRefreshToken);

            return [
                'status' => 200,
                'data' => [
                    'refreshToken' => $newRefreshToken,
                    'accessToken' => $newAccessToken
                ]
            ];
        } else {
            throw new \Exception('Invalid or expired token', 403);
        }
    }
}