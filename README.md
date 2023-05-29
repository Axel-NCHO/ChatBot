# ChatBot
A simple chatbot manager based on rivescript

## Installation
Run :  
> npm install\
> npm run nodemon

or 
> npm install\
> npm run start

## How to use
Open your browser and go to 
> localhost:3000/chatbot/api/v1

### Logging-in 
You will end up on a log-in and sign-up page.  
There are already two accounts created:
- One with bots (id: jean, pwd: 1234) 
- one with no bots (id: user2,
pwd: 1234).  

You can log in with one of these accounts or create a new account.

### Signing-up

When you sign up, you have to log in with your credentials to use the app.

### Managing bots
You can now:

- chat with any of your bots (if you have one)
- create bots
- modify your bots personalities
- delete your bots

> You cannot delete your account via the user interface.

### Logging-out
You can log out by :

- clicking the 'logout' button
- refreshing the page (which will query the server for a new page)

### Routing
On the server side, the routes are organized per category in different files. So 
the endpoint for the request 'PATCH /chatbot/api/v1/bots' can be found in the file 
'routes/chatbot/api/v1/bots.js' and uses the url '/'.

### Data served by the server
Besides the endpoint used to get the user interface, all the other endpoints serve 
json or text data that can be used in any front-end application.
