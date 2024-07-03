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
                        const nicknameMatch = latestUserData.match(/"nickname":"([^"]+)",/); 
                        const userId = latestUserData.match(/"userId":"([^"]+)",/);
                        const friendCode = latestUserData.match(/"friendCode":"([^"]+)",/);
                        const eloMatch = latestUserData.match(/"elo":(\d+)/);
                        const rankIdMatch = latestUserData.match(/"rankId":(\d+)/);

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
                        const bansMatch = latestUserData.match(/"softBan":\{"liftDate":"[^"]+","count":(\d+),/);

                        const createdAtMatch = latestUserData.match(/"createdAt":"([^"]+)"/);
                let formattedCreatedAt = '';
                if (createdAtMatch) {
                    const createdAtDate = new Date(createdAtMatch[1]);
                    const options = { year: 'numeric', month: 'short', day: 'numeric' };
                    formattedCreatedAt = createdAtDate.toLocaleDateString('en-US', options);
                }

                        return {
                            totalKills: killsMatch ? parseInt(killsMatch[1]) : 0,
                            totalDeaths: deathsMatch ? parseInt(deathsMatch[1]) : 0,
                            ragequits: ragequitsMatch ? parseInt(ragequitsMatch[1]) : 0,
                            nickname: nicknameMatch ? nicknameMatch[1] : '', 
                            userId: userId ? userId[1] : '', 
                            friendCode: friendCode ? friendCode[1] : '', 
                            createdAt: formattedCreatedAt,
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
                            bans: bansMatch ? parseInt(bansMatch[1]) : 0,
                            elo: eloMatch ? parseInt(eloMatch[1]) : 0,
                            rankId: rankIdMatch ? parseInt(rankIdMatch[1]) : 0,
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
                    "DUCK": "Duck Anderson",
                    "CROCODILE": "DJ Newton",
                    "TIGER": "Sable Santana",
                    "DOBERMAN": "Donnie B.",
                    "CAT": "Spike Remington",
                    "COW": "Margarita Kala",
                    "RAT": "Klustr Jr.",
                    "WOODPECKER": "Myk",
                    "HARE": "Haru",
                    "WOLF": "Dale Donovan"
                };


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
                            <p id="character_name">${tileData.character} <img style="width: 48px; height: 48px;" src="characters/${tileData.character}.png" /></p>
                            <p>Total Matches: ${tileData.matches}</p>
                            <p>Wins: ${tileData.victories}</p>
                            <p>Losses: ${tileData.defeats}</p>
                            <p>Ties: ${tileData.ties}</p>
                            <p>Win Ratio: ${tileData.winRatio.toFixed(2)}%</p>
                        `;

                        characterContainer.appendChild(tile);
                    });

                    // Formatting function for packs opened per type
                    function formatPacksOpened(packs) {
                        return packs.map(pack => {
                            let packDescription;
                            switch (pack.id) {
                                case 1:
                                    packDescription = `Basic: ${pack.timesUsed}`;
                                    break;
                                case 2:
                                    packDescription = `Golden: ${pack.timesUsed}`;
                                    break;
                                case 3:
                                    packDescription = `Epic: ${pack.timesUsed}`;
                                    break;
                                case 4:
                                    packDescription =`Legendary: ${pack.timesUsed}`;
                                    break;
                                case 7:
                                    packDescription = `Collectors: ${pack.timesUsed}`;
                                    break;
                                case 100:
                                    const percentage = (pack.timesUsed / 99 * 100).toFixed(2);
                                    packDescription = `Shiny: ${pack.timesUsed}/99 (${percentage}%)`;
                                    break;
                                default:
                                    packDescription = `Unknown Pack ID ${pack.id}`;
                            }
                            return `${packDescription}`;
                        }).join('<br>');
                    }

                    // Function to format packs bought per type
function formatPacksBought(packs) {
    return packs.map(pack => {
        let packDescription;
        switch (pack.id) {
            case 1:
                packDescription = `Basic: ${pack.timesUsed}`;
                break;
            case 2:
                packDescription = `Golden: ${pack.timesUsed}`;
                break;
            default:
                packDescription = `Unknown Pack ID ${pack.id}`;
        }
        return `${packDescription}`;
    }).join('<br>');
}

function formatGachasOpened(gachas) {
    let totalNewGachas = 0;
    let totalOldGachas = 0;

    const gachaDescriptions = gachas.map(gacha => {
        let gachaDescription;
        switch (gacha.id) {
            case 1:
                gachaDescription = `New Gachas: ${gacha.timesUsed}`;
                totalNewGachas += gacha.timesUsed;
                break;
            case 2:
                gachaDescription = `Old Gachas: ${gacha.timesUsed}`;
                totalOldGachas += gacha.timesUsed;
                break;
            default:
                gachaDescription = `Unknown Gacha ID ${gacha.id}`;
        }
        return `${gachaDescription}`;
    });

    const totalGachas = totalNewGachas + totalOldGachas;
    const percentage = ((totalGachas / 197) * 100).toFixed(2);
    const summary = `Altogether: ${totalGachas}/197 (${percentage}%)`;

    gachaDescriptions.push(summary);

    return gachaDescriptions.join('<br>');
}
                    const overallTile = document.getElementById('overallTile');
                    overallTile.innerHTML = ''; // Clear previous content
                    overallTile.classList.add('overall-tile');

                    overallTile.innerHTML = `
                    <p class="overall_stats_titles" style="font-size: 40px;">User Details:</p>
                    <p>Nickname: ${latestUserData.nickname}</p>
                    <p>ELO: ${latestUserData.elo}/10000 <img style="width: 32px; height: 32px;" src="ranks/${latestUserData.rankId}.png"></img></p>
                    <p>User ID: ${latestUserData.userId}</p>
                    <p>Friend Code: ${latestUserData.friendCode}</p>
                    <p>Friend Since: ${latestUserData.createdAt}</p>
                    <p>Bans: ${latestUserData.bans}</p>
                    <p class="overall_stats_titles" style="font-size: 40px;">Total Match Stats:</p>
                    <p>Matches Played: ${totalMatches}</p>
                    <p>Wins: ${totalVictories}</p>
                    <p>Losses: ${totalDefeats}</p>
                    <p>Ties: ${totalTies}</p>
                    <p>Ragequits: ${latestUserData.ragequits}</p>
                    <p>Win Ratio: ${(totalVictories / totalMatches * 100).toFixed(2)}%</p>
                    ${latestUserData ? `
                    <p class="overall_stats_titles" style="font-size: 40px;">K/D Stats:</p>
                    <p>Kills: ${latestUserData.totalKills}</p>
                    <p>Deaths: ${latestUserData.totalDeaths}</p>
                    <p> KD Ratio: ${(latestUserData.totalKills / latestUserData.totalDeaths).toFixed(2)}</p>
                    <p class="overall_stats_titles" style="font-size: 40px;">Wealth Stats:</p>
                    <p>Money Earned: ${latestUserData.lifetimeMoneyEarned}</p>
                    <p>Money Spent: ${latestUserData.lifetimeMoneySpent}</p>
                    <p>Gems Earned: ${latestUserData.lifetimeGemsEarned}</p>
                    <p>Gems Spent: ${latestUserData.lifetimeGemsSpent}</p>
                    <p class="overall_stats_titles" style="font-size: 40px;">Packs Bought:</p>
                    <p>${formatPacksBought(latestUserData.packsBoughtPerType)}</p>
                    <p class="overall_stats_titles" style="font-size: 40px;">Packs Opened:</p>
                    <p>${formatPacksOpened(latestUserData.packsOpenedPerType)}</p>
                    <p class="overall_stats_titles" style="font-size: 40px;">Gachas Opened:</p>
                    <p>${formatGachasOpened(latestUserData.gachasOpenedPerType)}</p>
                    ` : ''}
                `;
       

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
