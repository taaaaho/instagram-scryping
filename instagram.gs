function checkReport() {
  //チェックを行うユーザーIDを取得
  try {
    var targetList = getTargetList();
    //データを記録していく
    for (var i = 0; i < targetList.length; i++){
      insertReportData(targetList[i]);
    }
  } catch (e){
    Logger.log(e);
  }
}

function getTargetList() {
  try {
    var spreadsheet = SpreadsheetApp.openById('スプレッドシートのID'); 
    var sheet = spreadsheet.getSheetByName('target');
    var data = sheet.getDataRange().getValues();
    var targetList = [];
    for(var i=0; i < data.length; i++){
      targetList.push(data[i][0]);
    }
    return targetList;
  } catch(e) {
    throw(e);
  }
}


function insertReportData(userId) {
  try {
    var data = getData(userId);
    var sheet = "";
    
    // 記録用スプレッドシートの取得
    var spreadsheet = SpreadsheetApp.openById('スプレッドシートのID'); 
    var sheets = spreadsheet.getSheets();
    for(var i=0; i < sheets.length; i++){
      if(userId == sheets[i].getName()){
        sheet = spreadsheet.getSheetByName(userId);
      }
    }
    if(sheet == null){
      spreadsheet.insertSheet(userId);
      sheet = spreadsheet.getSheetByName(userId);
      sheet.appendRow(['日時','フォロワー数','フォロー数','ポスト数']);
    }
    var lastRow = sheet.appendRow(data);
  } catch(e) {
    throw(e);
  }
}

function getData(userId) {
  try {
    var url = "https://www.instagram.com/" + userId;
    var content = getContent(url);
    
    //実行日付
    var today = new Date();
    
    //フォロワー数取得(アカウント名の最後に数値入ってるとおかしくなるからこんな感じになってしまった。)
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
  } catch(e) {
    throw(e);
  }
}

//requetがエラーになることがあるため、取得するまでwhile
function getContent(url) {
  while(true){
    try {
      var request = UrlFetchApp.fetch(url)
      var content = request.getContentText();
      return content;
    } catch(e) {
      Logger.log(e);
      continue;
    }
  }
}
