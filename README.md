# graphql-nodejs-mongodb
Uploaded the code while learning.

## Step by step guide to build a graphql-nodejs-mongodb application
I went through the tutorial https://www.howtographql.com/
Then I wanted try the end-to-end process.

This guide will be useful if you are looking for tried and tested guide to create the end-to-end apart from the tutorial https://www.howtographql.com/.

# Use Case
I picked up a simple example of creating collections of authors and books.
- Create functionality using in-memory objects
- Then replacing the functionality in-memory objects with mongodb collections

* Note: I did not cover the edge cases or error cases such as trying to delete/edit a non existing author

## 0. Pre requisites for learners
- You should have experience on nodejs
- You should have completed https://www.howtographql.com/

## 1. Setting up a node-graphql project

```
$ mkdir graphql-nodejs-mongodb
$ cd graphql-nodejs-mongodb

$ mkdir src
$ touch src/index.js
$ touch src/resolvers.js
$ touch src/schema.graphql

$ yarn init -y
$ yarn add graphql-yoga
```

## 2. Creating schema for author collection
### src/schema.graphql
```
type Query {
  authors: [Author!]!
  author(id: ID!): Author
}

type Mutation{
  createAuthor(name: String!): Author!
  updateAuthor(id: ID! name: String, books: [ID!]): Author!
  deleteAuthor(id: ID!): Author!
  
  addBookToAuthor(authorID: ID! bookID: ID!): Author!
  removeBookFromAuthor(authorID: ID! bookID: ID!): Author!
}

type Author {
  id: ID!
  name: String!
  books: [ID!]!
}
```

## 3. Creating resolvers while matching the schema
### src/resolvers.js
```
const authors = [
  {
    id: 'author-1',
    name: 'Yuval Noah Harari',
    books: [],
  },{
    id: 'author-2',
    name: 'Don Norman',
    books: [],
  }
]
let authorCount = authors.length

const Query =  {
  authors: () => authors,
  author: (parent, args) => {
    const author = authors.find(e => e.id == args.id)
    return author
  },
}

const Mutation = {
  createAuthor: (parent, args) => {
    const author = {
      id: `author-${++authorCount}`,
      name: args.name,
    }

    authors.push(author)
    return author
  },
  updateAuthor: (parent, args) => {
    const author = authors.find(e => e.id === args.id)
    if (args.name){
      author.name = args.name
    }

    /* We will handle this when we create books
    if (args.books){
      author.books = args.books
    }
    */
   return author
  },
  deleteAuthor: (parent, args) => {
    const authorIndex = authors.findIndex(e => e.id === args.id)
    const author = authors[authorIndex]
    authors.splice(authorIndex, 1)
    return author
  }
}

const resolvers = {
  Query,
  Mutation,
}

module.exports = resolvers
```

## 4. Setting up the server
### src/index.js
```
const { GraphQLServer } = require('graphql-yoga')
const resolvers  = require('./resolvers.js')

// 3
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
```

## 5. Starting server
```
$ node src/index.js
Server is running on http://localhost:4000
```

## 6. Using graphql-goga playground to query and mutate the data
Open  http://localhost:4000 and try the following queries
### 6.1 query all authors
```
query {
  authors {
    id
    name
  }
}
```
=> Query results
```
{
  "data": {
    "authors": [
      {
        "id": "author-1",
        "name": "Yuval Noah Harari"
      },
      {
        "id": "author-2",
        "name": "Don Norman"
      }
    ]
  }
}
```
### 6.2 query one author by id
```
query {
  author(id: "author-2") {
    id
    name
  }
}
```
==> Result
```
{
  "data": {
    "author": {
      "id": "author-2",
      "name": "Don Norman"
    }
  }
}
```
### 6.3 Create a new author
```
mutation{
  createAuthor(name: "Tom Kelly"){
    id
    name
  }
}
```
==> Result
```
{
  "data": {
    "createAuthor": {
      "id": "author-3",
      "name": "Tom Kelly"
    }
  }
}
```
### 6.4 View all authors again. You should see the added author "Tom Kelly" in the list
```
query {
  authors{
    id
    name
  }
}
```
==> Result
```
{
  "data": {
    "authors": [
      {
        "id": "author-1",
        "name": "Yuval Noah Harari"
      },
      {
        "id": "author-2",
        "name": "Don Norman"
      },
      {
        "id": "author-3",
        "name": "Tom Kelly"
      }
    ]
  }
}
```
### 6. Update author
```
mutation{
  updateAuthor(id: "author-3", name: "Robin Sharma"){
    id
    name
  }
}
```
==> Result
```
{
  "data": {
    "updateAuthor": {
      "id": "author-3",
      "name": "Robin Sharma"
    }
  }
}
```
### 7. Delete author
```
mutation{
  deleteAuthor(id: "author-3"){
    id
    name
  }
}
```
==> Result
```
{
  "data": {
    "deleteAuthor": {
      "id": "author-3",
      "name": "Robin Sharma"
    }
  }
}
```
### 8. View all authors again
```
query{
  authors{
    name
  }
}
```
==> Result
```
{
  "data": {
    "authors": [
      {
        "name": "Yuval Noah Harari"
      },
      {
        "name": "Don Norman"
      }
    ]
  }
}
```
