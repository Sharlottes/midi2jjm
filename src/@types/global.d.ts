interface JJMData {
  displayName: string;
  description: string;
  songAuthor: string;
  midiAuthor: string;
  releaseYear: string;
  genre: string;
  coverColor: string;
  coverColor2: string;
  difficulty: number;
  channelSuggestedInstrument: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
  channelHidden: [
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean
  ];
  targetAccuracy: [number, number, number, number];
  midiFileName: string;
  revision: 2;
}
