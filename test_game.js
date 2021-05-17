newDeck = [11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44,51,52,53,54,61,62,63,64,71,72,73,74,81,82,83,84,91,92,93,94,101,102,103,104,111,112,113,114,121,122,123,124];

console.log("山札確認", newDeck);

m_hands = []
e_hands = []
field =[]

while (m_hands.length < 8) {
    n = newDeck.length;
    k = Math.floor(Math.random() * n);
  
    m_hands.push(newDeck[k]);
    newDeck.splice(k, 1);
}

console.log("自手札！", m_hands);

while (e_hands.length < 8) {
    n = newDeck.length;
    k = Math.floor(Math.random() * n);
  
    e_hands.push(newDeck[k]);
    newDeck.splice(k, 1);
}

console.log("敵手札！", e_hands);

while (field.length < 8) {
    n = newDeck.length;
    k = Math.floor(Math.random() * n);
  
    field.push(newDeck[k]);
    newDeck.splice(k, 1);
}

console.log("場札！", field);

console.log("山札再確認", newDeck);