---
title: GraphQl with Node
date: 2021-03-30
author: admin
featured: false
category:
  - GraphQl
  - Node
---


# Build GraphQL APIs using Node.
In this article, you will learn about GraphQL and building APIs with GraphQL using Node.

## What is GraphQL

 - A query language service that sits between frontend and backend abstracting how multiple frontend client applications interacting with multiple server applications.
  <p align="center">  <img width="400" height="200" src="https://drive.google.com/uc?export=view&id=1oqb7WAtEzHVOvkYMmJXH6OVW8xqAYiaj">  </p>

## Why we should use GraphQL over Rest API

Imagine we have UI who wants to query ***User*** information like name, email, last purchased items, and recommended items. 

- A typical Rest requests involves multiple API calls between client and server:

```sh 
 1. Get User Information: 
  /api/v1/users?id=XYZ
  {   name: ABC, email: abc@gmail.com, purchase_user_id: 123, recommended_user_item: 456   }
     
 2. Get Purchase Items:
   /api/v1/purchases?purchase_user_id=123
   { <Purchase Items> } 
   
3. Get Recommended Items:
  /api/v1/recommendations?recommended_user_itme=456
  { <Recommended Items> }
```

- With GraphQL same results can be achieved in a single request. We will be learning about how to write such queries in the next modules

This will eventually save request/response time, no over/under data fetched and the size of the payload reduces significantly.

## GraphQL Editor

