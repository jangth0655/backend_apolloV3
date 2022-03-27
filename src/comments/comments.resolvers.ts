const resolver = {
  Comment: {
    isMine: ({ userId }, _, { loggedInUser }) =>
      loggedInUser.id ? userId === loggedInUser.id : false,
  },
};

export default resolver;
