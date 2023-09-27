import { contents } from '../sample-data/contents';
import { writeFile } from 'fs/promises'
// import { writeFileSync } from 'fs';



async function createInvertedIndex(contents: Record<string, string>) {
    
    const data: Map<string, Array<string>> = new Map();

    for (const key in contents) {
        const value: string = contents[key];

        const words: Array<string> = value.split(/[ ,.]+|\s+/);

        for (const word of words) {
            const lowercaseWord = word.toLowerCase();

            if (!data.has(lowercaseWord)) {
                data.set(lowercaseWord, [])
            }

            if (!data.get(lowercaseWord)!.includes(key)) {
                data.get(lowercaseWord)!.push(key);
            }
        }

    }

    const result = JSON.stringify(Object.fromEntries(data));

    // write as file to see theresult
    // await writeFile('./sample-data/contents-inverted-index.json', result);

    return result;

}

async function queryTopFive(query: string, invertedIndexResult: any): Promise<Array<string>> {
    const queryTerm = query.split(/[ ,]+|\s+/);

    let extractedData = 0;
    let resultContent = new Set<string>();

    for (const partQuery of queryTerm) {
        if(invertedIndexResult[partQuery]){

            for (const idContent of invertedIndexResult[partQuery]) {
                
                resultContent.add(idContent);
                extractedData++;
    
                if (extractedData >= 5) {
                    break;
                }
            }
    
            if (extractedData >= 5) {
                break;
            }
        }


    }

    const result: Array<string> = [...resultContent]
    return result.map(( id: string ) => contents[id]);
}

async function process() {
    const invertedIndex = await createInvertedIndex(contents);

    const query = 'okay';
    const result = await queryTopFive(query, JSON.parse(invertedIndex));

    console.log('query  search: ', query);
    console.log('result', result);

}

process();


