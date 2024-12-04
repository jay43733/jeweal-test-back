const convertNumber = (data, fields) => {
  return data.map((item) => {
    const convertedItem = { ...item };
    fields.forEach((field) => {
      if (convertedItem[field] !== undefined && convertedItem[field] !== null) {
        convertedItem[field] = parseFloat(convertedItem[field]);
      }
    });
    return convertedItem;
  });
};

module.exports = convertNumber;
