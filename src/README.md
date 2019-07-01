# Squared Squirrel API

Link to live app: https://squared-squirrel-app.felixworks.now.sh/

Link to client repo designed to use this API: https://github.com/felixworks/squared-squirrel-app

## Technology used

Express, PostgreSQL, Knex

## Specific information about API

### Show all users

#### URL

/api/users

#### Method

    GET

#### URL params

None

#### Data params

None

### Show one user

#### URL

/api/users/single

#### Method

    GET

#### URL params

    username=[string]

#### Data params

None

### Register one user

#### URL

/api/users

#### Method

    POST

#### URL params

None

#### Data params

    {"username": "test"}

### Update user statistics

#### URL

/api/users/single

#### Method

    PATCH

#### URL params

None

#### Data params

    {"userStatistics":
        {"id": "2",
        "incrementGamesPlayed": "true",
        "incrementGamesWon": "true",
        "lowestTimeWin": "26"}
    }

### Delete single user

#### URL

/api/users

#### Method

    DELETE

#### URL params

None

#### Data params

    {"username": "test"}
