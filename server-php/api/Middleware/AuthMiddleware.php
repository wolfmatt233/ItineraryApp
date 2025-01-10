<?php

namespace Api\Middleware;

use Api\Utils\Utils;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Nyholm\Psr7\Response;
use Psr\Http\Server\MiddlewareInterface;

class AuthMiddleware implements MiddlewareInterface
{
    public function process(Request $request, RequestHandler $handler): ResponseInterface
    {
        $authHeader = $request->getHeader('Authorization');
        $response = new Response();

        // Missing auth header
        if (empty($authHeader)) {
            return Utils::errorResponse($response, 'Authorization header missing', 403);
        }

        $jwt = str_replace('Bearer ', '', $authHeader[0]);

        if (!$jwt) {
            return Utils::errorResponse($response, 'Authorization header invalid', 403);
        }

        try {
            $decodedJwt = JWT::decode($jwt, new Key($_ENV['JWT_SECRET'], 'HS256'));
        } catch (\Exception $e) {
            return Utils::errorResponse($response, 'Invalid token', 403);
        }

        // Expired access token
        if ($decodedJwt->expires_at < time()) {
            return Utils::errorResponse($response, 'Access token expired', 403);
        }

        // Add userId to request
        $request = $request->withAttribute('userId', $decodedJwt->user);

        return $handler->handle($request);
    }
}