import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { translations } from "./i18n.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 交易所图标定义
const binanceSvg = `<svg width="48" height="48" viewBox="0 0 126.61 126.61" xmlns="http://www.w3.org/2000/svg"><g fill="#f3ba2f"><path d="m38.73 53.2 24.59-24.58 24.6 24.6 14.3-14.31-38.9-38.91-38.9 38.9z"/><path d="m0 63.31 14.3-14.31 14.31 14.31-14.31 14.3z"/><path d="m38.73 73.41 24.59 24.59 24.6-24.6 14.31 14.29-38.9 38.91-38.91-38.88z"/><path d="m98 63.31 14.3-14.31 14.31 14.3-14.31 14.32z"/><path d="m77.83 63.3-14.51-14.52-10.73 10.73-1.24 1.23-2.54 2.54 14.51 14.5 14.51-14.47z"/></g></svg>`;

const okxSvg = `<svg xmlns:xodm="http://www.corel.com/coreldraw/odm/2003" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 2500 2500" style="enable-background:new 0 0 2500 2500;" xml:space="preserve"><style type="text/css">.st0{fill:none;}</style><g id="Layer_x0020_1"><g id="_2187289728928"><rect y="0" class="st0" width="2500" height="2500"></rect><g><path d="M1464.3,1015.3h-405.2c-17.2,0-31.3,14.1-31.3,31.3v405.2c0,17.2,14.1,31.3,31.3,31.3h405.2c17.2,0,31.3-14.1,31.3-31.3     v-405.2C1495.6,1029.4,1481.5,1015.3,1464.3,1015.3z"></path><path d="M996.6,549.1H591.4c-17.2,0-31.3,14.1-31.3,31.3v405.2c0,17.2,14.1,31.3,31.3,31.3h405.2c17.2,0,31.3-14.1,31.3-31.3     V580.4C1027.8,563.2,1013.8,549.1,996.6,549.1z"></path><path d="M1930.5,549.1h-405.2c-17.2,0-31.3,14.1-31.3,31.3v405.2c0,17.2,14.1,31.3,31.3,31.3h405.2c17.2,0,31.3-14.1,31.3-31.3     V580.4C1961.8,563.2,1947.7,549.1,1930.5,549.1z"></path><path d="M996.6,1481.5H591.4c-17.2,0-31.3,14.1-31.3,31.3V1918c0,17.2,14.1,31.3,31.3,31.3h405.2c17.2,0,31.3-14.1,31.3-31.3     v-405.2C1027.8,1495.6,1013.8,1481.5,996.6,1481.5z"></path><path d="M1930.5,1481.5h-405.2c-17.2,0-31.3,14.1-31.3,31.3V1918c0,17.2,14.1,31.3,31.3,31.3h405.2c17.2,0,31.3-14.1,31.3-31.3     v-405.2C1961.8,1495.6,1947.7,1481.5,1930.5,1481.5z"></path></g></g></g></svg>`;

const gateioSvg = `<svg width="48" height="48" viewBox="0 0 2500 2500" xmlns="http://www.w3.org/2000/svg"><rect fill="none" width="2500" height="2500"/><path fill="#2354E6" fill-rule="evenodd" clip-rule="evenodd" d="M1250 1937.5c-379.7 0-687.5-307.8-687.5-687.5 0-379.7 307.8-687.5 687.5-687.5V0C559.6 0 0 559.6 0 1250c0 690.3 559.6 1250 1250 1250 690.3 0 1250-559.6 1250-1250h-562.5c0 379.7-307.8 687.5-687.5 687.5z"/><polygon fill="#17E6A1" fill-rule="evenodd" clip-rule="evenodd" points="1250,1250 1937.5,1250 1937.5,562.5 1250,562.5"/></svg>`;

const bitgetSvg = `<svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8.71" fill="#00f0ff"/><path d="M18.46 15.77h7.47l7.64 7.59c.5.49.5 1.3.01 1.79L23.78 35h-7.69l2.33-2.26 8.54-8.49-8.43-8.49z" fill="#1b1b1b"/><path d="M21.53 24.23h-7.47l-7.64-7.59a1.27 1.27 0 01-.01-1.79L16.21 5h7.69l-2.33 2.26-8.54 8.49 8.43 8.49z" fill="#1b1b1b"/></svg>`;

