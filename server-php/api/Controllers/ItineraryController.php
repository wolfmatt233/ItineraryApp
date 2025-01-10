<?php

namespace Api\Controllers;

use Api\Models\Itinerary;
use Api\Utils\Converter;
use Api\Utils\Utils;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ItineraryController
{
    public function index(Request $request, Response $response, array $args)
    {
        $uid = $request->getAttribute('userId');
        $itineraries = Converter::convertArrayofObjects(Itinerary::getItineraries($uid));

        return Utils::jsonResponse($response, $itineraries);
    }

    public function view(Request $request, Response $response, array $args)
    {
        $id = $args['id'];
        $uid = $request->getAttribute('userId');

        $itinerary = Itinerary::getItineraryById($id, $uid);

        if (!$itinerary) {
            return Utils::errorResponse($response, 'Itinerary not found', 404);
        }

        return Utils::jsonResponse($response, Converter::convertObject($itinerary));
    }

    public function create(Request $request, Response $response, array $args)
    {
        $body = Converter::convertKeysToSnakeCase($request->getParsedBody());
        $uid = $request->getAttribute('userId');

        $requiredFields = ['title', 'start_date', 'end_date'];
        $validated = Utils::validateInputs($response, $requiredFields, $body);

        if (!$validated) {
            return $response;
        }

        $itinerary = Itinerary::createItinerary($uid, $body);

        return Utils::jsonResponse($response, Converter::convertObject($itinerary));
    }

    public function update(Request $request, Response $response, array $args)
    {
        $body = Converter::convertKeysToSnakeCase($request->getParsedBody());
        $id = $args['id'];
        $uid = $request->getAttribute('userId');

        $itinerary = Itinerary::updateItinerary($id, $uid, $body);

        if (!$itinerary) {
            return Utils::errorResponse($response, 'Itinerary not found', 404);
        }

        return Utils::jsonResponse($response, data: Converter::convertObject($itinerary));
    }

    public function delete(Request $request, Response $response, array $args)
    {
        $id = $args['id'];
        $uid = $request->getAttribute('userId');
        $result = Itinerary::deleteItinerary($id, $uid);

        if (!$result) {
            return Utils::errorResponse($response, 'Itinerary not found', 404);
        }

        return Utils::jsonResponse($response, ['message' => 'Itinerary successfully deleted']);
    }
}