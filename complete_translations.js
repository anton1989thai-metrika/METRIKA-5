const fs = require('fs');

// Простые переводы для оставшихся языков
const remainingTranslations = {
  kk: {
    realEstateObjects: {
      "1": { title: "2 бөлмелі пәтер", address: "Тверская көшесі 15, 42 пәтер", material: "Кірпіш" },
      "2": { title: "Жеке үй", address: "Podmoskovnaya ауылы, Sadovaya көшесі 7", material: "6 акр жер учаскесі" },
      "3": { title: "Кеңсе кеңістігі", address: "BC \"Center\", 301 кеңсе", material: "Бетон" },
      "4": { title: "1 бөлмелі пәтер", address: "Ленин көшесі 25, 15 пәтер", material: "Панель" },
      "5": { title: "Жер учаскесі", address: "SNT \"Sunny\", 12 учаске", material: "Электр" },
      "6": { title: "3 бөлмелі пәтер", address: "Бейбітшілік даңғылы 8, 67 пәтер", material: "Монолит" },
      "7": { title: "Студия", address: "Арбат көшесі 12, 3 пәтер", material: "Кірпіш" },
      "8": { title: "Коттедж", address: "Rublevo тұрғын үйі, Lesnaya көшесі 45", material: "10 акр жер учаскесі" },
      "9": { title: "Сауда кеңістігі", address: "TC \"Mega\", 15 павильон", material: "Сауда орталығы" },
      "10": { title: "4 бөлмелі пәтер", address: "Қызыл алаң көшесі 1, 100 пәтер", material: "Монолит" },
      "11": { title: "Гараж", address: "Өнеркәсіп көшесі 5, 12 қорап", material: "Бетон" },
      "12": { title: "2 бөлмелі пәтер", address: "Sadovaya көшесі 30, 25 пәтер", material: "Панель" },
      "13": { title: "Қойма кеңістігі", address: "Өнеркәсіп көшесі 15, 3 қойма", material: "Металл құрылымы" },
      "14": { title: "1 бөлмелі пәтер", address: "Novaya көшесі 7, 8 пәтер", material: "Кірпіш" },
      "15": { title: "Таунхаус", address: "Zarechny тұрғын үйі, Орталық көше 12", material: "4 акр жер учаскесі" },
      "16": { title: "Кеңсе", address: "BC \"Modern\", 505 кеңсе", material: "Шыны/бетон" },
      "17": { title: "3 бөлмелі пәтер", address: "Moskovskaya көшесі 22, 45 пәтер", material: "Монолит" },
      "18": { title: "Жер учаскесі", address: "SNT \"Daisy\", 8 учаске", material: "Газ, электр" },
      "19": { title: "Студия", address: "Molodezhnaya көшесі 18, 2 пәтер", material: "Панель" },
      "20": { title: "Жеке үй", address: "Zelenoe ауылы, Dachnaya көшесі 3", material: "8 акр жер учаскесі" },
      "21": { title: "2 бөлмелі пәтер", address: "Parkovaya көшесі 14, 33 пәтер", material: "Кірпіш" },
      "22": { title: "Өнеркәсіп кеңістігі", address: "Zavodskaya көшесі 25, 2 цех", material: "Металл құрылымы" },
      "23": { title: "1 бөлмелі пәтер", address: "Shkolnaya көшесі 9, 12 пәтер", material: "Панель" },
      "24": { title: "Коттедж", address: "Lesnoy тұрғын үйі, Sosnovaya көшесі 7", material: "12 акр жер учаскесі" },
      "25": { title: "Кеңсе кеңістігі", address: "BC \"Business\", 201 кеңсе", material: "Бетон" },
      "26": { title: "3 бөлмелі пәтер", address: "Vesennyaya көшесі 11, 56 пәтер", material: "Монолит" },
      "27": { title: "Гараж", address: "Avtomobilnaya көшесі 3, 7 қорап", material: "Кірпіш" },
      "28": { title: "Студия", address: "Studencheskaya көшесі 5, 1 пәтер", material: "Кірпіш" },
      "29": { title: "Жер учаскесі", address: "SNT \"Harvest\", 25 учаске", material: "Барлық коммуналдық қызметтер" },
      "30": { title: "Таунхаус", address: "Solnechny тұрғын үйі, Yasnaya көшесі 9", material: "5 акр жер учаскесі" }
    },
    blog: {
      title: "Блог",
      loadMore: "Көбірек мақалалар жүктеу",
      readMore: "Көбірек оқу →",
      published: "Жарияланған:",
      articles: {
        "1": { title: "Жаңа ғимаратта пәтерді дұрыс таңдау жолы", date: "2024 жылдың 15 қаңтары", excerpt: "Жаңа ғимаратта пәтер таңдағанда, жоспардан бастап дамытушының беделіне дейін көптеген факторларға назар аудару маңызды. Бұл мақалада біз дұрыс таңдау жасауға көмектесетін негізгі сәттер туралы айтамыз..." },
        "2": { title: "2024 жылдағы жылжымайтын мүлік нарығының тенденциялары", date: "2024 жылдың 10 қаңтары", excerpt: "Жылжымайтын мүлік нарығының қазіргі тенденцияларын талдау сатып алушылардың артықшылықтары мен баға динамикасында қызықты өзгерістерді көрсетеді. Жаңа жылдың негізгі тенденцияларын қарастырайық..." },
        "3": { title: "2024 жылдағы ипотека: не өзгерді?", date: "2024 жылдың 5 қаңтары", excerpt: "2024 жылдағы ипотекалық несиелеудің жаңа шарттары әлеуетті қарыз алушылар үшін оң және теріс өзгерістерді әкелді. Барлық инновацияларды талдайық..." }
      }
    }
  }
};

let content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

// Добавляем переводы для казахского языка
const kkInsertPoint = content.indexOf('supportEmail: "support@metrika.ru"\n    }\n  },\n  kk: {');
if (kkInsertPoint !== -1) {
  const kkTranslations = JSON.stringify(remainingTranslations.kk, null, 6).replace(/"/g, '"');
  content = content.replace(
    'supportEmail: "support@metrika.ru"\n    }\n  },\n  kk: {',
    `supportEmail: "support@metrika.ru"\n    },\n    realEstateObjects: ${JSON.stringify(remainingTranslations.kk.realEstateObjects, null, 6).replace(/"/g, '"')},\n    blog: ${JSON.stringify(remainingTranslations.kk.blog, null, 6).replace(/"/g, '"')}\n  },\n  kk: {`
  );
}

fs.writeFileSync('src/contexts/LanguageContext.tsx', content);
console.log('Казахский язык добавлен!');