const mystonksPng = `<img src="/mystonks.webp" alt="Mystonks" width="48" height="48" />`;

// 交易所跳转映射
const exchangeMap = {
  binance: {
    China: process.env.BINANCE_URL_CN,
    default: process.env.BINANCE_URL_DEFAULT,
  },
  gateio: {
    China: process.env.GATEIO_URL_CN,
    default: process.env.GATEIO_URL_DEFAULT,
  },
  bitget: {
    China: process.env.BITGET_URL_CN,
    default: process.env.BITGET_URL_DEFAULT,
  },
  okx: {
    China: process.env.OKX_URL_CN,
    default: process.env.OKX_URL_DEFAULT,
  },
  mystonks: {
    China: process.env.MYSTONKS_URL_CN,
    default: process.env.MYSTONKS_URL_DEFAULT,
  },
};

// 静态文件路由
app.get('/favicon.svg', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'favicon.svg'));
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'favicon.ico'));
});

app.get('/preview.jpg', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'preview.jpg'));
});

app.get('/mystonks.webp', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'mystonks.webp'));
});

// 添加爬虫访问日志
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  if(userAgent.includes('Googlebot')) {
    console.log(`Googlebot访问: ${req.path}`, new Date());
  }
  next();
});

// 语言检测
function detectLang(req, country) {
  const langHeader = (req.headers["accept-language"] || "").toLowerCase();
  if (langHeader.includes("zh")) return "zh";
  if (langHeader.includes("ja")) return "ja";
  if (langHeader.includes("ko")) return "ko";
  if (langHeader.includes("ar")) return "ar";
  if (langHeader.includes("en")) return "en";
  if (country === "China") return "zh";
  return "en";
}

// 国家检测
async function detectCountry(req) {
  const clientIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  try {
    const geoRes = await fetch(`https://get.geojs.io/v1/ip/geo/${clientIp}.json`);
    const geoData = await geoRes.json();
    return geoData.country || "Unknown";
  } catch (err) {
    console.warn("Geo IP failed:", err);
    return "Unknown";
  }
}

// 获取交易所图标
function getExchangeIcon(exchange) {
  switch(exchange) {
    case 'binance': return binanceSvg;
    case 'okx': return okxSvg;
    case 'gateio': return gateioSvg;
    case 'bitget': return bitgetSvg;
    case 'mystonks': return mystonksPng;
    default: return '';
  }
}

// 渲染首页
function renderHomePage(t, lang, host) {
  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title}</title>
  <meta name="description" content="${t.description}">
  <meta name="keywords" content="${t.keywords}">
  <meta property="og:title" content="${t.title}">
  <meta property="og:description" content="${t.description}">
  <meta property="og:image" content="https://${host}/preview.jpg">
  <meta property="og:url" content="https://${host}/">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${t.ogLocale}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
  <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      margin: 0;
      padding: 2rem 1rem;
      background-color: #0B0E11;
      color: #fff;
    }
    h1 {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      max-width: 1000px;
      margin: auto;
    }
    @media (max-width: 600px) {
      .grid {
        grid-template-columns: 1fr !important;
      }
    }
    .card-link {
      text-decoration: none;
      color: inherit;
    }
    .card {
      position: relative;
      background: #1E2329;
      border-radius: 12px;
      padding: 1.2rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.5);
    }
    .card svg,
    .card img {
      width: 48px;
      height: 48px;
      margin-bottom: 0.8rem;
    }
    .card h3 {
      margin: 0.2rem 0 0.5rem;
      font-size: 1.1rem;
      user-select: none;
    }
    .card button {
      margin-top: auto;
      padding: 0.5rem 1rem;
      border: none;
      background: #FCD535;
      color: #000;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      user-select: none;
      transition: background-color 0.2s ease;
    }
    .card button:hover {
      background: #e3bc2e;
    }
    .badge {
      position: absolute;
      top: -6px;
      left: -6px;
      background: #FCD535;
      color: #000;
      font-size: 0.75rem;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 6px;
      user-select: none;
    }
    .lang-switcher {
      position: absolute;
      top: 1rem;
      right: 1rem;
      user-select: none;
    }
    .lang-switcher select {
      background: #1E2329;
      color: #fff;
      border: 1px solid #FCD535;
      border-radius: 6px;
      padding: 6px 28px 6px 10px;
      font-size: 0.9rem;
      font-weight: bold;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20fill%3D%22%23FCD535%22%20height%3D%2216%22%20width%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5z%22/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
      cursor: pointer;
    }
    @media (max-width: 600px) {
      .lang-switcher {
        position: static;
        margin-bottom: 1rem;
        text-align: center;
      }
      .lang-switcher select {
        width: 120px;
      }
    }
    button, input, select, textarea {
      font-size: 16px;
    }
    footer {
      text-align: center;
      margin-top: 3rem;
      font-size: 0.85rem;
      color: #aaa;
    }
    footer a {
      color: #FCD535;
      text-decoration: none;
    }
  </style>
  <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JY2H2Y4LX2"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-JY2H2Y4LX2');
