import axios from 'axios'

/*
     * Calculates the rating algorithm based on the given teams and scores.
     *
     * @param {Array} team_A - An array representing the userIDs of team A
     * @param {Array} team_B - An array representing the userIDs of team B
     * @param {number} score_A - The score for Team A.
     * @param {number} score_B - The score for Team B.
     * @returns {Promise<number>} - Returns a Promise that resolves to the calculated average overall rating change per team. 
     * 
     * An example exists below at the return statement
    */
export default async function ratingAlgorithm( team_A, team_B, score_A, score_B ) {
    const team_A_values = Object.values(team_A).join(',');
    const team_B_values = Object.values(team_B).join(',');

    const team_A_JSON = await axios.get('https://hoop-easy-production.up.railway.app/api/teamData', {
        params: {
          values: team_A_values
        }
    })

    const team_B_JSON = await axios.get('https://hoop-easy-production.up.railway.app/api/teamData', {
        params: {
          values: team_B_values
        }
    })

    console.log(team_A, team_B)

    const team_A_array = team_A_JSON.data;
    const team_B_array = team_B_JSON.data;
    
    const team_A_overalls = team_A_array.map((obj) => parseFloat(obj.overall));
    const team_B_overalls = team_B_array.map((obj) => parseFloat(obj.overall));
    
    const team_A_games_played = team_A_array.map((obj) => parseInt(obj.gamesPlayed) + 1);
    const team_B_games_played = team_B_array.map((obj) => parseInt(obj.gamesPlayed) + 1);
    
    const team_A_average_overall = team_A_overalls.reduce((a, b) => a + b) / team_A_overalls.length;
    const team_B_average_overall = team_B_overalls.reduce((a, b) => a + b) / team_B_overalls.length;
    
    const team_A_average_games_played = team_A_games_played.reduce((a, b) => a + b) / team_A_games_played.length;
    const team_B_average_games_played = team_B_games_played.reduce((a, b) => a + b) / team_B_games_played.length;
    

    let R_A, R_B, Q_A, Q_B, E_A, E_B, S_A, S_B, new_R_A, new_R_B
    const c = 400

    R_A = team_A_average_overall
    R_B = team_B_average_overall

    Q_A = 10**(R_A/c)
    Q_B = 10**(R_B/c)

    E_A = Q_A/(Q_A + Q_B)
    E_B = 1 - E_A

    if ( parseInt(score_A) > parseInt(score_B) ) {
        S_A = 1
        S_B = 0
    } else if ( score_B > score_A ) {
        S_A = 0
        S_B = 1
    } else {
        S_A= 0
        S_B = 0
    }

    function calculate_k_scale(games_played) {
        const k_scaler = { 10: 4, 25: 2, 50: 1, 100: 0.5 };
    
        for (const threshold in k_scaler) {
            if (games_played <= parseInt(threshold)) {
                return k_scaler[threshold];
            }
        }
        if ( games_played >= 100 ) {
            return 0.3
        }
        return null
    }

    function calculate_l_scale(games_played) {
        const l_scaler = { 10: 2, 25: 1, 50: 0.5, 100: 0.25 };
    
        for (const threshold in l_scaler) {
            if (games_played <= parseInt(threshold)) {
                return l_scaler[threshold];
            }
        }

        if ( games_played >= 100 ) {
            return 0.2
        }
        return null; 
    }

    // Calculating K
    let team_A_games = team_A_average_games_played
    let team_B_games = team_B_average_games_played
    let k_A = calculate_k_scale(team_A_games)
    let k_B = calculate_k_scale(team_B_games)
    let l_A = calculate_l_scale(team_A_games)
    let l_B = calculate_l_scale(team_B_games)

    new_R_A = R_A + k_A*(S_A-E_A) + l_A*(score_A/(score_A + score_B)) 
    new_R_B = R_B + k_B*(S_B-E_B) + l_B*(score_B/(score_A + score_B))
    
    new_R_A = Number.parseFloat(new_R_A).toFixed(2)
    new_R_B = Number.parseFloat(new_R_B).toFixed(2)

    const team_A_average_overall_delta = (new_R_A - team_A_average_overall).toFixed(2)
    const team_B_average_overall_delta = (new_R_B - team_B_average_overall).toFixed(2)

    /*
    Example:

    If team A has an average overall rating of 60 overall and they lost 5 to 21.
    The algorithm would find that the new overall rating for the team A would be 58.2.
    This means that the average change (delta) would be around -1.8 for team A! 

    We can use this information to generalize the overall score change based on this
    delta for everyone on team A.

    If player_x had an overall rating of 70 and was on team A --> their overall score is now 68.2 :)
    */

    return { team_A_average_overall_delta, team_B_average_overall_delta }
} /* ratingAlgorithm() */