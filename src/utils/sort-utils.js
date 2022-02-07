export const sortQuestionsbyOrder = (questions) => {
  const sortirani = questions.sort((aquestion, bquestion) => {
    const a = aquestion.attributes.order;
    const b = bquestion.attributes.order;
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });
  return sortirani;
};
