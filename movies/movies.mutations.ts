import client from "../client";

export default {
  Mutation: {
    createMovie: (_: any, { title, year, genre }) =>
      client.movie.create({
        data: {
          title,
          year,
          genre,
        },
      }),
    deleteMovie: (_, { id }) => client.movie.delete({ where: { id } }),
    updateMovie: (_, { year, id }) =>
      client.movie.update({ where: { id }, data: { year } }),
  },
};