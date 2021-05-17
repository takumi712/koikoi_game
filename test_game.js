const cardList = [
    [1-1,1-3,14-1,14-2],
    [2-2,2-3,2-41,2-42],
    [3-1,3-3,3-41,3-42],
    [4-2,4-3,4-41,4-42],
    [5-2,5-3,5-41,5-42],
    [6-2,6-3,6-41,6-42],
    [7-2,7-3,7-41,7-42],
    [8-1,8-3,8-41,8-42],
    [9-2,93,941,942],
    [10-2,10-3,10-41,10-42],
    [11-1,12-3,11-41,11-42],
    [12-1,1241,12-42,12-42]
  ];
class Deck {
    start_shuffle(options = {}) {
        this._deck = [...cardList];
        //山札シャッフル
        this._deck.sort((a, b) => Math.random() - 0.5);
    }
    deal(num) {
        return this._deck.splice(0, num);
    }
}
(function startGame() {
    //敵と自分の手札と場札を生成
    const deck = new Deck();
    var m_hands = deck.deal(8);
    var e_hands = deck.deal(8);
    var filed = deck.deal(8);
  })();