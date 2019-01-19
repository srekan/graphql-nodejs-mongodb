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
    console.log(args)
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
