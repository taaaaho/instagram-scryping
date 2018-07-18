function checkReport() {
  //チェックを行うユーザーIDを取得
  var targetList = getTargetList();
  while(true){
    try {
      //データを記録していく
      for (var i = 0; i < targetList.length; i++){
        insertReportData(targetList[i]);
        targetList.splice(i--, 1);
      }
      //全員分取得できれば終了
      if(targetList.length == 0){
        break;
      }
    } catch (e){
      //エラー発生したら残りの処理を再度実施する
      continue;
    }
  }
}

function getTargetList() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('target');
  var data = sheet.getDataRange().getValues();
  var targetList = [];
  for(var i=0; i < data.length; i++){
    targetList.push(data[i][0]);
  }
  return targetList;
}


function insertReportData(user_id) {
  var data = getData(user_id);
  var sheet = null;

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = spreadsheet.getSheets();
  //対象のユーザー用シートの存在チェック
  for(var i=0; i < sheets.length; i++){
    if(user_id == sheets[i].getName()){
      sheet = spreadsheet.getSheetByName(user_id);
    }
  }
  if(sheet == null){
    //シートが無ければ作成
    spreadsheet.insertSheet(user_id);
    sheet = spreadsheet.getSheetByName(user_id);
    sheet.appendRow(['日時','フォロワー数','フォロー数','ポスト数']);
  }
  var lastRow = sheet.appendRow(data);
}

function getData(user_id) {
  var url = "https://www.instagram.com/" + user_id;
  var request = UrlFetchApp.fetch(url)
  var content = request.getContentText();
  
  //実行日付
  var today = new Date();
  
  //フォロワー数取得
  var regex = new RegExp('"\\d.*Followers');
  var followers = content.match(regex)[0].replace(" Followers","").replace("\"","");

  //フォロー数取得
  regex = new RegExp('\\s\\d.*Following');
  var followings = content.match(regex)[0].replace(" Following","");
  
  //ポスト枚数数取得
  regex = new RegExp('\\s\\d.*Posts');
  var posts = content.match(regex)[0].replace(" Posts","").replace(/\s\d.*\s/,"");
  
  var result = [today,followers,followings,posts];
  return result;
}

