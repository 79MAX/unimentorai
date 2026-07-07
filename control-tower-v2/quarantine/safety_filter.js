function filterResponse(response) {
    const bannedWords = ["hack", "exploit"];
    let clean = response;

    bannedWords.forEach(word => {
        clean = clean.replace(new RegExp(word, 'gi'), "***");
    });

    return clean;
}

module.exports = { filterResponse };
