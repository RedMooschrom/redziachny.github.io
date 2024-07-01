document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fileInput').addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const text = e.target.result;

                // Function to parse the latest user data section
                function parseLatestUserData(text) {
                    const userPattern = /{"code":0,"user":/g;
                    let match;
                    let lastIndex = -1;

                    // Find the highest index of the user data
                    while ((match = userPattern.exec(text)) !== null) {
                        lastIndex = match.index;
                    }

                    if (lastIndex !== -1) {
                        const latestUserData = text.substring(lastIndex);
                        const killsMatch = latestUserData.match(/"totalKills":(\d+),/);
                        const deathsMatch = latestUserData.match(/"totalDeaths":(\d+),/);
                        const ragequitsMatch = latestUserData.match(/"ragequits":(\d+),/);
                        const nicknameMatch = latestUserData.match(/"nickname":"([^"]+)",/); // New line to match nickname

                        // Parse additional variables
                        const lifetimeGemsSpentMatch = latestUserData.match(/"lifetimeGemsSpent":(\d+),/);
                        const lifetimeMoneySpentMatch = latestUserData.match(/"lifetimeMoneySpent":(\d+),/);
                        const lifetimeGemsEarnedMatch = latestUserData.match(/"lifetimeGemsEarned":(\d+),/);
                        const lifetimeMoneyEarnedMatch = latestUserData.match(/"lifetimeMoneyEarned":(\d+),/);
                        const lifetimeGachasOpenedMatch = latestUserData.match(/"lifetimeGachasOpened":(\d+),/);
                        
                        const packsBoughtPerTypeMatch = latestUserData.match(/"packsBoughtPerType":(\[{"id":\d+,"timesUsed":\d+}(?:,{"id":\d+,"timesUsed":\d+})*\])/);
                        const packsOpenedPerTypeMatch = latestUserData.match(/"packsOpenedPerType":(\[{"id":\d+,"timesUsed":\d+}(?:,{"id":\d+,"timesUsed":\d+})*\])/);
                        const gachasOpenedPerTypeMatch = latestUserData.match(/"gachasOpenedPerType":(\[{"id":\d+,"timesUsed":\d+}(?:,{"id":\d+,"timesUsed":\d+})*\])/);

                        // Parse lifetime stats
                        const totalMatchesMatch = latestUserData.match(/"totalMatches":(\d+),/);
                        const lifetimeVictoriesMatch = latestUserData.match(/"lifetimeVictories":(\d+),/);
                        const lifetimeDefeatsMatch = latestUserData.match(/"lifetimeDefeats":(\d+),/);
                        const lifetimeTiesMatch = latestUserData.match(/"lifetimeTies":(\d+),/);

                        return {
                            totalKills: killsMatch ? parseInt(killsMatch[1]) : 0,
                            totalDeaths: deathsMatch ? parseInt(deathsMatch[1]) : 0,
                            ragequits: ragequitsMatch ? parseInt(ragequitsMatch[1]) : 0,
                            nickname: nicknameMatch ? nicknameMatch[1] : '', // Include nickname in the return object
                            lifetimeGemsSpent: lifetimeGemsSpentMatch ? parseInt(lifetimeGemsSpentMatch[1]) : 0,
                            lifetimeMoneySpent: lifetimeMoneySpentMatch ? parseInt(lifetimeMoneySpentMatch[1]) : 0,
                            lifetimeGemsEarned: lifetimeGemsEarnedMatch ? parseInt(lifetimeGemsEarnedMatch[1]) : 0,
                            lifetimeMoneyEarned: lifetimeMoneyEarnedMatch ? parseInt(lifetimeMoneyEarnedMatch[1]) : 0,
                            lifetimeGachasOpened: lifetimeGachasOpenedMatch ? parseInt(lifetimeGachasOpenedMatch[1]) : 0,
                            packsBoughtPerType: packsBoughtPerTypeMatch ? JSON.parse(packsBoughtPerTypeMatch[1]) : [],
                            packsOpenedPerType: packsOpenedPerTypeMatch ? JSON.parse(packsOpenedPerTypeMatch[1]) : [],
                            gachasOpenedPerType: gachasOpenedPerTypeMatch ? JSON.parse(gachasOpenedPerTypeMatch[1]) : [],
                            totalMatches: totalMatchesMatch ? parseInt(totalMatchesMatch[1]) : 0,
                            lifetimeVictories: lifetimeVictoriesMatch ? parseInt(lifetimeVictoriesMatch[1]) : 0,
                            lifetimeDefeats: lifetimeDefeatsMatch ? parseInt(lifetimeDefeatsMatch[1]) : 0,
                            lifetimeTies: lifetimeTiesMatch ? parseInt(lifetimeTiesMatch[1]) : 0,
                            latestUserData: latestUserData // Include the latest user data section for further parsing
                        };
                    }

                    return null;
                }

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

                // Parse latest user data
                const latestUserData = parseLatestUserData(text);

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

                // Parse character-specific data from the latest user data section
                if (latestUserData && latestUserData.latestUserData) {
                    Object.keys(characterMap).forEach(character => {
                        const regex = new RegExp(`{"id":"${character}","unlockStatus":\\d+,"currentSkin":\\d+,"unlockedSkins":\\[[^\\]]*\\],"matches":(\\d+),"victories":(\\d+),"defeats":(\\d+),"ties":(\\d+)}`);
                        const match = latestUserData.latestUserData.match(regex);

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
                }

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
                        <p>Nickname: ${latestUserData.nickname}</p>
                        <p>Total Matches: ${totalMatches}</p>
                        <p>Total Wins: ${totalVictories}</p>
                        <p>Total Losses: ${totalDefeats}</p>
                        <p>Total Ties: ${totalTies}</p>
                        <p>Overall Win Ratio: ${(totalVictories / totalMatches * 100).toFixed(2)}%</p>
                        ${latestUserData ? `
                        <p>Total Kills: ${latestUserData.totalKills}</p>
                        <p>Total Deaths: ${latestUserData.totalDeaths}</p>
                        <p>Ragequits: ${latestUserData.ragequits}</p>
                        <p>Money Earned: ${latestUserData.lifetimeMoneyEarned}</p>
                        <p>Money Spent: ${latestUserData.lifetimeMoneySpent}</p>
                        <p>Gems Earned: ${latestUserData.lifetimeGemsEarned}</p>
                        <p>Gems Spent: ${latestUserData.lifetimeGemsSpent}</p>
                        <p>Gachas Opened: ${latestUserData.lifetimeGachasOpened}</p>
                        <p>Packs Bought Per Type: ${JSON.stringify(latestUserData.packsBoughtPerType)}</p>
                        <p>Packs Opened Per Type: ${JSON.stringify(latestUserData.packsOpenedPerType)}</p>
                        <p>Gachas Opened Per Type: ${JSON.stringify(latestUserData.gachasOpenedPerType)}</p>
                        ` : ''}
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
