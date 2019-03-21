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
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
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
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = spreadsheet.getSheets();
    sheet = spreadsheet.getSheetByName('data');
    if(sheet == "" || sheet == null){
      spreadsheet.insertSheet('data');
      sheet = spreadsheet.getSheetByName('data');
      sheet.appendRow(['ユーザーID','日時','フォロワー数','フォロー数','ポスト数']);
    }
    sheet.appendRow(data);
  } catch(e) {
    throw(e);
  }
}

function getData(userId) {
  try {
    var url = "https://www.instagram.com/" + userId;
    var content = getContent(url);
    var json = content.match(/window._sharedData = (.*?);<\/script>/)[1];
    var jsonData = JSON.parse(json);
    
    //実行日付
    var today = new Date();
    
    //フォロワー数
    var followers = jsonData['entry_data']['ProfilePage'][0]['graphql']['user']['edge_followed_by']['count'];
    
    //フォロー数
    var followings   = jsonData['entry_data']['ProfilePage'][0]['graphql']['user']['edge_follow']['count'];
    
    //ポスト数
    var posts   = jsonData['entry_data']['ProfilePage'][0]['graphql']['user']['edge_owner_to_timeline_media']['count'];
    
    var result = [userId,today,followers,followings,posts];
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
      var content = request.getContentText('UTF-8');
      return content;
    } catch(e) {
      Logger.log(e);
      continue;
    }
  }
}