</script>
</head>
<body>
  <div class="lang-switcher">
    <select id="langSwitcher" aria-label="Language switcher">
      <option value="zh" ${lang === "zh" ? "selected" : ""}>🇨🇳 中文</option>
      <option value="en" ${lang === "en" ? "selected" : ""}>🇺🇸 English</option>
      <option value="ja" ${lang === "ja" ? "selected" : ""}>🇯🇵 日本語</option>
      <option value="ko" ${lang === "ko" ? "selected" : ""}>🇰🇷 한국어</option>
      <option value="ar" ${lang === "ar" ? "selected" : ""}>🇸🇦 العربية</option>
    </select>
  </div>
  <h1>${t.heading}</h1>
  <div class="grid" role="list">
    <a class="card-link" href="/to/binance?lang=${lang}">
      <div class="card">
        <div class="badge">${t.badge}</div>
        ${binanceSvg}
        <h3>Binance</h3>
        <button>${t.button}</button>
      </div>
    </a>
    <a class="card-link" href="/to/okx?lang=${lang}">
      <div class="card">
        ${okxSvg}
        <h3>OKX</h3>
        <button>${t.button}</button>
      </div>
    </a>
    <a class="card-link" href="/to/gateio?lang=${lang}">
      <div class="card">
        <div class="badge">${t.badge}</div>
        ${gateioSvg}
        <h3>Gate.io</h3>
        <button>${t.button}</button>
      </div>
    </a>
    <a class="card-link" href="/to/bitget?lang=${lang}">
      <div class="card">
        ${bitgetSvg}
        <h3>Bitget</h3>
        <button>${t.button}</button>
      </div>
    </a>
    <a class="card-link" href="/to/mystonks?lang=${lang}">
      <div class="card">
        ${mystonksPng}
        <h3>Mystonks</h3>
        <button>${t.button}</button>
      </div>
    </a>
  </div>

  <footer>
    <p>&copy; ${new Date().getFullYear()} Crypto Jump Service. ${lang === "zh" ? "保留所有权利。" : "All rights reserved."}</p>
    <p>
      <a href="https://t.me/xiangjiaogev" target="_blank">
        ${lang === "zh" ? "加入 Telegram 社区" : "Join Telegram Community"}
      </a>
      &nbsp;|&nbsp;
      <a href="https://x.com/xiangjiaogev" target="_blank">
        ${lang === "zh" ? "联系我" : "Contact me"}
      </a>
    </p>
  </footer>

  <script>
    document.addEventListener('DOMContentLoaded', function () {
      const langSwitcher = document.getElementById('langSwitcher');
      if (langSwitcher) {
        langSwitcher.addEventListener('change', function (e) {
          const selectedLang = e.target.value;
          const url = new URL(window.location.href);
          url.searchParams.set('lang', selectedLang);
          window.location.href = url.toString();
        });
      }
    });
  </script>
</body>
</html>
  `;
}

// 渲染交易所详情页
function renderExchangePage(exchange, lang, host, country) {
  const t = translations[lang] || translations.en;
  const details = t.exchangeDetails[exchange] || t.exchangeDetails.binance;
  const exchangeUrl = exchangeMap[exchange]?.[country] || exchangeMap[exchange]?.default || exchangeMap.binance.default;

  return `
