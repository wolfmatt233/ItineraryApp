<?php

namespace Api\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class LoggingMiddleware implements MiddlewareInterface
{
    public function process(Request $request, RequestHandlerInterface $handler): Response
    {
        $start = microtime(true);

        // Process the next middleware or route
        $response = $handler->handle($request);

        $end = microtime(true);
        $duration = $end - $start;

        // Log the duration
        error_log(sprintf(
            '[%s] %s %s - %0.3f ms',
            date('Y-m-d H:i:s'),
            $request->getMethod(),
            $request->getUri()->getPath(),
            $duration * 1000 // Convert seconds to milliseconds
        ));

        return $response;
    }
}