There are many GraphQL editors which provide an in-browser playground to interact with GraphQL queries. Here are some of few good editors you could try 
- [Insomnia](https://support.insomnia.rest/article/156-installation): Similar to Postman Rest Client
-  [GraphiQL](https://graphql.org/swapi-graphql): An In-browser editor

We will be using GraphiQL available online to learn GraphQL basics and later in the article we will use the same editor locally with our React application. 

GraphIQL has four main component 

1. Workspace area to write our queries.
2. Query Variables area to pass any user input arguments to be used in queries.
3. Output area to view results.
4. Documentation area which shows available fields and their types we can query on.

 <p align="center">  <img width="800" height="400" src="https://drive.google.com/uc?export=view&id=16LDWfphbmjPF1ZsJi67R1jbOzX9rpNB-">  </p>

## GraphQL Basics

We will learn the below concepts in GraphQL using the [Star Wars GraphQL schema](https://graphql.org/swapi-graphql). 

- [Fields](#fields)
- [Variables](#variables)
- [Arguments](#arguments)
- [Directives](#directives)
- [Aliases](#aliases)
- [Fragments](#fragments)
- [Mutations](#mutations)
- [Interfaces](#interfaces)

For our understanding, we will be using the following example **(A)** query.

```json
query GetAllFilms{
  allFilms(last:3) {
    films {
      title
      episodeID
      openingCrawl
      director
      producers
      releaseDate
    }
  }
}
```
### Fields
GraphQL is all about asking for specific fields of an object. It could be a simple scalar field or complex type.

In our example **(A)** some of the Scalar fields are *title, episodeID* and Complex type are *allFilms, films*.

### Arguments
GraphQL has the ability to pass arguments to fields. But unlike REST every field and nested object can have its own set of arguments, avoiding multiple API fetches.

In our example  **(A)** *last* 3 tells us we are only interested in the last 3 films with mentioned fields.

### Aliases
If we need to query the same field with different arguments, aliases help us to rename the result of a field to anything we want.

In the example below, ***alias*** *filmA* and *filmB* are used to differentiate between film names.
> **Input**

```bash

{
  filmA: film(id: "ZmlsbXM6NA==") {
    titleA: title
  }
  filmB: film(id: "ZmlsbXM6NQ==") {
    titleB: title
  }
}
```
> **Output**
```bash
{
  "data": {
    "fileA": {
      "titleA": "The Phantom Menace"
    },
    "fileB": {
      "titleB": "Attack of the Clones"
    }
  }
}
```
In this example, we used the same field film with multiple arguments and used aliases to differentiate the results

### Fragments
Fragments let you reuse repetitive fields by separating out into smaller chunks and reuse them in multiple queries.

In the example below, we separated out common fields as fragments and reused them in queries using 
... < FragmentName>.
```json
{
  filmA: film(id: "ZmlsbXM6NA==") {
    ...metaData
  }
  filmB: film(id: "ZmlsbXM6NQ==") {
    ...metaData
  }
}

fragment metaData on Film {
  episodeID
  openingCrawl
  director
  producers
  releaseDate
}
```
### Variables
We can pass dynamic values as arguments to fields.  GraphQL factors dynamic values out of the query and passes them as a dictionary. 

Now instead of hardcoding values within a query, we can reuse the query by making it generic to receive value from the variable. Since GraphQL is strongly typed, we must provide the type of input variable which should match its original field type we are querying on. Type **String!** indicates that input is a required variable marked by ***!*** symbol.

```json
// Instead of hardcoding in query:

query FilmQuery{
  filmA: film(id: "ZmlsbXM6NA==") {
    titleA: title
  }
}

// Replace it as follows:

query FilmQuery($filmid: ID!){
  filmA: film(id: $filmid) {
    titleA: title
  }
}

// In Query Variable section we can pass value to filmid as:

{
   "filmid": "ZmlsbXM6NA=="
}
```
### Directives
Imagine we want to render a portion of the component in the UI based on certain conditions in the query, directive comes in handy in this place where we can alter GraphQL runtime execution and commonly used with variables. Built-in directives supported by the GraphQL server are **@include**  and **@skip**.

```json
query FilmConnectionsQuery($filmid: ID!, $withVehicle: Boolean!) {
  film(id: $filmid) {
    title
    vehicleConnection @include(if: $withVehicle) {
      vehicles {
        name
        model
      }
    }
  }
}

// Query Input
{
  "filmid": "ZmlsbXM6NA==",
  "withVehicle": false
}

// Based on condition withVehicle true/false, 
// we get a response back including/excluding vehicle info.

// With vehicle
{
  "data": {
    "film": {
      "title": "The Phantom Menace",
      "vehicleConnection": {
        "vehicles": [
          {
            "name": "Vulture Droid",
            "model": "Vulture-class droid starfighter"
          },...          
        ]
      }
    }
  }
}

// Without the vehicle
{
  "data": {
    "film": {
      "title": "The Phantom Menace"
    }
  }
}
```

### Mutations
Operations that cause write (create, update and delete) data on the server side should be sent explicitly as mutations in GraphQL. 

Currently, mutation is not supported in our demo playground API but we will learn more about it in the demo applications we will build.

```json
mutation addFilm($title: String!, $episodeId: Int!) {
  addFilm(title: $title, episodeId: $episodeId) {
    eposideId
  }
}
```

### Interfaces
An interface is an abstract type that includes a predefined set of fields that a type must include to implement an interface.

Currently mutation is not supported in our demo playground API but we will learn more about it in demo applications we will build.

```json
interface Character {
  id: ID!
  name: String!
  films: [Film]
}

type Human implements Character {
  id: ID!
  name: String!
  persons: [Film]
  totalCount: Int
}


query HeroForEpisode($personid: ID!) {
  person(personID: $personid) {
    name
    ... on Human {
      persons
    }
  }
}
```

# Designing GraphQL Schemas

Each of the next subsections is mapped to branches in the [Blogging-GraphQL](https://github.com/arpith-kp/blogging-graphql.git) repo starting with **tut-02**, you can checkout each branch and compare it with your version to see if everything is working as expected.

## Setup Environment

Ensure you have installed [NodeJs](https://nodejs.org/tr/download/package-manager/#macos), [MongoDb](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/), [Postgresql](https://formulae.brew.sh/formula/postgresql). If you are on Mac, you can install them easily using.

- brew install node. 
    - Test you have installed by running 
    ```bash 
    node -v and npm -v
    ```
 -  brew tap mongodb/brew, brew install mongodb-community@4.4
    -  Test you have installed by running ```mongd```
 - brew install postgresql
    - Test you have installed by running ```psql```

## Load Test Data

- Install predefined dependencies using **npm i** . 
- Once installation completes run scripts *loadPgData.sql* and *loadMongoData.js* to load test data.
  <br/> -- From CLI you can load data to Postgres as follows
```bash 
$ createdb blogging
$ psql blogging < loadPgData.sql
```
- ER Diagram for Postgres DB tables
 <p align="center">  <img width="500" height="400" src="https://drive.google.com/uc?export=view&id=1goykJL1p-ZsfwhoOWMRqHgMOSNUJM82f">  </p>

## Developing GraphQL Schema

### Designing simple HelloWorld Schema( Branch [tut-03](https://github.com/arpith-kp/blogging-graphql/tree/tut-03)) 
To begin let's design a simple HelloWorld Schema. Detailed descriptions of various types we are about to use are in GraphQL JS [docs](https://graphql.org/graphql-js/type/), take a look at it before starting designing schema.

Final folder structure of this tutorials looks as follows.

 <p align="left">  <img width="200" height="400" src="https://drive.google.com/uc?export=view&id=1I6ANbR5qU5TS_1NtGXWfFo7ANhNHfBcx">  </p>

Let's create our root schema in *index.js* inside *schema* directory. Each field has a type and resolver function attached to it.

```javascript:title=src/schema/index.js
// Import helpers
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

// Root Query type is your starting point in data graph
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',

  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'world',
    },
  },
});

const nsSchema = new GraphQLSchema({
  query: RootQueryType,
});

module.exports = nsSchema;
```

```javascript:title=src/index.js
const {nodeEnv} = require('./lib/util');
console.log(`Running in ${nodeEnv} mode...`);

// Query argument
const queryArg = process.argv[2];

const ncSchema = require('./schema');
const {graphql} = require('graphql');

// Execute the query with our Schema
graphql(ncSchema, queryArg).then((result) => {
  console.log(JSON.parse(JSON.stringify(result)));
});

```
Run index.js script and see if we are getting the expected result.

```bash
node lib/index.js {hello}
```
<br/>

### Extending Runtime with Express Server (Branch [tut-04](https://github.com/arpith-kp/blogging-graphql/tree/tut-04))

- Install the following dependencies to integrate our application with Express.
```json
"express": "^4.14.0",
"express-graphql": "^0.5.3"
```

- Modify *lib/index.js* to an accept connection on port 3000 and you can now start executing your GraphQL queries with embedded GraphIQl IDE.

```javascript:title=lib/index.js
const app = require('express')();

const ncSchema = require('../schema');
const graphqlHTTP = require('express-graphql');

// Execute the query
app.use('/graphql', graphqlHTTP({
  schema: ncSchema,
  graphiql: true,
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

```
### Building Custom GraphQL Types(Branch [tut-05](https://github.com/arpith-kp/blogging-graphql/tree/tut-05))

Let's start building custom types to query a single user email based on token ID. Our GraphQL query we are trying to build looks like this.
```json
{
  user(token: "2222"){
    email
  }
}
```

First, let's add custom *UserType* under *schema/types* to accept input fields
```javascript:title=schema/types/user.js
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'UserType',

  fields: {
    id: {type: GraphQLID},
    email: {type: new GraphQLNonNull(GraphQLString)},
  },
});
```

Let's modify our *schema/index.js* to accept custom type as follows:
```javascript:title=schema/index.js
// Import helpers
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');

const UserType = require('./types/user');
const pgdb = require('../db/pgdb');

// Root Query type is your starting point in data graph
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',

  fields: {
    user: {
      type: UserType,
      description: 'Current user identified by token id',
      args: {
        token: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: (obj, args, {pgPool}) => {
        // Read from Postgres DB
        return pgdb(pgPool).getUser(args.token);
      },
    },
  },
});

const nsSchema = new GraphQLSchema({
  query: RootQueryType,
});

module.exports = nsSchema;
```

Change our root *index.js* to redirect query based on custom type.
```javascript:title=lib.index.js
const app = require('express')();
const pgp = require('pg-promise')();
const connectString = 'postgres://localhost:5432/blogging';
const db = {};
db.conn = pgp(connectString);
const pgPool = db.conn;

const ncSchema = require('../schema');
const graphqlHTTP = require('express-graphql');

// Execute the query
app.use('/graphql', graphqlHTTP({
  schema: ncSchema,
  graphiql: true,
  context: {pgPool},
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

```

Finally, handle query with database in *db/pgdb.js*
```javascript:title=db/pgdb.js
module.exports = (pgPool) => {
  return {
    getUser(tokenId) {
      return pgPool.query(`
          select * from users
          where token_id = $1
        `, [tokenId]).then((res) => {
        return res['0'];
      });
    },
  };
};
```

### Mapping CamelCase Field Variables In Query With SnakeCase Columns In DB

Let's say we want to query on additional fields in User such as firstName and lastName, if we run our query like this we will get a response back as null as the server doesn't know how to map columns in DB.

```json
// Query: 
{
  user(token: "2222"){
    email
    firstName
  }
}

//Response
{
  "data": {
    "user": {
      "email": "arpith@gmail.com",
      "firstName": null
    }
  }
}
```
To handle such scenarios we can use library *humps* (new dependencies are added in *package.json*) to camelize column names. Let's change  *db/pgdb.js*.
```javascript:title=db/pgdb.js
const humps = require('humps');
module.exports = (pgPool) => {
  return {
    getUser(tokenId) {
      return pgPool.query(`
          select * from users
          where token_id = $1
        `, [tokenId]).then((res) => {
        console.log(res);
        return humps.camelizeKeys(res['0']);
      });
    },
  };
};

```

### Modeling 1:N Relationships

Let's say we want to get all the posts a user has written. This kind of querying typically involves more than two tables.

```json
query userPostsQuery{
  user(token:"1111"){
    lastName
    email
    createdAt
    posts{
     title
     content
    }
  }
}
```

From the above query it's clear we should add *posts* field to *UserType* in *schema/types/user.js*
```javascript:title=schema/types/user.js
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');
const pgdb = require('../../db/pgdb');

const PostType = require('./post');

module.exports = new GraphQLObjectType({
  name: 'UserType',

  fields: {
    id: {type: GraphQLID},
    firstName: {type: GraphQLString},
    lastName: {type: GraphQLString},
    email: {type: new GraphQLNonNull(GraphQLString)},
    createdAt: {type: GraphQLString},
    posts: {
      type: new GraphQLList(PostType),
      resolve: (obj, args, {pgPool}) => {
        return pgdb(pgPool).getPosts(obj);
      },
    },
  },
});
```

Since *posts* field is of custom type, let's define it under *schema/types/post.js*.

```javascript:title=schema/types/post.js
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'PostType',

  fields: {
    id: {type: GraphQLID},
    title: {type: new GraphQLNonNull(GraphQLString)},
    createdAt: {type: new GraphQLNonNull(GraphQLString)},
    updatedAt: {type: new GraphQLNonNull(GraphQLString)},
    content: {type: new GraphQLNonNull(GraphQLString)},
  },
});
```

Finally, add support query *getPosts* in *db/pgdb.js* to fetch data from DB.
```javascript:title=db/pgdb.js
const humps = require('humps');
module.exports = (pgPool) => {
  return {
    getUser(tokenId) {
      return pgPool.query(`
          select * from users
          where token_id = $1
        `, [tokenId]).then((res) => {
        return humps.camelizeKeys(res['0']);
      });
    },
    getPosts(user) {
      return pgPool.query(`
        select * from posts
        where author_id=$1
        `, [user.id]).then((res) => {
        return humps.camelizeKeys(res);
      });
    },
  };
};
```


## Summary

Congratulations, you have reached the end of the Node GraphQL's tutorial. Here you learned about using Node library for developing GraphQL Server.

We have been able to implement a simple BlogPost application and played around implementing various queries. You have learned the benefits of GraphQL on how the client and server can communicate effectively with fewer calls. 

If you want to learn more about GraphQL, here are some of the links.

- [How To GraphQL](https://www.howtographql.com/) - The Fullstack Tutorial for GraphQL
- [Building Scalable APIs with GraphQL](https://www.pluralsight.com/courses/graphql-scalable-apis) - Video tutorial on GraphQL. This tutorial is inspired by it.

For any feedback, you can reach out at my [email](arpithkp.dev@gmail.com).