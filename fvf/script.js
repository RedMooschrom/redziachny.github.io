// JavaScript file for handling file input and sorting character tiles

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fileInput').addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const text = e.target.result;

                const keyMap = {
                    "totalMatches": "Total Matches",
                    "lifetimeVictories": "Lifetime Victories",
                    "lifetimeDefeats": "Lifetime Defeats",
                    "lifetimeTies": "Lifetime Ties",
                    "lifetimePacksBought": "Lifetime Packs Bought",
                    "lifetimePacksOpened": "Lifetime Packs Opened",
                    "lifetimeGachasOpened": "Lifetime Gachas Opened",
                    "lifetimeMoneyEarned": "Lifetime Money Earned",
                    "lifetimeGemsEarned": "Lifetime Gems Earned",
                    "lifetimeMoneySpent": "Lifetime Money Spent",
                    "lifetimeGemsSpent": "Lifetime Gems Spent"
                };

                const characterMap = {
                    "TOAD": "Ribberto Mulligan",
                    "POLARBEAR": "Lars",
                    "DINGO": "Dingo",
                    "MOOSE": "Moose Salto",
                    "SEAGULL": "Stevie Gull",
                    "DUCK": "Duck Anderson ",
                    "CROCODILE": "DJ Newton",
                    "TIGER": "Sable Santana",
                    "DOBERMAN": "Donnie B.",
                    "CAT": "Spike Remington",
                    "COW": "Margarita Kala",
                    "RAT": "Klustr Jr.",
                    "WOODPECKER": "Myk",
                    "HARE": "Haru",
                    "WOLF": "Dane Donovan"
                };

                const values = {};

                // Parse general key data
                Object.keys(keyMap).forEach(key => {
                    const regex = new RegExp(`"${key}":(\\d+),`);
                    const match = text.match(regex);

                    if (match) {
                        values[key] = parseInt(match[1]);
                    }
                });

                // Container for character tiles
                const characterContainer = document.getElementById('characterContainer');
                characterContainer.innerHTML = ''; // Clear previous content

                // Calculate overall statistics
                let totalMatches = 0;
                let totalVictories = 0;
                let totalDefeats = 0;
                let totalTies = 0;

                // Array to store character tiles
                let characterTiles = [];

                // Parse character-specific data and create tiles
                Object.keys(characterMap).forEach(character => {
                    const regex = new RegExp(`{"id":"${character}","unlockStatus":\\d+,"currentSkin":\\d+,"unlockedSkins":\\[[^\\]]*\\],"matches":(\\d+),"victories":(\\d+),"defeats":(\\d+),"ties":(\\d+)}`);
                    const match = text.match(regex);

                    if (match) {
                        const matches = parseInt(match[1]);
                        const victories = parseInt(match[2]);
                        const defeats = parseInt(match[3]);
                        const ties = parseInt(match[4]);

                        totalMatches += matches;
                        totalVictories += victories;
                        totalDefeats += defeats;
                        totalTies += ties;

                        const winRatio = victories / matches * 100;

                        // Create tile object
                        const tile = {
                            character: characterMap[character],
                            matches: matches,
                            victories: victories,
                            defeats: defeats,
                            ties: ties,
                            winRatio: winRatio
                        };

                        characterTiles.push(tile);
                    }
                });

                // Sorting function
function sortTiles(criteria) {
    characterTiles.sort((a, b) => {
        switch (criteria) {
            case 'mostWins':
                return b.victories - a.victories;
            case 'leastWins':
                return a.victories - b.victories;
            case 'mostLosses':
                return b.defeats - a.defeats;
            case 'leastLosses':
                return a.defeats - b.defeats;
            case 'bestWinRatio':
                return b.winRatio - a.winRatio;
            case 'worstWinRatio':
                return a.winRatio - b.winRatio;
            case 'mostTies':
                return b.ties - a.ties;
            case 'leastTies':
                return a.ties - b.ties;
            case 'mostMatches':
                return b.matches - a.matches;
            case 'leastMatches':
                return a.matches - b.matches;
            default:
                return 0;
        }
    });

    // Clear container
    characterContainer.innerHTML = '';

    // Re-append sorted tiles
    characterTiles.forEach(tileData => {
        const tile = document.createElement('div');
        tile.classList.add('character-tile');

        tile.innerHTML = `
            <p id="character_name">${tileData.character}<p>
            <p>Total Matches: ${tileData.matches}</p>
            <p>Wins: ${tileData.victories}</p>
            <p>Losses: ${tileData.defeats}</p>
            <p>Ties: ${tileData.ties}</p>
            <p>Win Ratio: ${tileData.winRatio.toFixed(2)}%</p>
        `;

        characterContainer.appendChild(tile);
    });

    // Update overall statistics after sorting
    const overallTile = document.createElement('div');
    overallTile.classList.add('overall-tile');

    overallTile.innerHTML = `
        <p id="overall_stats">Overall Statistics<p>
        <p>Total Matches: ${totalMatches}</p>
        <p>Total Wins: ${totalVictories}</p>
        <p>Total Losses: ${totalDefeats}</p>
        <p>Total Ties: ${totalTies}</p>
        <p>Overall Win Ratio: ${(totalVictories / totalMatches * 100).toFixed(2)}%</p>
    `;

    characterContainer.appendChild(overallTile);
}


                // Sort by default (e.g., most wins)
                sortTiles('mostWins');

                // Add event listener for sort select dropdown
                document.getElementById('sortCriteria').addEventListener('change', function() {
                    const criteria = this.value;
                    sortTiles(criteria);
                });
            };

            reader.readAsText(file);
        } else {
            console.log('No file selected.');
        }
    });
});
