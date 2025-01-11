<?php

namespace Api\Controllers;

use Api\Models\Activity;
use Api\Models\Itinerary;
use Api\Utils\Converter;
use Api\Utils\Utils;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ActivityController
{
    public $requiredFields = ['date', 'activity', 'location_name', 'location_lat', 'location_lon'];

    public function index(Request $request, Response $response, array $args)
    {
        $uid = $request->getAttribute('userId');
        $activities = Activity::getActivitiesByItinerary($args['id'], $uid);

        return Utils::jsonResponse(
            $response,
            Converter::convertArrayofObjects($activities)
        );
    }

    public function view(Request $request, Response $response, array $args)
    {
        $uid = $request->getAttribute('userId');
        $activity = Activity::getActivityById($args['actId'], $args['id'], $uid);

        return Utils::jsonResponse($response, Converter::convertObject($activity));
    }

    public function create(Request $request, Response $response, array $args)
    {
        $body = Converter::convertKeysToSnakeCase($request->getParsedBody());
        $itineraryId = $args['id'];
        $uid = $request->getAttribute('userId');

        // Check if itinerary belongs to the user
        $itinerary = Itinerary::getItineraryById($itineraryId, $uid);

        if (!$itinerary) {
            return Utils::errorResponse($response, 'Itinerary not found', 404);
        }

        // Validate inputs
        $validated = Utils::validateInputs($response, $this->requiredFields, $body);

        if ($validated !== true) {
            return $validated;
        }

        // Create activity
        $activity = Activity::createActivity($itineraryId, $body);
        return Utils::jsonResponse($response, Converter::convertObject($activity));
    }

    public function update(Request $request, Response $response, array $args)
    {
        $body = Converter::convertKeysToSnakeCase($request->getParsedBody());
        $itineraryId = $args['id'];
        $uid = $request->getAttribute('userId');

        // Validate inputs
        $validated = Utils::validateInputs($response, $this->requiredFields, $body);

        if ($validated !== true) {
            return $validated;
        }

        // Update activity
        $activity = Activity::updateActivity($args['actId'], $itineraryId, $uid, $body);

        if (!$activity) {
            return Utils::errorResponse($response, 'Itinerary not found', 404);
        }

        return Utils::jsonResponse($response, Converter::convertObject($activity));
    }

    public function delete(Request $request, Response $response, array $args)
    {
        $uid = $request->getAttribute('userId');
        $result = Activity::deleteActivity($args['actId'], $args['id'], $uid);

        if (!$result) {
            return Utils::errorResponse($response, 'Activity not found', 404);
        }

        return Utils::jsonResponse($response, ['message' => 'Activity successfully deleted']);
    }
}