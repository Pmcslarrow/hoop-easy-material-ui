// @input: ['2', '3']
// @return: '{"teammate0": "1", "teammate1": "2"}'
const createTeammateJsonFromArray = (array) => {
    const jsonArray = []
    for (let i=0; i<array.length; i++) {
        if (array[i] !== undefined) {
            const string = `"teammate${i}": "${array[i]}"`
            jsonArray.push(string)
        }
    }
    const jsonInside = jsonArray.join(', ')
    const json = '{' + jsonInside + '}'
    return json
}

const createTeammateArrayFromJson = (object) => {
    return Object.values(object)
}

const createCaptainJsonFromArray = (array) => {
    const jsonArray = []
    for (let i=0; i<array.length; i++) {
        if (array[i] !== undefined) {
            const string = `"captain${i}": "${array[i]}"`
            jsonArray.push(string)
        }
    }
    const jsonInside = jsonArray.join(', ')
    const json = '{' + jsonInside + '}'
    return json
}

const createScoreJsonFromArray = (array) => {
    const jsonArray = []
    for (let i=0; i<array.length; i++) {
        if (array[i] !== undefined) {
            const string = `"team${i+1}": "${array[i]}"`
            jsonArray.push(string)
        }
    }
    const jsonInside = jsonArray.join(', ')
    const json = '{' + jsonInside + '}'
    return json
}

const createTeamJsonFromArray = (array) => {
    const jsonArray = []
    for (let i=0; i<array.length; i++) {
        if (array[i] !== undefined) {
            const string = `"player${i}": "${array[i]}"`
            jsonArray.push(string)
        }
    }
    const jsonInside = jsonArray.join(', ')
    const json = '{' + jsonInside + '}'
    return json
}

export { createTeammateArrayFromJson, createTeammateJsonFromArray, createCaptainJsonFromArray, createScoreJsonFromArray, createTeamJsonFromArray }