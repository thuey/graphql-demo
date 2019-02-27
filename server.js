const express = require('express');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');

const app = express();

app.get('/hello', (req, res) => res.send('Hello World!'));

const songs = [
    { id: 'song-1', name: 'Bohemian Rhapsody', year: 1975, artistId: 'artist-1' },
    { id: 'song-2', name: 'We Will Rock You', year: 1977, artistId: 'artist-1' },
    { id: 'song-3', name: 'We Are the Champions', year: 1977, artistId: 'artist-1' },
    { id: 'song-4', name: 'Hey Jude', year: 1968, artistId: 'artist-2' },
    { id: 'song-5', name: 'Let It Be', year: 1970, artistId: 'artist-2' },
    { id: 'song-6', name: 'Faithfully', year: 1983, artistId: 'artist-3' },
    { id: 'song-7', name: 'Open Arms', year: 1981, artistId: 'artist-3' }
];

const artists = [
    { id: 'artist-1', name: 'Queen' },
    { id: 'artist-2', name: 'The Beatles' },
    { id: 'artist-3', name: 'Journey' }
];

const typeDefs = `
    type Query {
        artists: [Artist]!
        artist(id: ID!): Artist
        songs: [Song]!
        song(id: ID!): Song
    }
    
    type Mutation {
        addArtist(id: ID!, name: String!): Artist
        addSong(id: ID!, name: String!, year: Int!, artistId: String!): Song
    }
    
    type Song {
        id: ID!
        name: String!
        year: Int!
        artist: Artist
    }
    
    type Artist {
        id: ID!
        name: String!
        songs: [Song]!
    }
`;

const resolvers = {
    Query: {
        artists: () => artists,
        artist: (_, { id }) => artists.find(artist => artist.id === id),
        songs: () => songs,
        song: (_, { id }) => songs.find(song => song.id === id)
    },
    Mutation: {
        addArtist: (_, { id, name }) => {
            const artist = { id, name };
            artists.push(artist);
            return artist;
        },
        addSong: (_, { id, name, year, artistId }) => {
            const song = { id, name, year, artistId };
            songs.push(song);
            return song;
        }
    },
    Song: {
        artist: song => artists.find(artist => artist.id === song.artistId)
    },
    Artist: {
        songs: artist => songs.filter(song => song.artistId === artist.id)
    }
};

app.use('/graphql', graphqlHTTP({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    graphiql: true
}));

app.listen(8080, () => console.log('Listening on port 8080'));