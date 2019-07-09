const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

let coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
];
// Schema
const typeDefs = gql`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
        allCourses:[Course]
    }
    type Mutation  {
        removeCourse(id: Int!): [Course]
        updateCourse(id:Int!,title: String,author: String,description: String):[Course]
        addCourse(id: Int,
            title: String,
            author: String,
            description: String,
            topic: String,
            url: String):[Course]
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`;

let getCourses=()=>{
    return coursesData;
};

let getCourseByID=(parent,args)=>{
    let id= args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0]; //When Object [0]
};

let deleteCourseByID = (parent,args)=>{
    let ind = coursesData.findIndex(c=>c.id === args.id);
    let data = coursesData.splice(ind,1);
    return data;
};

let getCourseByTopic=(parent,args)=>{
    let str= args.topic;
    return coursesData.filter(course => {
        return course.topic === str;
    }); // return type of array
};

let editCourseByID=(parent,args)=>{
   // console.log("args",args);
    let index = coursesData.findIndex(e=>e.id === args.id);
    let newData;
    if(index!==-1){
         newData={
            ...coursesData[index],
            ...args
        };
    }

    return coursesData.splice(index,1,newData);
};

let addCourses=(parent,args)=>{
   coursesData.push(args);
    return coursesData;
};

const resolvers = {
  Query :{
      allCourses:getCourses,
      course:getCourseByID,
      courses:getCourseByTopic
  },
  Mutation: {
      removeCourse:deleteCourseByID,
      updateCourse:editCourseByID,
      addCourse:addCourses
  }
};

const app = express();

const server = new ApolloServer({typeDefs,resolvers});

server.applyMiddleware({app});

app.listen({port : 5001},()=>{
    console.log(`Server ready at localhost:5001${server.graphqlPath}`);
});
