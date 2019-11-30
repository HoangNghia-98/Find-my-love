var generateMessage = (from, text) => {
  return {
    message,
    from,
    createAt: new Date()
  };
};

module.exports = {
  generateMessage
};
