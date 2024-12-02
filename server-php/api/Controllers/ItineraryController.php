<?php

namespace ItineraryApi\Controllers;

use ItineraryApi\Models\Itinerary;
use ItineraryApi\Utils\IdentifierFormatter;
use ItineraryApi\Utils\InputValidator;

class ItineraryController
{
    public $requiredFields = ['title', 'start_date', 'end_date'];

    public function index($userId)
    {
        $res = Itinerary::getItineraries($userId);
        $res = $res->toArray();

        $resCamelCase = array_map(function ($item) {
            return IdentifierFormatter::convertArrayKeysToCamelCase($item);
        }, $res);

        return ['status' => 200, 'data' => ['items' => $resCamelCase]];
    }

    public function view($id, $userId)
    {
        $res = Itinerary::getItinerary($id, $userId);
        $attributes = $res->getAttributes();

        $resCamelCase = IdentifierFormatter::convertArrayKeysToCamelCase($attributes);
        return ['status' => 200, 'data' => $resCamelCase];
    }

    public function create($userId)
    {
        InputValidator::emptyInputs($this->requiredFields);
        $res = Itinerary::createItinerary($userId);
        $attributes = $res->getAttributes();

        $resCamelCase = IdentifierFormatter::convertArrayKeysToCamelCase($attributes);
        return ['status' => 200, 'data' => $resCamelCase];
    }

    public function update($id, $userId)
    {
        InputValidator::emptyInputs($this->requiredFields);
        $res = Itinerary::updateItinerary($id, $userId);
        $attributes = $res->getAttributes();

        $resCamelCase = IdentifierFormatter::convertArrayKeysToCamelCase($attributes);
        return ['status' => 200, 'data' => $resCamelCase];
    }

    public function delete($id, $userId)
    {
        Itinerary::deleteItinerary($id, $userId);
        return ['status' => 200, 'message' => 'Itinerary successfully deleted'];
    }
}