<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${details.title}</title>
  <meta name="description" content="${details.description}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://${host}/to/${exchange}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${details.title}">
  <meta property="og:description" content="${details.description}">
  <meta property="og:image" content="https://${host}/preview.jpg">
  <meta property="og:url" content="https://${host}/to/${exchange}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${t.ogLocale}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${details.title}">
  <meta name="twitter:description" content="${details.description}">
  <meta name="twitter:image" content="https://${host}/preview.jpg">
  
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JY2H2Y4LX2"> Google Ads</script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-JY2H2Y4LX2');
</script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      background: #0B0E11;
      color: #fff;
      max-width: 1000px;
      margin: 0 auto;
      ${lang === 'ar' ? 'text-align: right;' : ''}
    }
    header {
      text-align: center;
      margin-bottom: 30px;
    }
    .exchange-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 15px;
    }
    h1 {
      color: #FCD535;
      margin-bottom: 10px;
    }
    .features {
      background: #1E2329;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .features ul {
      padding-left: 20px;
    }
    .features li {
      margin-bottom: 10px;
    }
    .jump-notice {
      background: rgba(252, 213, 53, 0.2);
      border: 1px solid #FCD535;
      color: #FCD535;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      margin: 30px 0;
    }
    .home-link {
      display: block;
      text-align: center;
      margin-top: 30px;
      color: #FCD535;
      text-decoration: none;
    }
    @media (max-width: 600px) {
      body {
        padding: 15px;
      }
      .exchange-icon {
        width: 60px;
        height: 60px;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="exchange-icon">${getExchangeIcon(exchange)}</div>
    <h1>${details.title}</h1>
    <p>${details.description}</p>
  </header>

  <section class="features">
    <h2>${t.featuresTitle}</h2>
    <ul>
      ${details.features.map(feature => `<li>${feature}</li>`).join('')}
    </ul>
  </section>

  <div class="jump-notice">
    ${t.redirectNotice}
    <br><br>
    <a href="${exchangeUrl}" style="color: #000; background: #FCD535; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: bold;">
      ${t.button}
    </a>
  </div>

  <a href="/?lang=${lang}" class="home-link">← ${lang === 'zh' ? '返回首页' : 'Back to Home'}</a>

  <script>
    // 1秒后自动跳转
    setTimeout(() => {
      window.location.href = "${exchangeUrl}";
    }, 1000);
    
    // 跟踪跳转事件
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Exchange page viewed: ${exchange}', 'Country: ${country}');
    });
  </script>
</body>
</html>
  `;
}
// robots.txt
app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send(`
User-agent: *
Allow: /$
Allow: /to/
Disallow: /binance
Disallow: /okx
Disallow: /gateio
Disallow: /bitget
Disallow: /mystonks

# 特别为Googlebot设置
User-agent: Googlebot
Allow: /to/binance
Allow: /to/okx
Allow: /to/gateio
Allow: /to/bitget
Allow: /to/mystonks

Sitemap: https://${req.headers.host}/sitemap.xml
  `);
});

// sitemap.xml
app.get("/sitemap.xml", (req, res) => {
  const baseUrl = `https://${req.headers.host}`;
  const urls = [
    "",
    "to/binance",
    "to/okx",
    "to/gateio",
    "to/bitget",
    "to/mystonks"
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(path => `
  <url>
    <loc>${baseUrl}/${path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${path === "" ? "1.0" : "0.8"}</priority>
  </url>`).join("")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.send(sitemap);
});

// 交易所详情页路由
app.get("/to/:exchange", async (req, res) => {
  const { exchange } = req.params;
  if (!exchangeMap[exchange]) {
    return res.redirect('/');
  }

  const clientIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  let country = "Unknown";
  try {
    const geoRes = await fetch(`https://get.geojs.io/v1/ip/geo/${clientIp}.json`);
    const geoData = await geoRes.json();
    country = geoData.country;
  } catch (err) {
    console.warn("Geo IP failed:", err);
  }

  const supportedLangs = ["zh", "en", "ja", "ko", "ar"];
  const currentLang = req.query.lang;
  
  let lang;
  if (currentLang && supportedLangs.includes(currentLang)) {
    lang = currentLang;
  } else {
    lang = detectLang(req, country);
  }

  res.send(renderExchangePage(exchange, lang, req.headers.host, country));
});

