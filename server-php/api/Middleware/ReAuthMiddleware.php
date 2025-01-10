<?php

namespace Api\Middleware;

use Api\Models\User;
use Api\Utils\Utils;
use Nyholm\Psr7\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Psr\Http\Server\MiddlewareInterface;

class ReAuthMiddleware implements MiddlewareInterface
{
    public function process(Request $request, RequestHandler $handler): ResponseInterface
    {
        $body = $request->getParsedBody();
        $response = new Response();

        // Credentials
        $uid = $request->getAttribute('userId');
        $email = $body['email'];
        $password = $body['password'];
        $validated = Utils::validateInputs($response, ['email', 'password'], $body);

        if (!$validated) {
            return $response;
        }

        // Find User
        $user = User::getUserByEmail($email);

        // If no user or user id does not match auth token, throw error
        if (!$user || $user['id'] != $uid) {
            return Utils::jsonResponse($response, ['error' => 'Invalid email'], 401);
        }

        // Verify password
        if (password_verify($password, $user['password'])) {
            $request = $request->withAttribute('reAuth', true);
            return $handler->handle($request);
        } else {
            return Utils::jsonResponse($response, ['error' => 'Invalid password'], 401);
        }
    }
}