// Скрипт для добавления переводов объектов и блога для оставшихся языков
const fs = require('fs');

const translations = {
  ko: {
    realEstateObjects: {
      "1": { title: "2룸 아파트", address: "트베르스카야 거리 15, 42호", material: "벽돌" },
      "2": { title: "개인 주택", address: "Podmoskovnaya 마을, Sadovaya 거리 7", material: "6에이커 부지" },
      "3": { title: "사무 공간", address: "BC \"Center\", 301호 사무실", material: "콘크리트" },
      "4": { title: "1룸 아파트", address: "레닌 거리 25, 15호", material: "패널" },
      "5": { title: "토지", address: "SNT \"Sunny\", 12번 부지", material: "전기" },
      "6": { title: "3룸 아파트", address: "평화대로 8, 67호", material: "모놀리트" },
      "7": { title: "스튜디오", address: "알바트 거리 12, 3호", material: "벽돌" },
      "8": { title: "코티지", address: "Rublevo 정착지, Lesnaya 거리 45", material: "10에이커 부지" },
      "9": { title: "소매 공간", address: "TC \"Mega\", 15번 파빌리온", material: "쇼핑센터" },
      "10": { title: "4룸 아파트", address: "붉은 광장 거리 1, 100호", material: "모놀리트" },
      "11": { title: "주차장", address: "산업 거리 5, 12번 박스", material: "콘크리트" },
      "12": { title: "2룸 아파트", address: "Sadovaya 거리 30, 25호", material: "패널" },
      "13": { title: "창고 공간", address: "산업 거리 15, 3번 창고", material: "금속 구조" },
      "14": { title: "1룸 아파트", address: "Novaya 거리 7, 8호", material: "벽돌" },
      "15": { title: "타운하우스", address: "Zarechny 정착지, 중앙 거리 12", material: "4에이커 부지" },
      "16": { title: "사무실", address: "BC \"Modern\", 505호 사무실", material: "유리/콘크리트" },
      "17": { title: "3룸 아파트", address: "Moskovskaya 거리 22, 45호", material: "모놀리트" },
      "18": { title: "토지", address: "SNT \"Daisy\", 8번 부지", material: "가스, 전기" },
      "19": { title: "스튜디오", address: "Molodezhnaya 거리 18, 2호", material: "패널" },
      "20": { title: "개인 주택", address: "Zelenoe 마을, Dachnaya 거리 3", material: "8에이커 부지" },
      "21": { title: "2룸 아파트", address: "Parkovaya 거리 14, 33호", material: "벽돌" },
      "22": { title: "산업 공간", address: "Zavodskaya 거리 25, 2번 작업장", material: "금속 구조" },
      "23": { title: "1룸 아파트", address: "Shkolnaya 거리 9, 12호", material: "패널" },
      "24": { title: "코티지", address: "Lesnoy 정착지, Sosnovaya 거리 7", material: "12에이커 부지" },
      "25": { title: "사무 공간", address: "BC \"Business\", 201호 사무실", material: "콘크리트" },
      "26": { title: "3룸 아파트", address: "Vesennyaya 거리 11, 56호", material: "모놀리트" },
      "27": { title: "주차장", address: "Avtomobilnaya 거리 3, 7번 박스", material: "벽돌" },
      "28": { title: "스튜디오", address: "Studencheskaya 거리 5, 1호", material: "벽돌" },
      "29": { title: "토지", address: "SNT \"Harvest\", 25번 부지", material: "모든 공공 시설" },
      "30": { title: "타운하우스", address: "Solnechny 정착지, Yasnaya 거리 9", material: "5에이커 부지" }
    },
    blog: {
      title: "블로그",
      loadMore: "더 많은 기사 로드",
      readMore: "더 읽기 →",
      published: "게시됨:",
      articles: {
        "1": { title: "신축 건물에서 아파트를 올바르게 선택하는 방법", date: "2024년 1월 15일", excerpt: "신축 건물에서 아파트를 선택할 때는 레이아웃부터 개발업체의 평판까지 많은 요소에 주의를 기울이는 것이 중요합니다. 이 기사에서는 올바른 선택을 하는 데 도움이 될 핵심 포인트에 대해 알려드리겠습니다..." },
        "2": { title: "2024년 부동산 시장 트렌드", date: "2024년 1월 10일", excerpt: "현재 부동산 시장 트렌드 분석은 구매자 선호도와 가격 역학에서 흥미로운 변화를 보여줍니다. 새해의 주요 트렌드를 살펴보겠습니다..." },
        "3": { title: "2024년 모기지: 무엇이 바뀌었나?", date: "2024년 1월 5일", excerpt: "2024년 모기지 대출의 새로운 조건은 잠재적 차용인에게 긍정적이고 부정적인 변화를 모두 가져왔습니다. 모든 혁신을 분석해보겠습니다..." }
      }
    }
  },
  ja: {
    realEstateObjects: {
      "1": { title: "2LDKマンション", address: "トゥヴェルスカヤ通り15, 42号室", material: "レンガ" },
      "2": { title: "個人住宅", address: "Podmoskovnaya村, Sadovaya通り7", material: "6エーカーの土地" },
      "3": { title: "オフィススペース", address: "BC \"Center\", 301号オフィス", material: "コンクリート" },
      "4": { title: "1LDKマンション", address: "レーニン通り25, 15号室", material: "パネル" },
      "5": { title: "土地", address: "SNT \"Sunny\", 12番地", material: "電気" },
      "6": { title: "3LDKマンション", address: "平和通り8, 67号室", material: "モノリシック" },
      "7": { title: "スタジオ", address: "アルバート通り12, 3号室", material: "レンガ" },
      "8": { title: "コテージ", address: "ルブレヴォ居住区, Lesnaya通り45", material: "10エーカーの土地" },
      "9": { title: "小売スペース", address: "TC \"Mega\", 15番パビリオン", material: "ショッピングセンター" },
      "10": { title: "4LDKマンション", address: "赤の広場通り1, 100号室", material: "モノリシック" },
      "11": { title: "ガレージ", address: "工業通り5, 12番ボックス", material: "コンクリート" },
      "12": { title: "2LDKマンション", address: "Sadovaya通り30, 25号室", material: "パネル" },
      "13": { title: "倉庫スペース", address: "工業通り15, 3番倉庫", material: "金属構造" },
      "14": { title: "1LDKマンション", address: "Novaya通り7, 8号室", material: "レンガ" },
      "15": { title: "タウンハウス", address: "Zarechny居住区, 中央通り12", material: "4エーカーの土地" },
      "16": { title: "オフィス", address: "BC \"Modern\", 505号オフィス", material: "ガラス/コンクリート" },
      "17": { title: "3LDKマンション", address: "Moskovskaya通り22, 45号室", material: "モノリシック" },
      "18": { title: "土地", address: "SNT \"Daisy\", 8番地", material: "ガス、電気" },
      "19": { title: "スタジオ", address: "Molodezhnaya通り18, 2号室", material: "パネル" },
      "20": { title: "個人住宅", address: "Zelenoe村, Dachnaya通り3", material: "8エーカーの土地" },
      "21": { title: "2LDKマンション", address: "Parkovaya通り14, 33号室", material: "レンガ" },
      "22": { title: "工業スペース", address: "Zavodskaya通り25, 2番工場", material: "金属構造" },
      "23": { title: "1LDKマンション", address: "Shkolnaya通り9, 12号室", material: "パネル" },
      "24": { title: "コテージ", address: "Lesnoy居住区, Sosnovaya通り7", material: "12エーカーの土地" },
      "25": { title: "オフィススペース", address: "BC \"Business\", 201号オフィス", material: "コンクリート" },
      "26": { title: "3LDKマンション", address: "Vesennyaya通り11, 56号室", material: "モノリシック" },
      "27": { title: "ガレージ", address: "Avtomobilnaya通り3, 7番ボックス", material: "レンガ" },
      "28": { title: "スタジオ", address: "Studencheskaya通り5, 1号室", material: "レンガ" },
      "29": { title: "土地", address: "SNT \"Harvest\", 25番地", material: "すべての公共施設" },
      "30": { title: "タウンハウス", address: "Solnechny居住区, Yasnaya通り9", material: "5エーカーの土地" }
    },
    blog: {
      title: "ブログ",
      loadMore: "さらに記事を読み込む",
      readMore: "続きを読む →",
      published: "公開日:",
      articles: {
        "1": { title: "新築マンションでアパートを正しく選ぶ方法", date: "2024年1月15日", excerpt: "新築マンションでアパートを選ぶ際は、レイアウトから開発業者の評判まで、多くの要因に注意を払うことが重要です。この記事では、正しい選択をするのに役立つ重要なポイントについてお話しします..." },
        "2": { title: "2024年の不動産市場トレンド", date: "2024年1月10日", excerpt: "現在の不動産市場トレンドの分析は、購入者の好みと価格動向に興味深い変化を示しています。新年の主要トレンドを見てみましょう..." },
        "3": { title: "2024年の住宅ローン：何が変わったのか？", date: "2024年1月5日", excerpt: "2024年の住宅ローンの新しい条件は、潜在的な借り手にとってプラスとマイナスの両方の変化をもたらしました。すべての革新を分析してみましょう..." }
      }
    }
  }
};

