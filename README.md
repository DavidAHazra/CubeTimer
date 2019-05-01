[1. Website Documentation](#website-documentation-how-to-use-the-site)

[2. API Documentation](#api-documentation)


# Website Documentation (How to use the site)
URL to cloud-hosted site: https://rubix-timer.herokuapp.com/home.

Additional information can be found in the [About](https://rubix-timer.herokuapp.com/about) section of the website.

## How to use the site
This website was made to help time yourself when practicing solving a Rubik's Cube.
For navbar functions, see below.

The string of characters indicate an algorithm that, when performed, produces a unique permutation of the Rubik's cube known as a scramble. The user knows if they've done the scramble correctly by comparing their cube to the diagram on the screen. This image is produced by a third-party API called [VisualCube](http://cube.crider.co.uk/visualcube.php).

To create an account, simply click register then log in.

If you're logged in, completing a solve will save your time, the date, and the scramble on the server. You can delete any / all of the attempts you like.
You can view your profile, which shows you all of your solves, and some statistics about your solves. These data are also viewable from the home screen sidebar.

You can also view individual solves by clicking the 'Details' link on either your profile page or the sidebar.

### Navbar
The navbar has 2 main sections:
1. Links to other pages
    - Home page
    - About page
    - Helpful Links
    - Your Profile (when logged in)

2. User management
    - Log In (when logged out)
    - Log Out (when logged in)
    - Registration


# API Documentation
The following section is split into: [Contents](#contents), [Implementation](#implementation)

### Contents
#### File Serve, Non-Auth Required Routes
- [GET /](#get)
- [GET /home](#get-home)
- [GET /login](#get-login)
- [GET /register](#get-register)
- [GET /about](#get-about)

#### File Serve, Auth Required Routes
- [GET /home/:username](#get-homeusername)
- [GET /profile/:username](#get-profileusername)
- [GET /solve_details/:username/:index](#get-solvedetailsusernameindex)

#### User Data Related
- [POST /new_time_entry/:username](#post-newtimeentryusername)
- [GET /user_solves/:username](#get-usersolvesusername)
- [DELETE /delete_data/:username](#delete-deletedatausername)
- [DELETE /delete_entry/:username/:index](#delete-deleteentryusernameindex)

#### Login Related
- [GET /logout](#get-logout)
- [POST /login](#post-login)
- [POST /register](#post-register)

#### Other
- [POST /cube_image](#post-cubeimage)
- [GET /static/*](#get-static)


### Implementation
##### GET /
The index route, returns status code 302 (redirect). 

Redirects to the home page [/home](#get-home).

##### GET /home
Returns the home page when there is no user logged in. 


##### GET /login
Returns the login page.

##### GET /register
Returns the registration page.

##### GET /about
Returns the about / help page.

<br>
<br>
<br>
<br>

##### GET /home/:username
Authentication and authorisation required.

If authentication fails, a status code 302 will be returned and the user will be redirected to the login page [/login](#get-login). Similarly, if authorisation fails (the user requesting the home page must be the user corresponding to this home page), they will be redirected to [/login](#get-login) again.

Otherwise, it returns the user's home page (not their profile page). Where they can record their times.

##### GET /profile/:username
Authentication and authorisation required.

If authentication fails, a status code 302 will be returned and the user will be redirected to the login page [/login](#get-login). Similarly, if authorisation fails (the user requesting the profile must be the user corresponding to this profile page), they will be redirected to [/login](#get-login) again.

Otherwise, it returns the user's profile page. Where they can view their times and statistics.

##### GET /solve_details/:username/:index
Authentication and authorisation required.

If authentication fails, a status code 302 will be returned and the user will be redirected to the login page [/login](#get-login). Similarly, if authorisation fails (the user requesting the solve details must be the user corresponding to this solve), they will be redirected to [/login](#get-login) again.

Otherwise, the page corresponding to a specific solve will be sent (not the solve information itself (for that see [/user_solves/:username](#get-usersolvesusername)), but a page that displays it for the user).

<br>
<br>
<br>
<br>

##### POST /new_time_entry/:username
Authentication and authorisation required.

If authentication fails, a status code 302 will be returned and the user will be redirected to the login page [/login](#get-login). Similarly, if authorisation fails (the user requesting to add a new solve is not the same user as the user they are requesting the solve to be added to), they will be redirected to [/login](#get-login) again.

Otherwise,

POST Body Parameters:
```
{
    solve_time: The number of milliseconds it took the user to solve the given scramble
    scramble: The algorithm used to scramble the cube
}
```

Upon success, this scramble will be added to the user's history, it can be viewed from their profile page or their home page or retrieved using [/user_solves/:username](#get-usersolvesusername).

##### GET /user_solves/:username
Authentication and authorisation required.

If authentication fails, a status code 302 will be returned and the user will be redirected to the login page [/login](#get-login). Similarly, if authorisation fails (the user requesting the list of solves isn't the user who owns the solves), they will be redirected to [/login](#get-login) again.

Otherwise, this returns a list of solves in JSON with the following format:
```
[
    {
        date: The date when the solve occured
        solve_time: The number of milliseconds it took the user to solve the given scramble
        scramble: The algorithm used to scramble the cube
    },
    
    ...
]
```

##### DELETE /delete_data/:username
Authentication and authorisation required.

If authentication fails, a status code 302 will be returned and the user will be redirected to the login page [/login](#get-login). Similarly, if authorisation fails (the user requesting to delete their solve history isn't the user specified in the url params), they will be redirected to [/login](#get-login) again.

Otherwise, the user's entire solve history will be deleted.

##### DELETE /delete_entry/:username/:index
Authentication and authorisation required.

If authentication fails, a status code 302 will be returned and the user will be redirected to the login page [/login](#get-login). Similarly, if authorisation fails (the user requesting to delete a solve isn't the user specified in the url params), they will be redirected to [/login](#get-login) again.

Otherwise, the solve corresponding to the user at the index specified in the url params will be deleted.


<br>
<br>
<br>
<br>

##### GET /logout
If the user isn't logged in, this just redirects to [/](#get) (which redirects to [/home](#get-home)).

If the user is logged in, this will log them out and then redirect them.

##### POST /login
This will authenticate the user, if they have not created an account yet it will redirect them to the registration page.

Otherwise,

POST Body Parameters:
```
    username: The username of the user logging in
```

##### POST /register
POST Body Parameters:
```
    username: The username of the user registering
    password: The password corresponding to the user's account
```

If either the username or password is not included, this will return a status code 400.

Otherwise, the user will be created, their password will be salted and hashed and then stored.

<br>
<br>
<br>
<br>

##### POST /cube_image
POST Body Parameters:
```
    scramble: The algorithm used to scramble the cube
```

If the scramble is not included, this will return a status code 400.

Otherwise, it will call the [VisualCube](http://cube.crider.co.uk/visualcube.php) API and will return a base64 encoded image of the cube corresponding to that scramble when the white face is on top and the green face is on the front.


##### GET /static/*
This is a catch-all route that returns any item in the static folder (such as .css files).
