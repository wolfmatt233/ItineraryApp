<?php

namespace ItineraryApi\Routing;

class Router
{
    protected $routes = [];
    private $middleware = [];
    private $groupPrefix = '';

    public function addRoute($method, $path, $callback)
    {
        $path = $this->groupPrefix . $path;

        $this->routes[] = [
            'method' => strtoupper($method),
            'path' => $path,
            'callback' => $callback,
            'middleware' => $this->middleware
        ];
    }

    public function get($path, $callback)
    {
        $this->addRoute('GET', $path, $callback);
    }

    public function post($path, $callback)
    {
        $this->addRoute('POST', $path, $callback);
    }

    public function patch($path, $callback)
    {
        $this->addRoute('PATCH', $path, $callback);
    }

    public function delete($path, $callback)
    {
        $this->addRoute('DELETE', $path, $callback);
    }

    public function group($prefix, $middleware, $callback)
    {
        $previousPrefix = $this->groupPrefix;
        $previousMiddleware = $this->middleware;

        // Set new group prefix and middleware
        $this->groupPrefix = $previousPrefix . $prefix;
        $this->middleware = array_merge($previousMiddleware, $middleware);

        // Execute the callback, which registers routes within this group
        call_user_func($callback, $this);

        // Reset to previous group prefix and middleware after the callback runs
        $this->groupPrefix = $previousPrefix;
        $this->middleware = $previousMiddleware;
    }

    public function dispatch($method, $uri)
    {
        try {
            foreach ($this->routes as $route) {
                // find route that matches current uri
                if ($route['method'] === strtoupper($method)) {
                    // Use a regular expression to match routes with parameters (e.g., {id})
                    $routePattern = preg_replace('/{[^}]+}/', '([^/]+)', $route['path']);
                    $routePattern = '@^' . $routePattern . '$@'; // Ensure it matches the entire URI

                    if (preg_match($routePattern, $uri, $matches)) {
                        array_shift($matches); // remove uri from matches array
                        [$controller, $method] = $route['callback'];

                        // Run middleware, then route method
                        $userId = null;
                        foreach ($route['middleware'] as $middleware) {
                            $middlewareInstance = new $middleware[0]();
                            $result = $middlewareInstance->{$middleware[1]}();

                            if (is_numeric($result)) {
                                $matches = [...$matches, $result];
                            }

                            if ($result === false) {
                                http_response_code(403);
                                return $this->response(['status' => 403, 'message' => 'Forbidden']);
                            }
                        }

                        // Run route method when middleware passes
                        $callback = is_array($route['callback']) ? [new $controller(), $method] : $route['callback'];

                        $response = call_user_func_array($callback, $matches);

                        return $this->response($response);
                    }
                }
            }

            throw new \Exception('Route not found', 404);
        } catch (\Exception $e) {
            $exceptionHandler = new ExceptionHandler();
            $errorResponse = $exceptionHandler->handleException($e);
            return $this->response($errorResponse);
        }
    }

    public function response($data)
    {
        // Set HTTP status code
        http_response_code($data['status']);
        $content = $data['data'];

        // Ensure JSON response
        if (is_array($data) || is_object($data)) {
            header('Content-Type: application/json'); // Ensure content type is JSON
            echo json_encode($content);
        } else {
            echo $data;
        }
    }
}