// Читаем файл
let content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

// Добавляем переводы для корейского языка
const koInsertPoint = content.indexOf('supportEmail: "support@metrika.ru"\n    }\n  },\n  ko: {');
if (koInsertPoint !== -1) {
  const koTranslations = JSON.stringify(translations.ko, null, 6).replace(/"/g, '"');
  content = content.replace(
    'supportEmail: "support@metrika.ru"\n    }\n  },\n  ko: {',
    `supportEmail: "support@metrika.ru"\n    },\n    realEstateObjects: ${koTranslations.realEstateObjects},\n    blog: ${koTranslations.blog}\n  },\n  ko: {`
  );
}

// Добавляем переводы для японского языка
const jaInsertPoint = content.indexOf('supportEmail: "support@metrika.ru"\n    }\n  },\n  ja: {');
if (jaInsertPoint !== -1) {
  const jaTranslations = JSON.stringify(translations.ja, null, 6).replace(/"/g, '"');
  content = content.replace(
    'supportEmail: "support@metrika.ru"\n    }\n  },\n  ja: {',
    `supportEmail: "support@metrika.ru"\n    },\n    realEstateObjects: ${jaTranslations.realEstateObjects},\n    blog: ${jaTranslations.blog}\n  },\n  ja: {`
  );
}

// Записываем обновленный файл
fs.writeFileSync('src/contexts/LanguageContext.tsx', content);

console.log('Переводы для корейского и японского языков добавлены!');
