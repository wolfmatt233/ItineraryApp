<?php

namespace ItineraryApi\Middleware;

use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware
{
    public $secret;

    public function __construct()
    {
        $this->secret = $_ENV['JWT_SECRET'];
    }

    public function verifyToken()
    {
        // check for bearer token, get token, 
        if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
            throw new Exception('Authorization header missing', 403);
        }

        try {
            $jwt = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);

            // Decode the token
            $decoded = JWT::decode($jwt, new Key($this->secret, 'HS256'));

            // Check expiration
            if ($decoded->expires_at < time()) {
                throw new Exception('Token expired', 403);
            }

            return $decoded->user;
        } catch (Exception $e) {
            throw new Exception('Invalid token', 403);
        }
    }
}