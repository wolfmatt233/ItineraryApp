<?php

namespace Api\Models;

use Illuminate\Database\Eloquent\Model as Model;

class Activity extends Model
{
    protected $table = 'activities';

    protected $primaryKey = 'id';

    protected $hidden = ['created_at', 'updated_at'];

    public function itinerary()
    {
        return $this->belongsTo(Itinerary::class, 'id');
    }

    public static function getActivitiesByItinerary($itineraryId, $userId)
    {
        // Get the activities that belong to the itinerary AND the current user 
        return self::join('itineraries', 'activities.itinerary_id', '=', 'itineraries.id')
            ->where('activities.itinerary_id', $itineraryId)
            ->where('itineraries.user_id', $userId)
            ->get(['activities.*']);
    }

    public static function getActivityById($id, $itineraryId, $userId)
    {
        // Get the activity that belongs to the itinerary AND the current user 
        return self::join('itineraries', 'activities.itinerary_id', '=', 'itineraries.id')
            ->where('activities.itinerary_id', $itineraryId)
            ->where('activities.id', $id)
            ->where('itineraries.user_id', $userId)
            ->first(['activities.*']);
    }

    public static function createActivity($itineraryId, $body)
    {
        $activity = new Activity();
        $activity->itinerary_id = $itineraryId;
        $activity->date = $body['date'];
        $activity->activity = $body['activity'];
        $activity->notes = $body['notes'];
        $activity->completed = $body['completed'];
        $activity->location_name = $body['location_name'];
        $activity->location_lat = $body['location_lat'];
        $activity->location_lon = $body['location_lon'];
        $activity->save();

        return $activity;
    }

    public static function updateActivity($id, $itineraryId, $userId, $body)
    {
        $activity = self::getActivityById($id, $itineraryId, $userId);

        if (!$activity) {
            return false;
        }

        foreach ($body as $field => $value) {
            $activity->$field = $value;
        }

        $activity->save();

        return $activity;
    }

    public static function deleteActivity($id, $itineraryId, $userId)
    {
        $activity = self::getActivityById($id, $itineraryId, $userId);

        if (!$activity) {
            return false;
        }

        $activity->delete();
        return true;
    }
}