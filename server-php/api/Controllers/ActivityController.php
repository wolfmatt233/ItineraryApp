<?php

namespace ItineraryApi\Controllers;

use ItineraryApi\Models\Activity;
use ItineraryApi\Utils\IdentifierFormatter;
use ItineraryApi\Utils\InputValidator;

class ActivityController
{
    public $requiredFields = ['date', 'activity', 'notes', 'location_name', 'location_lat', 'location_lon'];

    public function index($id, $userId)
    {
        $res = Activity::getActivities($id, $userId);
        $res = $res->toArray();

        $resCamelCase = array_map(function ($item) {
            return IdentifierFormatter::convertArrayKeysToCamelCase($item);
        }, $res);

        return ['status' => 200, 'data' => $resCamelCase];
    }

    public function view($id)
    {
        $res = Activity::getActivity($id);
        $attributes = $res->getAttributes();

        $resCamelCase = IdentifierFormatter::convertArrayKeysToCamelCase($attributes);
        return ['status' => 200, 'data' => $resCamelCase];
    }

    public function create($id, $userId)
    {
        InputValidator::emptyInputs($this->requiredFields);
        $res = Activity::createActivity($id, $userId);
        $attributes = $res->getAttributes();

        $resCamelCase = IdentifierFormatter::convertArrayKeysToCamelCase($attributes);
        return ['status' => 200, 'data' => $resCamelCase];
    }

    public function update($id, $userId)
    {
        InputValidator::emptyInputs($this->requiredFields);

        $res = Activity::updateActivity($id, $userId);
        $attributes = $res->getAttributes();

        $resCamelCase = IdentifierFormatter::convertArrayKeysToCamelCase($attributes);
        return ['status' => 200, 'data' => $resCamelCase];
    }

    public function delete($id, $userId)
    {
        Activity::deleteActivity($id, $userId);
        return ['status' => 200, 'data' => ['message' => 'Activity successfully deleted']];
    }
}
