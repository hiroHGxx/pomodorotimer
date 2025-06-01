const fs = require('fs');
const path = require('path');

// 現在の日時を取得してフォーマット
const now = new Date();
const options = {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
};

const formatter = new Intl.DateTimeFormat('ja-JP', options);
const formattedDate = formatter.format(now);

// index.htmlを読み込む
const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// ビルド日時を挿入
html = html.replace('<!-- BUILD_TIME_PLACEHOLDER -->', 
    `<div id="build-time" style="display:none;">${formattedDate}</div>`);

// 更新されたHTMLを保存
fs.writeFileSync(indexPath, html, 'utf8');

console.log('ビルド日時を更新しました:', formattedDate);
