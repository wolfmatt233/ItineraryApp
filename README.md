# Itenerary MERN Full Stack App (w/ API)

## Explanation

An itenerary website that allows you to create an itenerary on a day by day basis. Scheduling and times can be laid out. Use of a map to select locations to add.

## Tech Stack

- Database: MongoDB
- Server Framework: ExpressJS
- Frontend: React (via Vite)
- Server: Node

## Other Tech & Libraries

- Google Maps API OR Leaflet Maps API (open source)
- React Big Calender (free) OR FullCalendar (free w/ some features locked behind paywall)

## Database

- Users Collection

  - \_id (ObjectId)
  - username (string)
  - password (hashed string)
  - email (string)
  - createdAt (string)
  - iteneraries (array of object ids)

- Itineraries Collection

  - \_id (ObjectId)
  - userId (ObjectId)
  - title: (string)
  - startDate (string)
  - endDate (string)
  - activities (array of objects)
  - createdAt (string)
  - updatedAr (string)

- Itinerary Activity Object

  - date (string)
  - time: (string)
  - activity (string)
  - location (object)
    - name (string)
    - coordinates
      - lat (decimal)
      - lng (decimal)
  - notes (string)
  - completed (bool)

  Notes:

  - Use ISODate for dates

## Features / TODO

- [ ] Account center

  - [x] Sign in & Sign out
  - [x] Sign up
  - [ ] Delete Account
  - [ ] Change username

- [x] Create Itinerary
- [ ] Create locations/activities

- [ ] Read Itinerary

  - [x] Display all itineraries to select from
  - [ ] View Individual itineraries
    - [x] View Title and dates
    - [ ] View locations/activities

- [ ] Update Itinerary

  - [x] Update Title and dates
  - [ ] Update locations/activities
    - [ ] Mark as complete

- [x] Delete Itinerary

  - [ ] Delete locations/activities

- [ ] Interactive Components

  - [ ] Choose a location from the map (API)
  - [ ] View up to date itinerary on the map with numbered markers organized by colors based on the day
    - [ ] Completed activities grayed out
  - [ ] View activities in a calendar view
    - [ ] Export activities to external calendar applications

## Possible Features (uncertain)

- After the Trip
  - Give the user the ability to upload an image for each location. Make a slideshow type animation where the map zooms to each area of the map to show the name of the activity and location along with the image provided.
    - 1st: Name of the itinerary. Animation starts at the opposite side of the globe then flips around to the starting area in view (i.e., See Iceland in it's entirety if that is where the trip was).
    - 2nd: Then zoom in to the first location, show its name, activity, and picture
    - 3rd: Fly across the map to each location and do the same.
    - 4th: Finish title