// 即时跳转路由
app.get("/:exchange", async (req, res) => {
  const { exchange } = req.params;
  
  if (!exchange) {
    return res.redirect('/');
  }

  if (!exchangeMap[exchange]) {
    return res.redirect('/');
  }

  const clientIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  let country = "Unknown";
  try {
    const geoRes = await fetch(`https://get.geojs.io/v1/ip/geo/${clientIp}.json`);
    const geoData = await geoRes.json();
    country = geoData.country;
  } catch (err) {
    console.warn("Geo IP failed:", err);
  }

  const targetUrl = exchangeMap[exchange]?.[country] || exchangeMap[exchange].default;
  
  console.log(`[Instant Redirect] IP: ${clientIp}, Exchange: ${exchange}, Country: ${country}`);
  res.redirect(301, targetUrl);
});
// 首页路由
app.get("/", async (req, res) => {
  const clientIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  let country = "Unknown";
  try {
    const geoRes = await fetch(`https://get.geojs.io/v1/ip/geo/${clientIp}.json`);
    const geoData = await geoRes.json();
    country = geoData.country;
  } catch (err) {
    console.warn("Geo IP failed:", err);
  }

  const supportedLangs = ["zh", "en", "ja", "ko", "ar"];
  const currentLang = req.query.lang;
  
  let lang;
  // 检查是否为Googlebot用户代理，默认显示英文版
  const userAgent = req.headers['user-agent'] || '';
  if (userAgent.includes('Googlebot')) {
    lang = 'en';
  } else if (currentLang && supportedLangs.includes(currentLang)) {
    lang = currentLang;
  } else {
    lang = detectLang(req, country);
  }

  // 如果不是Googlebot且没有当前语言参数，则重定向
  if (!currentLang && !userAgent.includes('Googlebot')) {
    return res.redirect(`/?lang=${lang}`);
  }

  const t = translations[lang] || translations.en;
  let html = renderHomePage(t, lang, req.headers.host);
  
  // 注入hreflang多语言标签
  const hreflangTags = `
    <link rel="alternate" hreflang="en" href="https://${req.headers.host}/?lang=en" />
    <link rel="alternate" hreflang="zh" href="https://${req.headers.host}/?lang=zh" />
    <link rel="alternate" hreflang="ja" href="https://${req.headers.host}/?lang=ja" />
    <link rel="alternate" hreflang="ko" href="https://${req.headers.host}/?lang=ko" />
    <link rel="alternate" hreflang="ar" href="https://${req.headers.host}/?lang=ar" />
    <link rel="alternate" hreflang="x-default" href="https://${req.headers.host}/?lang=en" />
  `;
  
  html = html.replace('</head>', `${hreflangTags}</head>`);
  res.send(html);
});

// 404处理
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Page Not Found</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0B0E11; color: #fff; }
        h1 { color: #e74c3c; }
        a { color: #3498db; text-decoration: none; }
      </style>
    </head>
    <body>
      <h1>404 - Page Not Found</h1>
      <p>${translations.en.exchangeDetails.binance.features[0]}</p>
      <p><a href="/">Return to Homepage</a></p>
    </body>
    </html>
  `);
});

// 错误处理
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Server Error</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0B0E11; color: #fff; }
        h1 { color: #e74c3c; }
      </style>
    </head>
    <body>
      <h1>500 - Server Error</h1>
      <p>Something went wrong on our server</p>
      <p>Please try again later</p>
    </body>
    </html>
  `);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
  ██████╗ ███████╗ ██████╗ 
  ██╔══██╗██╔════╝██╔════╝ 
  ██████╔╝█████╗  ██║      
  ██╔══██╗██╔══╝  ██║      
  ██║  ██║███████╗╚██████╗ 
  ╚═╝  ╚═╝╚══════╝ ╚═════╝ 
                           
  Server running on port ${PORT}
  `);
  console.log(`Access URLs:
  Local: http://localhost:${PORT}
  Network: http://${getIPAddress()}:${PORT}
  `);
});

// 获取本地IP地址
function getIPAddress() {
  const interfaces = require('os').networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
}
