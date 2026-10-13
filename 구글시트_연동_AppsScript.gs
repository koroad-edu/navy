/* ============================================================
   해군 장병 교통안전 교육 — 결과 자동수집(구글시트 '해군' 탭)
   ------------------------------------------------------------
   [설치 순서]
   1) 결과를 모을 구글시트를 연다(없으면 새로 만든다).
   2) 상단 메뉴 [확장 프로그램] > [Apps Script] 클릭.
   3) 기존 내용을 지우고 이 파일 내용을 전부 붙여넣는다.
   4) 아래 SHEET_ID 를 본인 시트 ID로 교체한다.
      - 시트 URL: https://docs.google.com/spreadsheets/d/★여기가_ID★/edit
   5) [배포] > [새 배포] > 유형: '웹 앱'
        · 실행 계정: 나
        · 액세스 권한: 모든 사용자(익명 포함)
      > [배포] 클릭 후 나오는 '웹 앱 URL'을 복사.
   6) index.html 을 열어 SHEET_ENDPOINT = "" 안에 그 URL을 붙여넣고 저장.
      예) var SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfyc.../exec";
   ============================================================ */

const SHEET_ID = "여기에_시트_ID_붙여넣기";
const TAB_NAME = "해군";

function doPost(e){
  try{
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sh = ss.getSheetByName(TAB_NAME) || ss.insertSheet(TAB_NAME);
    if(sh.getLastRow() === 0){
      sh.appendRow(["완료일시","소속부대","직위","연령","성명","사전점수","사후점수","수료여부"]);
    }
    var d = JSON.parse(e.postData.contents);
    sh.appendRow([ d.ts ? new Date(d.ts) : new Date(),
                   d.unit, d.rank, d.age, d.name, d.pre, d.post, d.pass ]);
    return ContentService.createTextOutput("ok");
  }catch(err){
    return ContentService.createTextOutput("error: " + err);
  }
}
