# Functional Programming with Javascript

## Mars Dashboard

### Big Picture

This project is a Mars rover dashboard that consumes the NASA API. The dashboard allows the user to select which rover's information they want to view. Once they have selected a rover, they will be able to see the most recent images taken by that rover, as well as important information about the rover and its mission.

### Repository

https://github.com/ialkamal/ij-p2-mars-rover

### Deployment

Project is deployed on heroku at the following <a href="https://mars-rover-ialkamal.herokuapp.com/">link</a>

### Getting Started

We have supplied some of the foundational code for you. So follow these steps to get started:

1. Please clone the project branch as follows:

`git clone --branch project https://github.com/ialkamal/ij-p2-mars-rover.git`

2. Install dependencies:

`npm install`

3. Note that the project is deployed on heroku and so the BASE_URL is pointed to that endpoint. You can change to localhost:3000 if you want to run the server locally

4. Nodemon is installed for continuous monitoring and starting of the express server. To run the local server just type the following:

`npm start`

5. Add .env file and include the NASA API_KEY to be able to get the photos.
