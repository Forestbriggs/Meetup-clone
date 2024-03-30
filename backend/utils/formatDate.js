const formatDate = (date) => {
    const splitDate = date.toISOString().split('T');
    const newDate = splitDate[0] + ' ' + (splitDate[1].split('.')[0]);
    return newDate;
}

module.exports = {
    formatDate
}