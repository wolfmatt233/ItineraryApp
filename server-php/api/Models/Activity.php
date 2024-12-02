<?php

namespace ItineraryApi\Models;

use Illuminate\Database\Eloquent\Model as Model;
use ItineraryApi\Utils\UnauthorizedException;

class Activity extends Model
{
    protected $table = 'activities';

    protected $primaryKey = 'id';

    protected $hidden = ['created_at', 'updated_at'];

    public static function getActivities($id, $userId)
    {
        Itinerary::getItinerary($id, $userId); // Throw exception if user does not match
        return self::where('itinerary_id', $id)->get();
    }

    public static function getActivity($id)
    {
        return self::findOrFail($id);
    }

    public static function createActivity($id, $userId)
    {
        Itinerary::getItinerary($id, $userId); // Throw exception if user does not match

        $activity = new Activity();
        $activity->itinerary_id = $id;
        $activity->date = $_REQUEST['date'];
        $activity->activity = $_REQUEST['activity'];
        $activity->notes = $_REQUEST['notes'];
        $activity->completed = false;
        $activity->location_name = $_REQUEST['location_name'];
        $activity->location_lat = $_REQUEST['location_lat'];
        $activity->location_lon = $_REQUEST['location_lon'];
        $activity->save();

        return $activity;
    }

    public static function updateActivity($id, $userId)
    {
        $activity = self::findOrFail($id);
        Itinerary::getItinerary($activity->itinerary_id, $userId);

        foreach ($_REQUEST as $field => $value) {
            $activity->$field = $value;
        }

        $activity->save();
        return $activity;
    }

    public static function deleteActivity($id, $userId)
    {
        $activity = self::findOrFail($id);
        Itinerary::getItinerary($activity->itinerary_id, $userId);

        return $activity->delete();
    }
}