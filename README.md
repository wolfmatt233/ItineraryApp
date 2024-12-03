# Itenerary MERN Full Stack App

## Explanation

An itenerary website that allows you to create an itenerary on a day by day basis. Scheduling and times can be laid out. Use of a map to select locations to add.

## Tech Stack

- Database: MongoDB
- Server Framework: ExpressJS
- Frontend: React (via Vite)
- Server: Node

## Other Tech & Libraries

- Leaflet Maps API
- React Big Calendar

## Database

- Users Collection

  - \_id (ObjectId)
  - username (string)
  - password (hashed string)
  - email (string)
  - createdAt (string)
  - updatedAt (string)

- Itineraries Collection

  - \_id (ObjectId)
  - userId (ObjectId)
  - title (string)
  - startDate (string)
  - endDate (string)
  - activities (array of objects)
  - createdAt (string)
  - updatedAt (string)

- Activities Collection

  - \_id (ObjectId)
  - userId (ObjectId)
  - itineraryId (ObjectId)
  - date (string)
  - time (string)
  - activity (string)
  - locationName (string)
  - locationLat (decimal)
  - locationLng (decimal)
  - notes (string)
  - completed (bool)
  - createdAt (string)
  - updatedAt (string)

## To Do

- [ ] Delete Account
- [ ] Change username
- [ ] Error message handling (popups, modals, etc.)
- [ ] View activities in a calendar view
- [ ] Export activities to external calendar applications

## PHP Api

- Added a PHP version of the api for my own practice that works the same, just using MySQL.

## Possible Features (uncertain)

- After the Trip
  - Give the user the ability to upload an image for each location. Make a slideshow type animation where the map zooms to each area of the map to show the name of the activity and location along with the image provided.
    - 1st: Name of the itinerary. Animation starts at the opposite side of the globe then flips around to the starting area in view (i.e., See Iceland in it's entirety if that is where the trip was).
    - 2nd: Then zoom in to the first location, show its name, activity, and picture
    - 3rd: Fly across the map to each location and do the same.
    - 4th: Finish title
