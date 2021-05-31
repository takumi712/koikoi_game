newDeck = [11,13,14,15,22,23,24,25,31,33,34,35,42,43,44,45,52,53,54,55,62,63,64,65,72,73,74,75,81,82,84,85,92,93,94,95,102,103,104,105,111,112,114,115,121,124,125,126];
//10で割った時に同じ商かどうかで判定、余りの値で役を判定
//一の桁が1:20点札,2:10点札,3:5点札,4<=:1点札
console.log("山札確認", newDeck);

m_hands = []
e_hands = []
field =[]
m_yaku=[]
e_yaku=[]
m_point=0;
e_point=0;
function onClick(e) {
    console.log("click");
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    console.log("x:", x, "y:", y);
}
canvas.addEventListener('click', onClick, false);
while (m_hands.length < 8) {
    n = newDeck.length;//山札の枚数
    k = Math.floor(Math.random() * n);//山札の枚数をもとに乱数生成
  
    m_hands.push(newDeck[k]);//札を増やす
    newDeck.splice(k, 1);//山札から減らす
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
function m_turn(){
    //出す手札の番号をもらう処理を書く(pに入れる)
    pick=m_hands[p];
    m_hands.splice(p, 1);

    f=field.length;
    check=0;
    check_card=[3];
    //場札の数だけ繰り返す
    for(step=0;step<f;step++){
        //指定中の場札が選択された手札と10で割ったときの商が同じかどうか
        if(field[step]/10==pick/10){
            check_card[check]=field[step];
            check++;
        }
    }

    //0だったら場札を増やすのみ
    if(check==0){
        field.push(pick);
    }
    //0だったら場札を増やすのみ
    else if(check==1){
        m_yaku.push(check_card[0]);
        m_yaku.push(pick);
    }
    else if(check>=2){
        //出す手札の番号をもらう処理を書く(pに入れる)
        m_yaku.push(check_card[p]);
        m_yaku.push(pick);
    }    
}
function e_turn(){
    //出す手札の番号をもらう処理を書く(pに入れる)
    pick=e_hands[p];
    e_hands.splice(p, 1);

    f=field.length;
    check=0;
    check_card=[3];
    //場札の数だけ繰り返す
    for(step=0;step<f;step++){
        //指定中の場札が選択された手札と10で割ったときの商が同じかどうか
        if(field[step]/10==pick/10){
            check_card[check]=field[step];
            check++;
        }
    }

    //0だったら場札を増やすのみ
    if(check==0){
        field.push(pick);
    }
    //0だったら場札を増やすのみ
    else if(check==1){
        e_yaku.push(check_card[0]);
        e_yaku.push(pick);
    }
    else if(check>=2){
        //出す手札の番号をもらう処理を書く(pに入れる)
        e_yaku.push(check_card[p]);
        e_yaku.push(pick);
    }    
}
function m_yaku_check(){
    gokou=[]
    gokou_p=0;
    tane=[]
    tane_p=0;
    inosika=[]
    inosika_p=0;
    tan=[]
    tan_p=0;
    aka=[]
    aka_p=0;
    ao=[]
    ao_p=0;
    kasu=[]
    kasu_p=0;
    //札分け
    for(i=0;i<m_yaku.length;i++){
        //20点札
        if(m_yaku[i]%10==1){
            gokou.push(m_yaku[i]);
        }
        //10点札
        else if(m_yaku[i]%10==2){
            tane.push(m_yaku[i]);
            //猪鹿蝶
            if(m_yaku[i]/10==6||m_yaku[i]/10==7||m_yaku[i]/10==10){
                inosika.push(m_yaku[i]);
            }
        }
        //5点札
        else if(m_yaku[i]%10==3){
            tan.push(m_yaku[i]);
            //赤短
            if(m_yaku[i]/10==1||m_yaku[i]/10==2||m_yaku[i]/10==3){
                aka.push(m_yaku[i]);
            }
            //青短
            else if(m_yaku[i]/10==6||m_yaku[i]/10==9||m_yaku[i]/10==10){
                ao.push(m_yaku[i]);
            }
        }
        //カス
        else{
            kasu.push(m_yaku[i]);
        }
    }
    //チェック
    //三光、雨入りチェック
    if(gokou.length==3){
        for(i=0;i<3;i++){
            if(gokou[i]==111){
                break;
            }
            gokou_p++;
        }
    }
    //四光、雨入りチェック
    else if(gokou.length==4){
        for(i=0;i<4;i++){
            if(gokou[i]==111){
                gokou+=10;
            }
            gokou_p++;
        }
    }
    //五光確定
    else if(gokou.length==5){
        gokou_p=5;
    }
    //五光計算
    if(gokou_p<3){
        gokou_p=0;
    }
    else if(gokou_p==3){
        gokou_p=5;
    }
    else if(gokou_p==14){
        gokou_p=7;
    }
    else if(gokou_p==4){
        gokou_p=8;
    }
    else if(gokou_p==5){
        gokou_p=10;
    }
    //タネ計算
    if(tane.length>=5){
        tane_p=tane.length-4;
    }
    //猪鹿蝶計算
    if(inosika.length==3){
        inosika_p=5;
    }
    //短冊計算
    if(tan.length>=5){
        tan_p=tan.length-4;
    }
    //赤短計算
    if(aka.length==3){
        aka_p=3;
    }
    //青短計算
    if(ao.length==3){
        ao_p=3;
    }
    //カス計算
    if(kasu.length>=10){
        kasu_p=tan.length-9;
    }
    kei=gokou_p+tane_p+inosika_p+tan_p+aka_p+ao_p+kasu_p;
    if(kei!=m_point){
        m_point=kei;
        //koikoi or agari
        //if(koikoi){return 1}else{return 0}
    }
}
function e_yaku_check(){
    gokou=[]
    gokou_p=0;
    tane=[]
    tane_p=0;
    inosika=[]
    inosika_p=0;
    tan=[]
    tan_p=0;
    aka=[]
    aka_p=0;
    ao=[]
    ao_p=0;
    kasu=[]
    kasu_p=0;
    //札分け
    for(i=0;i<e_yaku.length;i++){
        //20点札
        if(e_yaku[i]%10==1){
            gokou.push(e_yaku[i]);
        }
        //10点札
        else if(e_yaku[i]%10==2){
            tane.push(e_yaku[i]);
            //猪鹿蝶
            if(e_yaku[i]/10==6||e_yaku[i]/10==7||e_yaku[i]/10==10){
                inosika.push(e_yaku[i]);
            }
        }
        //5点札
        else if(e_yaku[i]%10==3){
            tan.push(e_yaku[i]);
            //赤短
            if(e_yaku[i]/10==1||e_yaku[i]/10==2||e_yaku[i]/10==3){
                aka.push(e_yaku[i]);
            }
            //青短
            else if(e_yaku[i]/10==6||e_yaku[i]/10==9||e_yaku[i]/10==10){
                ao.push(e_yaku[i]);
            }
        }
        //カス
        else{
            kasu.push(e_yaku[i]);
        }
    }
    //チェック
    //三光、雨入りチェック
    if(gokou.length==3){
        for(i=0;i<3;i++){
            if(gokou[i]==111){
                break;
            }
            gokou_p++;
        }
    }
    //四光、雨入りチェック
    else if(gokou.length==4){
        for(i=0;i<4;i++){
            if(gokou[i]==111){
                gokou+=10;
            }
            gokou_p++;
        }
    }
    //五光確定
    else if(gokou.length==5){
        gokou_p=5;
    }
    //五光計算
    if(gokou_p<3){
        gokou_p=0;
    }
    else if(gokou_p==3){
        gokou_p=5;
    }
    else if(gokou_p==14){
        gokou_p=7;
    }
    else if(gokou_p==4){
        gokou_p=8;
    }
    else if(gokou_p==5){
        gokou_p=10;
    }
    //タネ計算
    if(tane.length>=5){
        tane_p=tane.length-4;
    }
    //猪鹿蝶計算
    if(inosika.length==3){
        inosika_p=5;
    }
    //短冊計算
    if(tan.length>=5){
        tan_p=tan.length-4;
    }
    //赤短計算
    if(aka.length==3){
        aka_p=3;
    }
    //青短計算
    if(ao.length==3){
        ao_p=3;
    }
    //カス計算
    if(kasu.length>=10){
        kasu_p=tan.length-9;
    }
    kei=gokou_p+tane_p+inosika_p+tan_p+aka_p+ao_p+kasu_p;
    if(kei!=e_point){
        e_point=kei;
        //koikoi or agari
        //if(koikoi){return 1}else{return 0}
    }
}
l=0;
while(c==0&&l<8){
    m_turn();
    c=m_yaku_check();
    e_turn();
    c=e_yaku_check();
    l++;
}
console.log(m_point,e_point);

