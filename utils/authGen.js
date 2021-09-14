exports.generateUniqueId = () => {
    const timestamps = (new Date().getTime() + new Date().getTime());
    const hexStr = timestamps.toString(16);
    return hexStr.toString().toUpperCase();
}

exports.generatePassword = (length) => {
    return Math.random().toString(20).substr(2, length).toUpperCase()
}