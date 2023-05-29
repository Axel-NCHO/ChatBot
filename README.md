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
![image](https://github.com/Axel-NCHO/ChatBot/assets/108560661/2b8da599-c305-4ba0-bf6a-7c3e4e29c529)

There are already two accounts created:
- One with one bot named Steeve (id: jean, pwd: 1234)
- one with no bots (id: user2, pwd: 1234).  

You can log in with one of these accounts or create a new account.

### Signing-up

When you sign up, you have to log in with your credentials to use the app.

### Managing bots
![image](https://github.com/Axel-NCHO/ChatBot/assets/108560661/b2ee3464-accb-4469-bdfa-64108aa5fc85)

You can now:

- chat with any of your bots (if you have one). Press 'Enter' to send youx text.
![image](https://github.com/Axel-NCHO/ChatBot/assets/108560661/d9e13f65-07d4-4948-8190-966c34225003)

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

The server is stateless, meaning that it doesn't store any user user session. However it checks if user 
sending a request is registered.  
To avoid having to enter your credentials each time the front-end makes a request to the server, they are cached on the client-side in paragraphs "\<p\>" when you log in. The cached credentials 
are then used each time the front-end makes a request to the server. When you log out, the cache is freed.

### Data served by the server
Besides the endpoint used to get the user interface, all the other endpoints serve 
json or text data that can be used in any front-end application.
