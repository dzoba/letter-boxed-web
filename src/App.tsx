import React, { useState, useEffect } from 'react';

function App() {
  const [A, setA] = useState<Set<string>>(new Set());
  const [B, setB] = useState<Set<string>>(new Set());
  const [C, setC] = useState<Set<string>>(new Set());
  const [D, setD] = useState<Set<string>>(new Set());
  const [longestWord, setLongestWord] = useState<string>('');
  const [mostDistinctWord, setMostDistinctWord] = useState<string>('');
  const [bestPair, setBestPair] = useState<[string, string]>(['', '']);
  const [bestTriple, setBestTriple] = useState<[string, string, string]>(['', '', '']);
  const [processed, setProcessed] = useState<boolean>(false);
  const [wordList, setWordList] = useState<string[]>([]);

  useEffect(() => {
    const fetchWordList = async () => {
      const baseUrl = import.meta.env.MODE === 'production' ? import.meta.env.BASE_URL : '';

      const response = await fetch(`${baseUrl}words.txt`);

      const text = await response.text();
      setWordList(text.split('\n'));
    };

    fetchWordList();
  }, []);

  const onChangeA = (event: React.ChangeEvent<HTMLInputElement>) => {
    setA(new Set(event.target.value.split('').map((value) => value.trim())));

  };

  const onChangeB = (event: React.ChangeEvent<HTMLInputElement>) => {
    setB(new Set(event.target.value.split('').map((value) => value.trim())));
  };

  const onChangeC = (event: React.ChangeEvent<HTMLInputElement>) => {
    setC(new Set(event.target.value.split('').map((value) => value.trim())));
  };

  const onChangeD = (event: React.ChangeEvent<HTMLInputElement>) => {
    setD(new Set(event.target.value.split('').map((value) => value.trim())));
  };

  const handleClick = () => {
    const allLetters = new Set([...A, ...B, ...C, ...D]);
    const words: string[] = wordList;

    function isValidWord(word: string): boolean {
      if (!word) return false;

      let prevSet: Set<string> | null = null;
      // debugger
      for (const letter of word) {
        if (!allLetters.has(letter)) {
          return false;
        }

        let currentSet: Set<string> | null = null;
        if (A.has(letter)) currentSet = A;
        else if (B.has(letter)) currentSet = B;
        else if (C.has(letter)) currentSet = C;
        else if (D.has(letter)) currentSet = D;

        if (prevSet === currentSet) {
          return false;
        }

        prevSet = currentSet;
      }

      return true;
    }

    function countDistinctLetters(word: string): number {
      const usedLetters = new Set<string>();
      for (const letter of word) {
        usedLetters.add(letter);
      }
      return usedLetters.size;
    }

    function countDistinctLettersInPairs(...words: string[]): number {
      const combinedWord = words.join('');
      return countDistinctLetters(combinedWord);
    }

    const acceptableWords: string[] = words.filter(isValidWord);

    let longestWord = '';
    let mostDistinctWord = '';
    let maxDistinctLetters = 0;
    let bestPair: [string, string] = ['', ''];
    let maxDistinctLettersInPair = 0;
    let bestTriple: [string, string, string] = ['', '', ''];
    let maxDistinctLettersInTriple = 0;

    for (const word of acceptableWords) {
      if (word.length > longestWord.length) {
        longestWord = word;
      }

      const distinctLetters = countDistinctLetters(word);
      if (distinctLetters > maxDistinctLetters) {
        maxDistinctLetters = distinctLetters;
        mostDistinctWord = word;
      }

      // Find pairs of words
      const lastLetter = word[word.length - 1];
      const matchingWords = acceptableWords.filter((w) => w[0] === lastLetter);
      for (const match of matchingWords) {
        const distinctLettersInPair = countDistinctLettersInPairs(word, match);
        if (distinctLettersInPair > maxDistinctLettersInPair) {
          maxDistinctLettersInPair = distinctLettersInPair;
          bestPair = [word, match];
        }
      }
    }

    if (maxDistinctLettersInPair < allLetters.size) {
      for (const [word1, word2] of [bestPair]) {
        const lastLetter = word2[word2.length - 1];
        const matchingWords = acceptableWords.filter((w) => w[0] === lastLetter);
        for (const match of matchingWords) {
          const distinctLettersInTriple = countDistinctLettersInPairs(word1, word2, match);
          if (distinctLettersInTriple > maxDistinctLettersInTriple) {
            maxDistinctLettersInTriple = distinctLettersInTriple;
            bestTriple = [word1, word2, match];
          }
        }
      }
    }

    // Replace console.log() statements with your desired output display method
    console.log(`Number of acceptable words: ${acceptableWords.length}`);
    console.log(`Longest acceptable word: ${longestWord}`);
    setLongestWord(longestWord);
    console.log(`Word with most distinct letters: ${mostDistinctWord}`);
    setMostDistinctWord(mostDistinctWord);

    if (maxDistinctLettersInPair === allLetters.size) {
      console.log(`Word pair covers all distinct letters: (${bestPair[0]}, ${bestPair[1]})`);
      setBestPair(bestPair);
    } else {
      console.log(`Word triple with most distinct letters: (${bestTriple[0]}, ${bestTriple[1]}, ${bestTriple[2]})`);
      setBestTriple(bestTriple);
    }

    setProcessed(true);
  };

  return (
    <div className="bg-white px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Letter Boxed Helper</h2>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Put letters from each side of the box in the corresponding set. Only put letters; no spaces or commas.
        </p>
        <div className=" flex flex-col">

          <div className="mt-4">
            <label htmlFor="setA" className="text-sm font-medium leading-6 text-gray-900">
              Top
            </label>
            <div className="">
              <input
                maxLength={3}
                id="setA"
                name="setA"
                onChange={onChangeA}
                className="pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="setB" className="text-sm font-medium leading-6 text-gray-900">
              Bottom
            </label>
            <div className="">
              <input
                maxLength={3}
                id="setB"
                name="setB"
                onChange={onChangeB}
                className="pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="setC" className="text-sm font-medium leading-6 text-gray-900">
              Left
            </label>
            <div className="">
              <input
                maxLength={3}
                id="setC"
                name="setC"
                onChange={onChangeC}
                className="pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="setD" className="text-sm font-medium leading-6 text-gray-900">
              Right
            </label>
            <div className="">
              <input
                maxLength={3}
                id="setD"
                name="setD"
                onChange={onChangeD}
                className="pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>


          <div>
            <button
              className="rounded-md mt-5 bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              style={{ width: 'fit-content' }}
              onClick={handleClick}>
              Analyze
            </button>
          </div>

          {processed && (
            <div className="mt-5">
              <div className="text-sm font-medium leading-6 text-gray-900">
                Results:
                <p>Longest word: <span className="font-light">{longestWord}</span></p>
                <p>Word with most distinct letters: <span className="font-light">{mostDistinctWord}</span></p>
                {bestPair && (
                  <p>Word pair covering most distinct letters: <span className="font-light whitespace-nowrap">{bestPair[0]} {`->`} {bestPair[1]}</span></p>
                )}
                {bestTriple[0] !== '' && (
                  <p>Word triple covering most distinct letters: <span className="font-light whitespace-nowrap">{bestTriple[0]} {`->`} {bestTriple[1]} {`->`} {bestTriple[2]}</span></p>
                )}
              </div>
            </div>

          )}

        </div>
      </div>
    </div>
  );
}

export default App;
