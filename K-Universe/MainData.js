const i18nDE = {
  months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  weekdays: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
  weekdaysShort: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."]
};

const currencies = new Map([ // used in "iomlaid"
  ["AUD", "Australian dollar"],
  ["BGN", "Bulgarian lev"],
  ["BRL", "Brazilian real"],
  ["CAD", "Canadian dollar"],
  ["CHF", "Swiss franc"],
  ["CNY", "Chinese yuan renminbi"],
  ["CZK", "Czech koruna"],
  ["DKK", "Danish krone"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
  ["HKD", "Hong Kong dollar"],
  ["HRK", "Croatian kuna"],
  ["HUF", "Hungarian forint"],
  ["IDR", "Indonesian rupiah"],
  ["ILS", "Israeli shekel"],
  ["INR", "Indian rupee"],
  ["ISK", "Icelandic krona"],
  ["JPY", "Japanese yen"],
  ["KRW", "South Korean won"],
  ["MXN", "Mexican peso"],
  ["MYR", "Malaysian ringgit"],
  ["NOK", "Norwegian krone"],
  ["NZD", "New Zealand dollar"],
  ["PHP", "Philippine peso"],
  ["PLN", "Polish zloty"],
  ["RON", "Romanian leuv"],
  ["RUB", "Russian rouble"],
  ["SEK", "Swedish krona"],
  ["SGD", "Singapore dollar"],
  ["THB", "Thai baht"],
  ["TRY", "Turkish lira"],
  ["USD", "US dollar"],
  ["ZAR", "South African rand"]
]);

const Data_NewsCountries = ["ae", "ar", "at", "au", "be", "bg", "br", "ca", "ch", "cn", "co", "cu", "cz", "de", "eg", "fr", "gb", "gr", "hk", "hu", "id", "ie", "il", "in", "it", "jp", "kr", "lt", "lv", "ma", "mx", "my", "ng", "nl", "no", "nz", "ph", "pl", "pt", "ro", "rs", "ru", "sa", "se", "sg", "si", "sk", "th", "tr", "tw", "ua", "us", "ve", "za"]; // used in "news"

//ISO-639 Language Codes  used in "SpeechTranslate"
const Data_Country_CodesIso639 = new Map([
  ["auto", "Automatic"],
  ["af", "Afrikaans"],
  ["sq", "Albanian"],
  ["am", "Amharic"],
  ["ar", "Arabic"],
  ["hy", "Armenian"],
  ["az", "Azerbaijani"],
  ["eu", "Basque"],
  ["be", "Belarusian"],
  ["bn", "Bengali"],
  ["bs", "Bosnian"],
  ["bg", "Bulgarian"],
  ["ca", "Catalan"],
  ["ceb", "Cebuano"],
  ["ny", "Chichewa"],
  ["zh-cn", "Chinese s."],
  ["zh-tw", "Taiwan t."],
  ["zh-hk", "Hongkong t."],
  ["co", "Corsican"],
  ["hr", "Croatian"],
  ["cs", "Czech"],
  ["da", "Danish"],
  ["nl", "Dutch"],
  ["en", "English"],
  ["eo", "Esperanto"],
  ["et", "Estonian"],
  ["tl", "Filipino"],
  ["fi", "Finnish"],
  ["fr", "French"],
  ["fy", "Frisian"],
  ["gl", "Galician"],
  ["ka", "Georgian"],
  ["de", "German"],
  ["el", "Greek"],
  ["gu", "Gujarati"],
  ["ht", "Haitian Creole"],
  ["ha", "Hausa"],
  ["haw", "Hawaiian"],
  ["he", "Hebrew"],
  ["hi", "Hindi"],
  ["hmn", "Hmong"],
  ["hu", "Hungarian"],
  ["is", "Icelandic"],
  ["ig", "Igbo"],
  ["id", "Indonesian"],
  ["ga", "Irish"],
  ["it", "Italian"],
  ["ja", "Japanese"],
  ["jw", "Javanese"],
  ["kn", "Kannada"],
  ["kk", "Kazakh"],
  ["km", "Khmer"],
  ["ko", "Korean"],
  ["ku", "Kurdish (Kurmanji)"],
  ["ky", "Kyrgyz"],
  ["lo", "Lao"],
  ["la", "Latin"],
  ["lv", "Latvian"],
  ["lt", "Lithuanian"],
  ["lb", "Luxembourgish"],
  ["mk", "Macedonian"],
  ["mg", "Malagasy"],
  ["ms", "Malay"],
  ["ml", "Malayalam"],
  ["mt", "Maltese"],
  ["mi", "Maori"],
  ["mr", "Marathi"],
  ["mn", "Mongolian"],
  ["my", "Myanmar (Burmese)"],
  ["ne", "Nepali"],
  ["nb", "Norwegian"],
  ["ps", "Pashto"],
  ["fa", "Persian"],
  ["pl", "Polish"],
  ["pt", "Portuguese"],
  ["ma", "Punjabi"],
  ["ro", "Romanian"],
  ["ru", "Russian"],
  ["sm", "Samoan"],
  ["gd", "Scots Gaelic"],
  ["sr", "Serbian"],
  ["st", "Sesotho"],
  ["sn", "Shona"],
  ["sd", "Sindhi"],
  ["si", "Sinhala"],
  ["sk", "Slovak"],
  ["sl", "Slovenian"],
  ["so", "Somali"],
  ["es", "Spanish"],
  ["su", "Sundanese"],
  ["sw", "Swahili"],
  ["sv", "Swedish"],
  ["tg", "Tajik"],
  ["ta", "Tamil"],
  ["te", "Telugu"],
  ["th", "Thai"],
  ["tr", "Turkish"],
  ["uk", "Ukrainian"],
  ["ur", "Urdu"],
  ["uz", "Uzbek"],
  ["vi", "Vietnamese"],
  ["cy", "Welsh"],
  ["xh", "Xhosa"],
  ["yi", "Yiddish"],
  ["yo", "Yoruba"],
  ["zu", "Zulu]"]
]);

const Data_Country_CodesIso3166 = new Map([ // used in "News"
  ["AF", "Afghanistan"],
  ["AX", "Aland Islands"],
  ["AL", "Albania"],
  ["DZ", "Algeria"],
  ["AS", "American Samoa"],
  ["AD", "Andorra"],
  ["AO", "Angola"],
  ["AI", "Anguilla"],
  ["AQ", "Antarctica"],
  ["AG", "Antigua And Barbuda"],
  ["AR", "Argentina"],
  ["AM", "Armenia"],
  ["AW", "Aruba"],
  ["AU", "Australia"],
  ["AT", "Austria"],
  ["AZ", "Azerbaijan"],
  ["BS", "Bahamas"],
  ["BH", "Bahrain"],
  ["BD", "Bangladesh"],
  ["BB", "Barbados"],
  ["BY", "Belarus"],
  ["BE", "Belgium"],
  ["BZ", "Belize"],
  ["BJ", "Benin"],
  ["BM", "Bermuda"],
  ["BT", "Bhutan"],
  ["BO", "Bolivia"],
  ["BA", "Bosnia And Herzegovina"],
  ["BW", "Botswana"],
  ["BV", "Bouvet Island"],
  ["BR", "Brazil"],
  ["IO", "British Indian Ocean Territory"],
  ["BN", "Brunei Darussalam"],
  ["BG", "Bulgaria"],
  ["BF", "Burkina Faso"],
  ["BI", "Burundi"],
  ["KH", "Cambodia"],
  ["CM", "Cameroon"],
  ["CA", "Canada"],
  ["CV", "Cape Verde"],
  ["KY", "Cayman Islands"],
  ["CF", "Central African Republic"],
  ["TD", "Chad"],
  ["CL", "Chile"],
  ["CN", "China"],
  ["CX", "Christmas Island"],
  ["CC", "Cocos (Keeling) Islands"],
  ["CO", "Colombia"],
  ["KM", "Comoros"],
  ["CG", "Congo"],
  ["CD", "Congo, Democratic Republic"],
  ["CK", "Cook Islands"],
  ["CR", "Costa Rica"],
  ["CI", "Cote D\"Ivoire"],
  ["HR", "Croatia"],
  ["CU", "Cuba"],
  ["CY", "Cyprus"],
  ["CZ", "Czech Republic"],
  ["DK", "Denmark"],
  ["DJ", "Djibouti"],
  ["DM", "Dominica"],
  ["DO", "Dominican Republic"],
  ["EC", "Ecuador"],
  ["EG", "Egypt"],
  ["SV", "El Salvador"],
  ["GQ", "Equatorial Guinea"],
  ["ER", "Eritrea"],
  ["EE", "Estonia"],
  ["ET", "Ethiopia"],
  ["FK", "Falkland Islands (Malvinas)"],
  ["FO", "Faroe Islands"],
  ["FJ", "Fiji"],
  ["FI", "Finland"],
  ["FR", "France"],
  ["GF", "French Guiana"],
  ["PF", "French Polynesia"],
  ["TF", "French Southern Territories"],
  ["GA", "Gabon"],
  ["GM", "Gambia"],
  ["GE", "Georgia"],
  ["DE", "Germany"],
  ["GH", "Ghana"],
  ["GI", "Gibraltar"],
  ["GR", "Greece"],
  ["GL", "Greenland"],
  ["GD", "Grenada"],
  ["GP", "Guadeloupe"],
  ["GU", "Guam"],
  ["GT", "Guatemala"],
  ["GG", "Guernsey"],
  ["GN", "Guinea"],
  ["GW", "Guinea-Bissau"],
  ["GY", "Guyana"],
  ["HT", "Haiti"],
  ["HM", "Heard Island & Mcdonald Islands"],
  ["VA", "Holy See (Vatican City State)"],
  ["HN", "Honduras"],
  ["HK", "Hong Kong"],
  ["HU", "Hungary"],
  ["IS", "Iceland"],
  ["IN", "India"],
  ["ID", "Indonesia"],
  ["IR", "Iran, Islamic Republic Of"],
  ["IQ", "Iraq"],
  ["IE", "Ireland"],
  ["IM", "Isle Of Man"],
  ["IL", "Israel"],
  ["IT", "Italy"],
  ["JM", "Jamaica"],
  ["JP", "Japan"],
  ["JE", "Jersey"],
  ["JO", "Jordan"],
  ["KZ", "Kazakhstan"],
  ["KE", "Kenya"],
  ["KI", "Kiribati"],
  ["KR", "Korea"],
  ["KW", "Kuwait"],
  ["KG", "Kyrgyzstan"],
  ["LA", "Lao People\"s Democratic Republic"],
  ["LV", "Latvia"],
  ["LB", "Lebanon"],
  ["LS", "Lesotho"],
  ["LR", "Liberia"],
  ["LY", "Libyan Arab Jamahiriya"],
  ["LI", "Liechtenstein"],
  ["LT", "Lithuania"],
  ["LU", "Luxembourg"],
  ["MO", "Macao"],
  ["MK", "Macedonia"],
  ["MG", "Madagascar"],
  ["MW", "Malawi"],
  ["MY", "Malaysia"],
  ["MV", "Maldives"],
  ["ML", "Mali"],
  ["MT", "Malta"],
  ["MH", "Marshall Islands"],
  ["MQ", "Martinique"],
  ["MR", "Mauritania"],
  ["MU", "Mauritius"],
  ["YT", "Mayotte"],
  ["MX", "Mexico"],
  ["FM", "Micronesia, Federated States Of"],
  ["MD", "Moldova"],
  ["MC", "Monaco"],
  ["MN", "Mongolia"],
  ["ME", "Montenegro"],
  ["MS", "Montserrat"],
  ["MA", "Morocco"],
  ["MZ", "Mozambique"],
  ["MM", "Myanmar"],
  ["NA", "Namibia"],
  ["NR", "Nauru"],
  ["NP", "Nepal"],
  ["NL", "Netherlands"],
  ["NC", "New Caledonia"],
  ["NZ", "New Zealand"],
  ["NI", "Nicaragua"],
  ["NE", "Niger"],
  ["NG", "Nigeria"],
  ["NU", "Niue"],
  ["NF", "Norfolk Island"],
  ["MP", "Northern Mariana Islands"],
  ["NO", "Norway"],
  ["OM", "Oman"],
  ["PK", "Pakistan"],
  ["PW", "Palau"],
  ["PS", "Palestinian Territory, Occupied"],
  ["PA", "Panama"],
  ["PG", "Papua New Guinea"],
  ["PY", "Paraguay"],
  ["PE", "Peru"],
  ["PH", "Philippines"],
  ["PN", "Pitcairn"],
  ["PL", "Poland"],
  ["PT", "Portugal"],
  ["PR", "Puerto Rico"],
  ["QA", "Qatar"],
  ["RE", "Reunion"],
  ["RO", "Romania"],
  ["RU", "Russian Federation"],
  ["RW", "Rwanda"],
  ["BL", "Saint Barthelemy"],
  ["SH", "Saint Helena"],
  ["KN", "Saint Kitts And Nevis"],
  ["LC", "Saint Lucia"],
  ["MF", "Saint Martin"],
  ["PM", "Saint Pierre And Miquelon"],
  ["VC", "Saint Vincent And Grenadines"],
  ["WS", "Samoa"],
  ["SM", "San Marino"],
  ["ST", "Sao Tome And Principe"],
  ["SA", "Saudi Arabia"],
  ["SN", "Senegal"],
  ["RS", "Serbia"],
  ["SC", "Seychelles"],
  ["SL", "Sierra Leone"],
  ["SG", "Singapore"],
  ["SK", "Slovakia"],
  ["SI", "Slovenia"],
  ["SB", "Solomon Islands"],
  ["SO", "Somalia"],
  ["ZA", "South Africa"],
  ["GS", "South Georgia And Sandwich Isl."],
  ["ES", "Spain"],
  ["LK", "Sri Lanka"],
  ["SD", "Sudan"],
  ["SR", "Suriname"],
  ["SJ", "Svalbard And Jan Mayen"],
  ["SZ", "Swaziland"],
  ["SE", "Sweden"],
  ["CH", "Switzerland"],
  ["SY", "Syrian Arab Republic"],
  ["TW", "Taiwan"],
  ["TJ", "Tajikistan"],
  ["TZ", "Tanzania"],
  ["TH", "Thailand"],
  ["TL", "Timor-Leste"],
  ["TG", "Togo"],
  ["TK", "Tokelau"],
  ["TO", "Tonga"],
  ["TT", "Trinidad And Tobago"],
  ["TN", "Tunisia"],
  ["TR", "Turkey"],
  ["TM", "Turkmenistan"],
  ["TC", "Turks And Caicos Islands"],
  ["TV", "Tuvalu"],
  ["UG", "Uganda"],
  ["UA", "Ukraine"],
  ["AE", "United Arab Emirates"],
  ["GB", "United Kingdom"],
  ["US", "United States"],
  ["UM", "United States Outlying Islands"],
  ["UY", "Uruguay"],
  ["UZ", "Uzbekistan"],
  ["VU", "Vanuatu"],
  ["VE", "Venezuela"],
  ["VN", "Vietnam"],
  ["VG", "Virgin Islands, British"],
  ["VI", "Virgin Islands, U.S."],
  ["WF", "Wallis And Futuna"],
  ["EH", "Western Sahara"],
  ["YE", "Yemen"],
  ["ZM", "Zambia"],
  ["ZW", "Zimbabwe"]
]);

const Data_Country_GermanDistrics = [ //
  {
    LandDE: "Baden-Württemberg",
    LandEN: "Baden-Württemberg",
    abbr: "bw",
    dwd: "baw",
  },
  {
    LandDE: "Bayern",
    LandEN: "Bavaria",
    abbr: "by",
    dwd: "bay",
  },
  {
    LandDE: "Berlin",
    LandEN: "Berlin",
    abbr: "be",
    dwd: "bbb",
  },
  {
    LandDE: "Brandenburg",
    LandEN: "Brandenburg",
    abbr: "bb",
    dwd: "bbb",
  },
  {
    LandDE: "Bremen",
    LandEN: "Bremen",
    abbr: "hb",
    dwd: "nib",
  },
  {
    LandDE: "Hamburg",
    LandEN: "Hamburg",
    abbr: "hh",
    dwd: "shh",
  },
  {
    LandDE: "Hessen",
    LandEN: "Hesse",
    abbr: "he",
    dwd: "hes",
  },
  {
    LandDE: "Mecklenburg-Vorpommer",
    LandEN: "Mecklenburg-Western Pomerania",
    abbr: "mv",
    dwd: "mvp",
  },
  {
    LandDE: "Niedersachsen",
    LandEN: "Lower Saxony",
    abbr: "ni",
    dwd: "nib",
  },
  {
    LandDE: "Nordrhein-Westfalen",
    LandEN: "North Rhine-Westphalia",
    abbr: "nw",
    dwd: "nrw",
  },
  {
    LandDE: "Rheinland-Pfalz",
    LandEN: "Rhineland-Palatinate",
    abbr: "rp",
    dwd: "rps",
  },
  {
    LandDE: "Saarland",
    LandEN: "Saarland",
    abbr: "sl",
    dwd: "rps",
  },
  {
    LandDE: "Sachsen",
    LandEN: "Saxony",
    abbr: "sn",
    dwd: "sac",
  },
  {
    LandDE: "Sachsen-Anhalt",
    LandEN: "Saxony-Anhalt",
    abbr: "sa",
    dwd: "saa",
  },
  {
    LandDE: "Schleswig-Holstein",
    LandEN: "Schleswig-Holstein",
    abbr: "sh",
    dwd: "shh",
  },
  {
    LandDE: "Thüringen",
    LandEN: "Thuringia",
    abbr: "th",
    dwd: "thu",
  }
]

const Data_Leetspeak = new Map([
  ["A", ["4", "@", "/\\", "/-\\", "?", "^", "α", "λ"]],
  ["B", ["8", "|3", "ß", "l³", "13", "I3", "J3"]],
  ["C", ["(", "[", "<", "©", "¢"]],
  ["D", ["D", "|)", "|]", "Ð", "đ", "1)"]],
  ["E", ["3", "€", "&", "£", "ε"]],
  ["F", ["F", "|=", "PH", "|*|-|", "|\"", "ƒ", "l²"]],
  ["G", ["6", "&", "9"]],
  ["H", ["4", "#", "|-|", "}{", "]-[", "/-/", ")-("]],
  ["I", ["1", "!", "|", "][", "ỉ"]],
  ["J", ["J", "_|", "¿"]],
  ["K", ["K", "|<", "|{", "|(", "X"]],
  ["L", ["1", "|_", "£", "|", "][_"]],
  ["M", ["M", "/\\/\\", "/v\\", "|V|", "]V[", "|\\/|", "AA", "[]V[]", "|11", "/|\\", "^^", "(V)", "|Y|", "!\\/!"]],
  ["N", ["/V", "|\\|", "/\\/", "|V", "/\\\\/", "|1", "2", "?", "(\\)", "11", "r", "!\\!"]],
  ["O", ["0", "9", "()", "[]", "*", "°", "<>", "ø", "{[]}"]],
  ["P", ["9", "|°", "p", "|>", "|*", "[]D", "][D", "|²", "|?", "|D"]],
  ["Q", ["0_", "0,"]],
  ["R", ["2", "1²", "®", "?", "я", "12", ".-"]],
  ["S", ["5", "$", "§", "?", "ŝ", "ş"]],
  ["T", ["7", "+", "†", "']['", "|"]],
  ["U", ["U", "|_|", "µ", "[_]", "v"]],
  ["V", ["V", "\\/", "|/", "\\|", "\\'"]],
  ["W", ["W", "\\/\\/", "VV", "\\A/", "\\\\'", "uu", "\\^/", "\\|/", "uJ"]],
  ["X", ["X", "<", ")(", "}{", "%", "?", "×", "]["]],
  ["Y", ["Y", "`/", "°/", "¥"]],
  ["Z", ["2", "z", "\"/_"]],
  ["Ä", ["43", "°A°"]],
  ["Ö", ["03", "°O°"]],
  ["Ü", ["|_|3", "°U°"]],
  ["!", ["1", "!"]]
]);

const Data_Botanicals = [
  //no linebreak here
  {
    "plant": "Anis",
    "Botanische Familie": "Doldengewächse",
    "discomfort": ["Erkältungs-Beschwerden", "Stoffwechsel-Probleme", "Blähungen", "Magen-Beschwerden"],
    "effect": ["Entgiftend", "Appetitanregend", "Blähungstreibend"]
  },
  {
    "plant": "Augentrost",
    "Botanische Familie": "Rachenblütler",
    "discomfort": ["Augenentzündung"]
  },
  {
    "plant": "Bärentraube",
    "Botanische Familie": "Heidekrautgewächse",
    "discomfort": ["Nieren-Beschwerden"],
    "effect": ["Entwässernd"]
  },
  {
    "plant": "Bärlauch",
    "Botanische Familie": "Liliengewächse",
    "discomfort": ["Blähungen", "Bluthochdruck", "Blutniederdruck", "Blutreinigung", "Gefäßreinigend", "Magen-Beschwerden", "Immunsystemkräftigend", "Gicht- / Rheumabeschwerden", "Verdauungs-Probleme"],
    "effect": ["Appetitanregend", "Blutreinigend", "Blutdrucksenkend", "Blähungstreibend", "Cholesterinsenkend", "Darmfloraaufbauend", "Entgiftend", "Stoffwechselanregend", "Verdauungsfördernd"]
  },
  {
    "plant": "Bärwurz",
    "Botanische Familie": "Doldenblütler",
    "discomfort": ["Blähungen", "Stoffwechsel-Beschwerden"],
    "effect": ["Blutreinigend"]
  },
  {
    "plant": "Baldrian",
    "Botanische Familie": "Baldriangewächse",
    "discomfort": ["Magen-Beschwerden", "Schlaf-Beschwerden"],
    "effect": ["Beruhigend", "Entspannend", "Nervensystemstärkend"]
  },
  {
    "plant": "Basilikum",
    "Botanische Familie": "Lippenblütler",
    "discomfort": ["Magen-Beschwerden", "Leber- / Galle-Beschwerden", "Durchfall-Erkrankung", "Stoffwechsel-Beschwerden", "Verdauungs-Beschwerden", "Blähungen"],
    "effect": ["Appetitanregend", "Ballaststoffreich", "Entgiftend", "Appetitanregend"]
  },
  {
    "plant": "Beifuß",
    "Botanische Familie": "Korbblütler",
    "discomfort": ["Magen-Beschwerden", "Leber- / Galle-Beschwerden", "Verdauungs-Beschwerden"]
  },
  {
    "plant": "Beinwell",
    "Botanische Familie": "Raublattgewächse",
    "discomfort": ["Magen-Beschwerden", "Stoffwechsel-Beschwerden", "Haut-Probleme", "Gelenk-Beschwerden"],
    "effect": ["Blutreinigend"]
  },
  {
    "plant": "Bergamotte",
    "Botanische Familie": "Rautengewächse",
    "discomfort": ["Erkältungs-Beschwerden"],
    "effect": ["Appetitanregend"]
  },
  {
    "plant": "Birke",
    "Botanische Familie": "Birkengewächse",
    "discomfort": ["Gelenk-Beschwerden", "Stoffwechsel-Beschwerden", "Blasen- / Harnwegsbeschwerden"],
    "effect": ["Blutreinigend", "Entgiftend", "Entwässernd"]
  },
  {
    "plant": "Bockshornklee",
    "Botanische Familie": "Schmetterlingsblütler",
    "discomfort": ["Verdauungs-Beschwerden", "Haut-Probleme", "Blähungen", "Bluthochdruck", "Blutniederdruck"],
    "effect": ["Appetitanregend", "Ballaststoffreich", "Blut-/Gefäßreinigend", "Erkältungshemmend", "Entgiftend", "Immunsystemkräftigend"]
  },
  {
    "plant": "Bohnenkraut",
    "Botanische Familie": "Lippenblütler",
    "discomfort": ["Gicht- / Rheumabeschwerden", "Überreaktion des Immunsystems"],
    "effect": ["Appetitanregend"]
  },
  {
    "plant": "Boretsch",
    "Botanische Familie": "Boretschgewächse",
    "discomfort": ["Magen-Beschwerden", "Blasen- / Harnwegsbeschwerden", "Nieren-Beschwerden", "Gicht- / Rheumabeschwerden", "Stoffwechsel-Beschwerden"],
    "effect": ["Ballaststoffreich", "Blutreinigend", "Entwässernd"]
  },
  {
    "plant": "Brennessel",
    "Botanische Familie": "Nesselgewächse",
    "discomfort": ["Magen-Beschwerden", "Blasen- / Harnwegsbeschwerden", "Nieren-Beschwerden", "Gicht- / Rheumabeschwerden", "Stoffwechsel-Beschwerden"],
    "effect": ["Blutreinigend", "Entwässernd"]
  },
  {
    "plant": "Brunnenkresse",
    "Botanische Familie": "Kohlgewächse",
    "discomfort": ["Magen-Beschwerden", "Blasen- / Harnwegsbeschwerden", "Nieren-Beschwerden", "Gicht- / Rheumabeschwerden", "Stoffwechsel-Beschwerden"],
    "effect": ["Entwässernd", "Appetitanregend", "Blutreinigend"]
  },
  {
    "plant": "Cayennepfeffer",
    "Botanische Familie": "Nachtschattengewächse",
    "discomfort": ["Leber- / Galle-Beschwerden", "Magen-Beschwerden", "Blähungen", "Verdauungs-Probleme"],
    "effect": ["Verdauungsfördernd", "Appetitanregend"]
  },
  {
    "plant": "Chilli",
    "Botanische Familie": "Nachtschattengewächse",
    "discomfort": ["Magen-Beschwerden", "Blähungen"],
    "effect": ["Appetitanregend"]
  },
  {
    "plant": "Curry",
    "Botanische Familie": "Korbblütler",
    "discomfort": ["Magen-Beschwerden", "Leber- / Galle-Beschwerden", "Blähungen", "Verdauungs-Probleme"],
    "effect": ["Appetitanregend", "Blähungstreibend"]
  },
  {
    "plant": "Dill",
    "Botanische Familie": "Doldengewächse",
    "discomfort": ["Blähungen", "Magen-Beschwerden", "Stoffwechsel-Beschwerden"]
  },
  {
    "plant": "Dreiblatt",
    "Botanische Familie": "Binsengewächse",
    "discomfort": ["Blasen- / Harnwegsbeschwerden", "Nieren-Beschwerden", "Stoffwechsel-Beschwerden"],
    "effect": ["Entwässernd", "Entsäuernd", "Entgiftend"]
  },
  {
    "plant": "Echinacea",
    "Botanische Familie": "Korbblütler",
    "discomfort": ["Erkältungskrankheiten"],
    "effect": ["Immunsystemkräftigend"]
  },
  {
    "plant": "Ehrenpreis",
    "Botanische Familie": "Rachenblütler",
    "discomfort": ["Asthma-Beschwerden", "Stoffwechsel-Probleme"]
  },
  {
    "plant": "Eibisch",
    "Botanische Familie": "Malvengewächse",
    "discomfort": ["Erkältungs-Beschwerden", "Stoffwechsel-Beschwerden", "Magen-Beschwerden"],
    "effect": ["Auswurffördernd"]
  },
  {
    "plant": "Enzian",
    "Botanische Familie": "Enziangewächse",
    "discomfort": ["Magen-Beschwerden", "Blähungen", "Leber- / Galle-Beschwerden", "Verdauungs-Probleme"],
    "effect": ["Appetitanregend", "Immunsystemkräftigend"]
  },
  {
    "plant": "Estragon",
    "Botanische Familie": "Korbblütler",
    "discomfort": ["Magen-Beschwerden"],
    "effect": ["Immunsystemkräftigend", "Appetitanregend", "Verdauungsfördernd"]
  },
  {
    "plant": "Fenchel",
    "Botanische Familie": "Doldengewächse",
    "discomfort": ["Blähungen", "Magen-Beschwerden", "Erkältungs-Beschwerden", "Stoffwechsel-Beschwerden", "Durchfall-Erkrankung"],
    "effect": ["Blutreinigend", "Blutdrucksenkend", "Entwässernd", "Appetitanregend"]
  },
  {
    "plant": "Frauenmantel",
    "Botanische Familie": "Rosengewächse",
    "discomfort": ["Blasen- / Harnwegsbeschwerden", "Frauenleiden"]
  },
  {
    "plant": "Giersch",
    "Botanische Familie": "Doldengewächse",
    "discomfort": ["Magen-Beschwerden", "Gicht- / Rheumabeschwerden"],
    "effect": ["Entwässernd"]
  },
  {
    "plant": "Ginseng",
    "Botanische Familie": "Aralyengewächse",
    "discomfort": ["Alterserscheinungen"]
  },
  {
    "plant": "Grüner Tee",
    "Botanische Familie": "Teestrauchgewächse",
    "discomfort": ["Stoffwechsel-Probleme"],
    "effect": ["Immunsystemkräftigend", "Blutreinigend", "Entgiftend", "Gefäßreinigend", "Stoffwechselanregend"]
  },
  {
    "plant": "Hafer grün",
    "Botanische Familie": "Süßgräser",
    "discomfort": ["Blasen- / Harnwegsbeschwerden", "Gicht- / Rheumabeschwerden", "Stoffwechsel-Beschwerden", "Gelenk-Beschwerden", "Nieren-Beschwerden"],
    "effect": ["Gefäßreinigend", "Blutreinigend"]
  },
  {
    "plant": "Heidelbeere",
    "Botanische Familie": "Heidekrautgewächse",
    "discomfort": ["Durchfall-Erkrankung", "Blähungen", "Magen-Beschwerden", "Stoffwechsel-Beschwerden"],
    "effect": ["Immunsystemkräftigend"]
  },
  {
    "plant": "Hirtentäschel",
    "Botanische Familie": "Kohlgewächse",
    "discomfort": ["Magen-Beschwerden", "Blasen- / Harnwegsbeschwerden", "Nieren-Beschwerden", "Gicht- / Rheumabeschwerden", "Stoffwechsel-Beschwerden"],
    "effect": ["Blutreinigend", "Entwässernd", "Appetitanregend", "Blutreinigend"]
  },
  {
    "plant": "Holunder",
    "Botanische Familie": "Geißblattgewächse",
    "discomfort": ["Stoffwechsel-Beschwerden", "Fieber", "Erkältungs-Beschwerden"],
    "effect": ["Immunsystemkräftigend", "Appetitanregend", "Entgiftend"]
  },
  {
    "plant": "Hopfen",
    "Botanische Familie": "Maulbeergewächse",
    "discomfort": ["Magen-Beschwerden", "Leber- / Galle-Beschwerden", "Schlafprobleme"],
    "effect": ["Beruhigend"]
  },
  {
    "plant": "Ingwer",
    "Botanische Familie": "Ingwergewächse",
    "discomfort": ["Magen-Beschwerden", "Leber- / Galle-Beschwerden", "Blähungen", "Erkältungs-Beschwerden"],
    "effect": ["Appetitanregend", "Blähungstreibend", "Entgiftend", "Darmfloraaufbauend"]
  },
  {
    "plant": "Isländisches Moos",
    "Botanische Familie": "Laubflechten",
    "discomfort": ["Erkältungs-Beschwerden", "Reizhusten"]
  },
  {
    "plant": "Johanniskraut",
    "Botanische Familie": "Johanniskrautgewächse",
    "discomfort": ["Leber- / Galle-Beschwerden", "Stoffwechsel-Beschwerden", "Frauenleiden", "Magen-Beschwerden", "Gelenk-Beschwerden", "Haut-Probleme"],
    "effect": ["Nervensystemstärkend", "Immunsystemkräftigend"]
  },
  {
    "plant": "Kalmus",
    "Botanische Familie": "Arongewächse",
    "discomfort": ["Magen-Beschwerden", "Blähungen", "Verdauungs-Probleme"],
    "effect": ["Immunsystemkräftigend"]
  },
  {
    "plant": "Kamille",
    "Botanische Familie": "Korbblütler",
    "discomfort": ["Blähungen", "Frauenleiden", "Haut-Probleme", "Magen-Beschwerden", "Stoffwechsel-Beschwerden", "Zahnfleischentzündung", "Schlaf-Beschwerden", "Blasen- / Harnwegsbeschwerden"],
    "effect": ["Krampflösend"]
  },
  {
    "plant": "Kapern",
    "Botanische Familie": "Kaperngewächse",
    "discomfort": ["Magen-Beschwerden", "Blasen- / Harnwegsbeschwerden", "Erkältungs-Beschwerden"],
    "effect": ["Entwässernd"]
  },
  {
    "plant": "Kapuzinerkresse",
    "Botanische Familie": "Kapuzinerkressengewächse",
    "discomfort": ["Magen-Beschwerden", "Blasen- / Harnwegsbeschwerden", "Nieren-Beschwerden", "Gicht- / Rheumabeschwerden", "Stoffwechsel-Beschwerden"],
    "effect": ["Appetitanregend", "Blutreinigend", "Entwässernd"]
  },
  {
    "plant": "Kardamom",
    "Botanische Familie": "Ingwergewächse",
    "discomfort": ["Magen-Beschwerden", "Leber- / Galle-Beschwerden", "Blähungen"],
    "effect": ["Appetitanregend"]
  },
  {
    "plant": "Karotte",
    "Botanische Familie": "Doldengewächse",
    "discomfort": ["Magen-Beschwerden", "Stoffwechsel-Beschwerden", "Durchfall-Erkrankung"],
    "effect": ["Appetitanregend", "Entgiftend"]
  },
  {
    "plant": "Kerbel",
    "Botanische Familie": "Doldengewächse",
    "discomfort": ["Blähungen", "Magen-Beschwerden", "Stoffwechsel-Probleme"]
  },
  {
    "plant": "Knoblauch",
    "Botanische Familie": "Liliengewächse",
    "discomfort": ["Bluthochdruck", "Immunsystemschwäche"],
    "effect": ["Immunsystemkräftigend", "Blut- / Gefäßreinigend", "Blähungstreibend", "Darmfloraaufbauend", "Cholesterinsenkend", "Entgiftend", "Verdauungsfördernd"]
  },
  {
    "plant": "Koriander",
    "Botanische Familie": "Doldengewächse",
    "discomfort": ["Magen-Beschwerden", "Blähungen", "Verdauungs-Probleme"],
    "effect": ["Darmfloraaufbauend", "Blähungstreibend", "Verdauungsfördernd"]
  },
  {
    "plant": "Kresse",
    "Botanische Familie": "Kreuzblütler",
    "discomfort": ["Blähungen", "Magen-Beschwerden", "Leber- / Galle-Beschwerden", "Stoffwechsel-Beschwerden", "Blutreinigung", "Erkältungs-Beschwerden"],
    "effect": ["Entwässernd"]
  },
  {
    "plant": "Kreuzkümmel",
    "Botanische Familie": "Doldenblütler",
    "discomfort": ["Erkältungs-Beschwerden", "Menstruationsbeschwerden", "Blähungen", "Völlegefühl"],
    "effect": ["Blähungstreibend", "Appetitanregend"]
  },
  {
    "plant": "Kümmel",
    "Botanische Familie": "Doldengewächse",
    "discomfort": ["Leber- / Galle-Beschwerden", "Verdauungs-Beschwerden", "Stoffwechsel-Beschwerden", "Blähungen"],
    "effect": ["Immunsystemkräftigend"]
  },
  {
    "plant": "Kurkuma",
    "Botanische Familie": "Ingwergewächse",
    "discomfort": ["Magen-Beschwerden", "Herzbeschwerden"],
    "effect": ["Blähungstreibend", "Stoffwechselanregend", "Appetitanregend"]
  },
  {
    "plant": "Lapacho",
    "Botanische Familie": "Trompetenbaumgewächse",
    "discomfort": ["Blasen- / Harnwegsbeschwerden", "Nieren-Beschwerden", "Blähungen", "Frauenleiden", "Gicht- / Rheumabeschwerden", "Stoffwechsel-Beschwerden", "Verdauungs-Beschwerden"],
    "effect": ["Entwässernd", "Entsäuernd", "Entgiftend", "Blutreinigend", "Immunsystemkräftigend"]
  },
  {
    "plant": "Lauch",
    "Botanische Familie": "Allioideae",
    "discomfort": ["Leber- / Galle-Beschwerden", "Magen-Beschwerden", "Durchfall-Erkrankung"]
  },
  {
    "plant": "Lavendel",
    "Botanische Familie": "Lippenblütler",
    "discomfort": ["Haut-Probleme", "Frauenleiden", "Blähungen", "Magen-Beschwerden", "Gicht- / Rheumabeschwerden", "Schlafprobleme"],
    "effect": ["Nervensystemstärkend", "Beruhigend"]
  },
  {
    "plant": "Liebstöckel",
    "Botanische Familie": "Doldenblütler",
    "discomfort": ["Magen-Beschwerden", "Stoffwechsel-Beschwerden", "Blutreinigung", "Blähungen", "Nieren-Beschwerden"],
    "effect": ["Entgiftend", "Verdauungsfördernd", "Entwässernd"]
  },
  {
    "plant": "Lindenblüte",
    "Botanische Familie": "Lindengewächse",
    "discomfort": ["Fieber"],
    "effect": ["Schweißtreibend"]
  },
  {
    "plant": "Löwenzahn",
    "Botanische Familie": "Korbblütler",
    "discomfort": ["Magen-Beschwerden", "Leber- / Galle-Beschwerden", "Blähungen"],
    "effect": ["Entsäuernd", "Blutreinigend", "Entwässernd"]
  },
  {
    "plant": "Lorbeer",
    "Botanische Familie": "Lorbeergewächse",
    "discomfort": ["Stoffwechsel-Beschwerden", "Magen-Beschwerden"],
    "effect": ["Immunsystemkräftigend"]
  },
  {
    "plant": "Lungenkraut",
    "Botanische Familie": "Boretschgewächse",
    "discomfort": ["Erkältungs-Beschwerden"],
    "effect": ["Auswurffördernd"]
  },
  {
    "plant": "Majoran",
    "Botanische Familie": "Lippenblütler",
    "discomfort": ["Magen-Beschwerden", "Leber- / Galle-Beschwerden", "Erkältungs-Beschwerden", "Blähungen"],
    "effect": ["Blähungstreibend", "Appetitanregend", "Immunsystemkräftigend", "Verdauungsfördernd"]
  },
  {
    "plant": "Meerettich",
    "Botanische Familie": "Kohlgewächse",
    "discomfort": ["Nieren-Beschwerden", "Erkältungs-Beschwerden", "Stoffwechsel-Beschwerden", "Verdauungs-Beschwerden", "Magen-Beschwerden", "Gicht- / Rheumabeschwerden"],
    "effect": ["Verdauungsfördernd", "Entgiftend", "Appetitanregend", "Immunsystemkräftigend"]
  },
  {
    "plant": "Melisse",
    "Botanische Familie": "Lippenblütler",
    "discomfort": ["Magen-Beschwerden", "Leber- / Galle-Beschwerden", "Schlaf-Beschwerden", "Stoffwechsel-Beschwerden"],
    "effect": ["Nervensystemstärkend", "Beruhigend"]
  },
  {
    "plant": "Minze",
    "Botanische Familie": "Lippenblütler",
    "discomfort": ["Magen-Beschwerden", "Blähungen", "Leber- / Gallebeschwerden"],
    "effect": ["Immunsystemkräftigend"]
  },
  {
    "plant": "Mistel",
    "Botanische Familie": "Mistelgewächse",
    "discomfort": ["Bluthochdruck"],
    "effect": ["Herzkräftigend", "Blutdrucksenkend", "Gefäßreinigend"]
  },
  {
    "plant": "Muskat Nuß",
    "Botanische Familie": "Myrtengewächse",
    "discomfort": ["Magen-Beschwerden", "Leber- / Galle-Beschwerden", "Stoffwechsel-Probleme"]
  },
  {
    "plant": "Muskateller Salbei",
    "Botanische Familie": "Lippenblütler",
    "discomfort": ["Stoffwechsel-Beschwerden", "Magen-Beschwerden", "Mund- / Zahn-Hygiene", "Blasen- / Harnwegsbeschwerden", "Frauenleiden"],
    "effect": ["Immunsystemkräftigend", "Schweißhemmend"]
  },
  {
    "plant": "Odermenning",
    "Botanische Familie": "Rosengewächse",
    "discomfort": ["Magen-Beschwerden", "Leber- / Gallebeschwerden"],
    "effect": ["Ballaststoffreich"]
  },
  {
    "plant": "Oregano",
    "Botanische Familie": "Lippenblütler",
    "discomfort": ["Magen-Beschwerden", "Leber- / Galle-Beschwerden", "Erkältungs-Beschwerden", "Blähungen"],
    "effect": ["Appetitanregend", "Ballaststoffreich"]
  },
  {
    "plant": "Paprika",
    "Botanische Familie": "Nachtschattengewächse",
    "discomfort": ["Leber- / Galle-Beschwerden", "Magen-Beschwerden", "Blähungen", "Verdauungs-Probleme"],
    "effect": ["Verdauungsfördernd", "Appetitanregend"]
  },
  {
    "plant": "Petersilie",
    "Botanische Familie": "Doldengewächse",
    "discomfort": ["Magen-Beschwerden", "Leber- / Galle-Beschwerden", "Stoffwechsel-Beschwerden", "Durchfall-Erkrankung", "Blähungen", "Blasen- / Harnwegsbeschwerden", "Gelenk-Beschwerden", "Nieren-Beschwerden"],
    "effect": ["Entwässernd", "Blutdrucksenkend"]
  },
  {
    "plant": "Pfeffer",
    "Botanische Familie": "Pfeffergewächse",
    "discomfort": ["Leber- / Galle-Beschwerden", "Verdauungs-Beschwerden", "Magen-Beschwerden", "Blähungen"],
    "effect": ["Appetitanregend"]
  },
  {
    "plant": "Pfefferminze",
    "Botanische Familie": "Lippenblütler",
    "discomfort": ["Magen-Beschwerden", "Blähungen", "Leber- / Galle-Beschwerden", "Erkältungs-Beschwerden", "Durchfall-Erkrankung"],
    "effect": ["Immunsystemkräftigend"]
  },
  {
    "plant": "Piment",
    "Botanische Familie": "Myrtengewächse",
    "discomfort": ["Magen-Beschwerden", "Stoffwechsel-Beschwerden", "Verdauungs-Probleme"],
    "effect": ["Entgiftend", "Appetitanregend", "Darmfloraaufbauend"]
  },
  {
    "plant": "Preiselbeere",
    "Botanische Familie": "Heidekrautgewächse",
    "discomfort": ["Durchfall-Erkrankung", "Blähungen", "Magen-Beschwerden", "Stoffwechsel-Beschwerden"],
    "effect": ["Blähungshemmend", "Immunsystemkräftigend"]
  },
  {
    "plant": "Pu-Erh Tee",
    "Botanische Familie": "Teestrauchgewächse",
    "discomfort": ["Durchfall-Erkrankung", "Stoffwechsel-Probleme"],
    "effect": ["Immunsystemkräftigend", "Gefäßreinigend", "Stoffwechselanregend"]
  },
  {
    "plant": "Ringelblume",
    "Botanische Familie": "Korbblütler",
    "discomfort": ["Haut-Probleme"],
    "effect": ["Entzündungshemmend"]
  },
  {
    "plant": "Rooibusch",
    "Botanische Familie": "Rotbuschgewächse",
    "discomfort": ["Blasen- / Harnwegsbeschwerden", "Nieren-Beschwerden"],
    "effect": ["Entwässernd", "Immunsystemkräftigend", "Anregend"]
  },
  {
    "plant": "Rosenpaprika",
    "Botanische Familie": "Nachtschattengewächse",
    "discomfort": ["Leber- / Galle-Beschwerden", "Magen-Beschwerden", "Blähungen", "Verdauungs-Probleme"],
    "effect": ["Verdauungsfördernd", "Appetitanregend"]
  },
  {
    "plant": "Rosmarin",
    "Botanische Familie": "Lippenblütler",
    "discomfort": ["Blutniederdruck", "Verdauungs-Beschwerden", "Leber- / Galle-Beschwerden"],
    "effect": ["Anregend", "Nervensystemstärkend", "Durchblutungsfördernd", "Immunsystemkräftigend"]
  },
  {
    "plant": "Safran",
    "Botanische Familie": "Schwertliliengewächse",
    "discomfort": ["Muskelschwäche", "Magenträgheit", "Lichtempfindlichkeit", "Konzentrationsschwäche", "Haut-Probleme", "Magen-Beschwerden"]
  },
  {
    "plant": "Salbei",
    "Botanische Familie": "Lippenblütler",
    "discomfort": ["Erkältungs-Beschwerden", "Stoffwechsel-Beschwerden", "Haut-Probleme", "Magen-Beschwerden", "Mund- / Zahn-Hygiene", "Blähungen", "Blasen- / Harnwegsbeschwerden", "Frauenleiden"],
    "effect": ["Schweißhemmend", "Auswurffördernd", "Immunsystemkräftigend"]
  },
  {
    "plant": "Sauerampfer",
    "Botanische Familie": "Knöterichgewächse",
    "discomfort": ["Stoffwechsel-Beschwerden", "Magen-Beschwerden", "Blasen- / Harnwegsbeschwerden", "Blähungen"],
    "effect": ["Immunsystemkräftigend", "Schweißhemmend", "Appetitanregend", "Blutreinigend"]
  },
  {
    "plant": "Schafgarbe",
    "Botanische Familie": "Korbblütler",
    "discomfort": ["Magen-Beschwerden", "Leber- / Galle-Beschwerden", "Gelenk-Beschwerden", "Stoffwechsel-Beschwerden", "Frauenleiden"],
    "effect": ["Blutreinigend", "Entwässernd", "Entgiftend"]
  },
  {
    "plant": "Schnittlauch",
    "Botanische Familie": "Liliengewächse",
    "discomfort": ["Stoffwechsel-Beschwerden", "Blasen- / Harnwegsbeschwerden"]
  },
  {
    "plant": "Schöllkraut",
    "Botanische Familie": "Mohngewächse",
    "discomfort": ["Haut-Probleme"]
  },
  {
    "plant": "Schwarzkümmel",
    "Botanische Familie": "Hahnenfußgewächse",
    "discomfort": ["Magen-Beschwerden", "Leber- / Galle-Beschwerden", "Blähungen", "Gelenk-Beschwerden", "Frauenleiden", "Erkältungs-Beschwerden", "Haut-Probleme", "Stoffwechsel-Beschwerden", "Verdauungs-Beschwerden", "Gicht- / Rheumabeschwerden", "Asthma-Beschwerden"],
    "effect": ["Blähungstreibend", "Verdauungsfördernd", "Auswurffördernd", "Atemprobleme", "Immunsystemkräftigend"]
  },
  {
    "plant": "Senf",
    "Botanische Familie": "Kohlgewächse",
    "discomfort": ["Leber- / Galle-Beschwerden", "Magen-Beschwerden", "Blähungen", "Stoffwechsel-Probleme"],
    "effect": ["Blähungstreibend", "Verdauungsfördernd", "Entgiftend", "Immunsystemkräftigend", "Ballaststoffreich"]
  },
  {
    "plant": "Spitzwegerich",
    "Botanische Familie": "Wegerichgewächse",
    "discomfort": ["Erkältungs-Beschwerden", "Gicht- / Rheumabeschwerden"],
    "effect": ["Auswurffördernd", "Entwässernd"]
  },
  {
    "plant": "Tausendgüldenkraut",
    "Botanische Familie": "Enziangewächse",
    "discomfort": ["Gicht- / Rheumabeschwerden", "Bindegewebsschwäche"],
    "effect": ["Gallenflussfördernd"]
  },
  {
    "plant": "Teebaumöl",
    "Botanische Familie": "Myrtengewächse",
    "discomfort": ["Mund- / Zahn-Hygiene", "Erkältungs-Beschwerden", "Haut-Probleme", "Gelenk-Beschwerden"],
    "effect": ["Immunsystemkräftigend"]
  },
  {
    "plant": "Thymian",
    "Botanische Familie": "Lippenblütler",
    "discomfort": ["Magen-Beschwerden", "Leber- / Galle-Beschwerden", "Asthma-Beschwerden", "Erkältungs-Beschwerden", "Verdauungs-Probleme"]
  },
  {
    "plant": "Wacholderbeere",
    "Botanische Familie": "Zypressengewächse",
    "discomfort": ["Blasen- / Harnwegsbeschwerden"]
  },
  {
    "plant": "Weidenröschen",
    "Botanische Familie": "Nachtkerzengewächse",
    "discomfort": ["Blasen- / Harnwegsbeschwerden", "Nieren-Beschwerden", "Stoffwechsel-Beschwerden"],
    "effect": ["Entwässernd", "Entsäuernd", "Entgiftend"]
  },
  {
    "plant": "Weißdorn",
    "Botanische Familie": "Rosengewächse",
    "discomfort": ["Appetitanregend"],
    "effect": ["Herzkräftigend", "Blutdruckregulierend"]
  },
  {
    "plant": "Wermut",
    "Botanische Familie": "Korbblütler",
    "discomfort": ["Magen-Beschwerden", "Leber- / Galle-Beschwerden", "Verdauungs-Beschwerden", "Erkältungs-Beschwerden", "Gelenk-Beschwerden"]
  },
  {
    "plant": "Ysop",
    "Botanische Familie": "Lippenblütler",
    "discomfort": ["Magen-Beschwerden", "Stoffwechsel-Beschwerden", "Blutniederdruck"],
    "effect": ["Blutreinigung", "Immunsystemkräftigend"]
  },
  {
    "plant": "Zimt",
    "Botanische Familie": "Lorbeergewächse",
    "discomfort": ["Verdauungs-Beschwerden", "Blutniederdruck"],
    "effect": ["Nervensystemstärkend", "Immunsystemkräftigend", "Appetitanregend"]
  },
  {
    "plant": "Zinnkraut",
    "Botanische Familie": "Schachtelhalmgewächse",
    "discomfort": ["Blutreinigung", "Blasen- / Harnwegsbeschwerden", "Gicht- / Rheumabeschwerden", "Stoffwechsel-Beschwerden", "Erkältungs-Beschwerden"]
  },
  {
    "plant": "Zwiebel",
    "Botanische Familie": "Liliengewächse",
    "discomfort": ["Blasen- / Harnwegsbeschwerden", "Erkältungs-Beschwerden", "Magen-Beschwerden", "Gicht- / Rheumabeschwerden", "Stoffwechsel-Probleme"],
    "effect": ["Blutreinigend", "Immunsystemkräftigend"]
  }
];

const Data_PlatLesen = new Map([
  ["0", "Diplomatisches Corps"],
  [0 - 1, "Dienstkraftwagen des Bundespräsidenten"],
  [0 - 2, "Dienstkraftwagen des Bundeskanzlers"],
  [1 - 1, "Dienstkraftwagen des Bundestagspräsidenten"],
  ["A", "Augsburg"],
  ["AA", "Ostalbkreis (Aalen)"],
  ["AB", "Aschaffenburg"],
  ["ABG", "Altenburg"],
  ["AC", "Aachen"],
  ["AD", "US-Streitkräfte in Deutschland"],
  ["AE", "Auerbach"],
  ["AF", "US-Streitkräfte in Deutschland"],
  ["AH", "Ahaus"],
  ["AIB", "Bad Aibling"],
  ["AIC", "Aichach-Friedberg (Aichach)"],
  ["AK", "Altenkirchen [Westerwald]"],
  ["AL", "Altena [Westfalen]"],
  ["ALF", "Alfeld [Leine]"],
  ["ALS", "Alsfeld [Oberhessen]"],
  ["ALZ", "Alzenau [Unterfranken]"],
  ["AM", "Amberg"],
  ["AN", "Ansbach"],
  ["ANA", "Annaberg (Annaberg-Buchholz)"],
  ["ANG", "Angermünde"],
  ["ANK", "Anklam"],
  ["AÖ", "Altötting"],
  ["AP", "Weimarer Land (Apolda)"],
  ["APD", "Apolda"],
  ["AR", "Arnsberg [Westfalen]"],
  ["ARN", "Arnstadt"],
  ["ART", "Artern"],
  ["AS", "Amberg-Sulzbach (Amberg)"],
  ["ASD", "Aschendorf-Hümmling (Papenburg-Aschendorf)"],
  ["ASL", "Aschersleben-Stassfurter Landkreis (Aschersleben)"],
  ["ASZ", "Westerzgebirgskreis (Aue/Schwarzenberg)"],
  ["AT", "Altentreptow"],
  ["AU", "Aue"],
  ["AUR", "Aurich"],
  ["AW", "Ahrweiler (Bad Neuenahr-Ahrweiler)"],
  ["AZ", "Alzey-Worms (Alzey)"],
  ["AZE", "Anhalt-Zerbst (Coswig)"],
  ["B", "Berlin"],
  ["BA", "Bamberg"],
  ["BAD", "Baden-Baden"],
  ["BAR", "Barnim (Eberswalde)"],
  ["BB", "Böblingen"],
  ["BBG", "Bernburg"],
  ["BBL", "Brandenburg"],
  ["BC", "Biberach [Riß]"],
  ["BCH", "Buchen [Odenwald]"],
  ["BD", "Bundestag, Bundesrat, Bundesregierung"],
  ["BE", "Beckum [Westfalen]"],
  ["BED", "Brand-Erbisdorf"],
  ["BEI", "Beilngries"],
  ["BEL", "Belzig"],
  ["BER", "Bernau [bei Berlin]"],
  ["BF", "Steinfurt (Burgsteinfurt)"],
  ["BG", "Bundesgrenzschutz"],
  ["BGD", "Berchtesgaden"],
  ["BGL", "Berchtesgadener Land (Bad Reichenhall)"],
  ["BH", "Bühl [Baden]"],
  ["BI", "Bielefeld"],
  ["BID", "Biedenkopf"],
  ["BIN", "Bingen [Rhein]"],
  ["BIR", "Birkenfeld [Nahe]"],
  ["BIT", "Bitburg-Prüm (Bitburg)"],
  ["BIW", "Bischofswerda"],
  ["BK", "Backnang"],
  ["BKS", "Bernkastel (Bernkastel-Kues)"],
  ["BL", "Zollernalbkreis (Balingen)"],
  ["BLB", "Wittgenstein (Bad Berleburg)"],
  ["BLK", "Burgenlandkreis (Naumburg)"],
  ["BM", "Erftkreis (Bergheim)"],
  ["BN", "Bonn"],
  ["BNA", "Borna"],
  ["BO", "Bochum"],
  ["BOG", "Bogen"],
  ["BOH", "Bocholt"],
  ["BOR", "Borken"],
  ["BÖ", "Bördekreis (Oschersleben)"],
  ["BOT", "Bottrop"],
  ["BP", "Deutsche Bundespost (<1997)"],
  ["BR", "Bruchsal"],
  ["BRA", "Wesermarsch (Brake [Unterweser])"],
  ["BRB", "Brandenburg [Landkreis]"],
  ["BRB", "Brandenburg [Stadt]"],
  ["BRG", "Burg"],
  ["BRI", "Brilon"],
  ["BRK", "Bad Brückenau"],
  ["BRL", "Blankenburg (Braunlage [Harz])"],
  ["BRV", "Bremervörde"],
  ["BS", "Braunschweig"],
  ["BSB", "Bersenbrück"],
  ["BSK", "Beeskow"],
  ["BT", "Bayreuth"],
  ["BTF", "Bitterfeld"],
  ["BU", "Burgdorf [bei Lehrte]"],
  ["BÜD", "Büdingen [Oberhessen]"],
  ["BUL", "Burglengenfeld"],
  ["BÜR", "Büren [Westfalen]"],
  ["BÜS", "Büsingen am Hochrhein"],
  ["BÜZ", "Bützow"],
  ["BW", "Bundes-Wasser- und Schiffahrtsverwaltung"],
  ["BWL", "Baden-Württemberg"],
  ["BYL", "Bayern"],
  ["BZ", "Bautzen"],
  ["BZA", "Bergzabern"],
  ["C", "Chemnitz [Landkreis]"],
  ["C", "Chemnitz [Stadt]"],
  ["CA", "Calau"],
  ["CAS", "Castrop-Rauxel"],
  ["CB", "Cottbus [Landkreis]"],
  ["CB", "Cottbus [Stadt]"],
  ["CE", "Celle"],
  ["CHA", "Cham [Oberpfalz]"],
  ["CLP", "Cloppenburg"],
  ["CLZ", "Clausthal-Zellerfeld"],
  ["CO", "Coburg"],
  ["COC", "Cochem-Zell (Cochem)"],
  ["COE", "Coesfeld [Westfalen]"],
  ["CR", "Crailsheim"],
  ["CUX", "Cuxhaven"],
  ["CW", "Calw"],
  ["D", "Düsseldorf"],
  ["DA", "Darmstadt"],
  ["DAH", "Dachau"],
  ["DAN", "Lüchow-Dannenberg (Lüchow)"],
  ["DAU", "Daun [Eifel]"],
  ["DB", "Deutsche Bundesbahn"],
  ["DBR", "Bad Doberan"],
  ["DD", "Dresden"],
  ["DE", "Dessau"],
  ["DEG", "Deggendorf"],
  ["DEL", "Delmenhorst [Stadt]"],
  ["DGF", "Dingolfing-Landau (Dingolfing)"],
  ["DH", "Diepholz"],
  ["DI", "Dieburg"],
  ["DIL", "Dillkreis (Dillenburg)"],
  ["DIN", "Dinslaken"],
  ["DIZ", "Unterlahnkreis (Diez)"],
  ["DKB", "Dinkelsbühl"],
  ["DL", "Döbeln"],
  ["DLG", "Dillingen [Donau]"],
  ["DM", "Demmin"],
  ["DN", "Düren"],
  ["DO", "Dortmund"],
  ["DON", "Donau-Ries (Donauwörth)"],
  ["DS", "Donaueschingen"],
  ["DT", "Lippe (Detmold)"],
  ["DU", "Duisburg"],
  ["DUD", "Duderstadt"],
  ["DÜW", "Bad Dürkheim [Weinstraße]"],
  ["DW", "Weisseritzkreis (Dippoldiswalde)"],
  ["DZ", "Delitzsch"],
  ["E", "Essen"],
  ["EA", "Eisenach [Stadt]"],
  ["EB", "Eilenburg"],
  ["EBE", "Ebersberg"],
  ["EBN", "Ebern"],
  ["EBS", "Ebermannstadt"],
  ["ECK", "Eckernförde"],
  ["ED", "Erding"],
  ["EE", "Elbe-Elster (Herzberg)"],
  ["EF", "Erfurt [Landkreis]"],
  ["EF", "Erfurt [Stadt]"],
  ["EG", "Eggenfelden"],
  ["EH", "Eisenhüttenstadt"],
  ["EHI", "Ehingen [Donau]"],
  ["EI", "Eichstätt"],
  ["EIC", "Eichsfeld (Heiligenstadt)"],
  ["EIH", "Eichstätt"],
  ["EIL", "Eisleben"],
  ["EIN", "Einbeck"],
  ["EIS", "Eisenberg"],
  ["EL", "Emsland (Meppen)"],
  ["EM", "Emmendingen"],
  ["EMD", "Emden"],
  ["EMS", "Rhein-Lahn-Kreis (Bad Ems)"],
  ["EN", "Ennepe-Ruhr-Kreis (Schwelm)"],
  ["ER", "Erlangen"],
  ["ERB", "Odenwaldkreis (Erbach [Odenwald])"],
  ["ERH", "Erlangen-Höchstadt (Erlangen)"],
  ["ERK", "Erkelenz"],
  ["ES", "Esslingen [Neckar]"],
  ["ESA", "Eisenach"],
  ["ESB", "Eschenbach [Oberpfalz]"],
  ["ESW", "Werra-Meißner-Kreis (Eschwege)"],
  ["EU", "Euskirchen"],
  ["EUT", "Eutin"],
  ["EW", "Eberswalde"],
  ["F", "Frankfurt am Main [Stadt]"],
  ["FAL", "Soltau-Fallingbostel (Fallingbostel)"],
  ["FB", "Wetteraukreis (Friedberg [Hessen])"],
  ["FD", "Fulda"],
  ["FDB", "Friedberg [Bayern]"],
  ["FDS", "Freudenstadt"],
  ["FEU", "Feuchtwangen"],
  ["FF", "Frankfurt [Oder]"],
  ["FFB", "Fürstenfeldbruck"],
  ["FG", "Freiberg [Sachsen]"],
  ["FH", "Main-Taunus-Kreis (Frankfurt am Main-Höchst)"],
  ["FI", "Finsterwalde"],
  ["FKB", "Frankenberg [Eder]"],
  ["FL", "Flensburg"],
  ["FLÖ", "Flöha"],
  ["FN", "Bodenseekreis (Friedrichshafen)"],
  ["FO", "Forchheim"],
  ["FOR", "Forst"],
  ["FR", "Breisgau-Hochschwarzwald (Freiburg [Breisgau])"],
  ["FRG", "Freyung-Grafenau (Freyung)"],
  ["FRI", "Friesland (Jever)"],
  ["FRW", "Bad Freienwalde"],
  ["FS", "Freising"],
  ["FT", "Frankenthal [Pfalz]"],
  ["FTL", "Freital"],
  ["FÜ", "Fürth [Bayern]"],
  ["FÜS", "Füssen"],
  ["FW", "Fürstenwalde"],
  ["FZ", "Fritzlar-Homberg (Fritzlar)"],
  ["G", "Gera [Landkreis]"],
  ["G", "Gera [Stadt]"],
  ["GA", "Gardelegen"],
  ["GAN", "Gandersheim (Bad Gandersheim)"],
  ["GAP", "Garmisch-Partenkirchen"],
  ["GC", "Chemnitzer Land (Glauchau)"],
  ["GD", "Schwäbisch Gmünd (<1972->AA)"],
  ["GDB", "Gadebusch"],
  ["GE", "Gelsenkirchen"],
  ["GEL", "Geldern"],
  ["GEM", "Gemünden [Main]"],
  ["GEO", "Gerolzhofen"],
  ["GER", "Germersheim"],
  ["GF", "Gifhorn"],
  ["GG", "Groß-Gerau"],
  ["GHA", "Geithain"],
  ["GHC", "Gräfenhainichen"],
  ["GI", "Gießen (<1976->L,>1979)"],
  ["GK", "Geilenkirchen-Heinsberg (Erkelenz)"],
  ["GL", "Rheinisch-Bergischer Kreis (Bergisch Gladbach)"],
  ["GLA", "Gladbeck [Westfalen]"],
  ["GM", "Oberbergischer Kreis (Gummersbach)"],
  ["GMN", "Grimmen"],
  ["GN", "Gelnhausen"],
  ["GNT", "Genthin"],
  ["GOA", "Sankt Goar"],
  ["GÖ", "Göttingen"],
  ["GOH", "Sankt Goarshausen"],
  ["GP", "Göppingen"],
  ["GR", "Görlitz [Landkreis]"],
  ["GR", "Görlitz [Stadt]"],
  ["GRA", "Grafenau"],
  ["GRH", "Großenhain"],
  ["GRI", "Griesbach Rottal"],
  ["GRM", "Grimma"],
  ["GRS", "Gransee"],
  ["GRZ", "Greiz"],
  ["GS", "Goslar"],
  ["GT", "Gütersloh"],
  ["GTH", "Gotha"],
  ["GÜ", "Güstrow"],
  ["GUB", "Guben"],
  ["GUN", "Gunzenhausen"],
  ["GV", "Grevenbroich"],
  ["GVM", "Grevesmühlen"],
  ["GW", "Greifswald [Landkreis]"],
  ["GZ", "Günzburg"],
  ["H", "Hannover"],
  ["HA", "Hagen [Westfalen]"],
  ["HAB", "Hammelburg"],
  ["HAL", "Halle [Saale]"],
  ["HAM", "Hamm [Westfalen]"],
  ["HAS", "Haßberge (Haßfurt)"],
  ["HB", "Hansestadt Bremen und Bremerhaven"],
  ["HBN", "Hildburghausen"],
  ["HBS", "Halberstadt"],
  ["HC", "Hainichen"],
  ["HCH", "Hechingen"],
  ["HD", "Rhein-Neckar-Kreis und Heidelberg (Heidelberg)"],
  ["HDH", "Heidenheim [Brenz]"],
  ["HDL", "Haldensleben"],
  ["HE", "Helmstedt"],
  ["HEB", "Hersbruck"],
  ["HEF", "Hersfeld-Rotenburg (Bad Hersfeld)"],
  ["HEI", "Dithmarschen (Heide [Holstein])"],
  ["HEL", "Hessen"],
  ["HER", "Herne"],
  ["HET", "Hettstedt"],
  ["HF", "Herford"],
  ["HG", "Hochtaunuskreis (Bad Homburg vor der Höhe)"],
  ["HGN", "Hagenow"],
  ["HGW", "Hansestadt Greifswald"],
  ["HH", "Hansestadt Hamburg"],
  ["HHM", "Hohenmölsen"],
  ["HI", "Hildesheim"],
  ["HIG", "Heiligenstadt"],
  ["HIP", "Hilpoltstein [Mittelfranken]"],
  ["HK", "US-Streitkräfte in Deutschland"],
  ["HL", "Hansestadt Lübeck"],
  ["HM", "Hameln-Pyrmont (Hameln)"],
  ["HMÜ", "Hannoversch Münden"],
  ["HN", "Heilbronn [Neckar]"],
  ["HO", "Hof [Saale]"],
  ["HOG", "Hofgeismar"],
  ["HOH", "Hofheim [Unterfranken]"],
  ["HOL", "Holzminden"],
  ["HOM", "Saar-Pfalz-Kreis (Homburg [Saar])"],
  ["HOR", "Horb [Neckar]"],
  ["HÖS", "Höchstadt [Aisch]"],
  ["HOT", "Hohenstein-Ernstthal"],
  ["HP", "Bergstraße (Heppenheim [Bergstraße])"],
  ["HR", "Schwalm-Eder-Kreis (Homberg [Efze])"],
  ["HRO", "Hansestadt Rostock"],
  ["HS", "Heinsberg"],
  ["HSK", "Hochsauerlandkreis (Meschede)"],
  ["HST", "Hansestadt Stralsund"],
  ["HU", "Main-Kinzig-Kreis (Hanau)"],
  ["HÜN", "Hünfeld"],
  ["HUS", "Husum"],
  ["HV", "Havelberg"],
  ["HVL", "Havelland (Rathenow)"],
  ["HW", "Halle [Westfalen]"],
  ["HWI", "Hansestadt Wismar"],
  ["HX", "Höxter"],
  ["HY", "Hoyerswerda"],
  ["HZ", "Herzberg"],
  ["IGB", "St. Ingbert"],
  ["IK", "Ilmkreis (Arnstadt)"],
  ["IL", "Ilmenau"],
  ["ILL", "Illertissen"],
  ["IN", "Ingolstadt"],
  ["IS", "Iserlohn"],
  ["IZ", "Steinburg (Itzehoe)"],
  ["J", "Jena [Landkreis]"],
  ["J", "Jena"],
  ["JB", "Jüterbog"],
  ["JE", "Jessen"],
  ["JEV", "Friesland (Jever)"],
  ["JL", "Jerichower Land (Burg b. Magdeburg)"],
  ["JÜL", "Jülich"],
  ["K", "Köln"],
  ["KA", "Karlsruhe"],
  ["KAR", "Main-Spessart-Kreis (Karlstadt)"],
  ["KB", "Waldeck-Frankenberg (Korbach)"],
  ["KC", "Kronach"],
  ["KE", "Kempten [Allgäu]"],
  ["KEH", "Kelheim"],
  ["KEL", "Kehl"],
  ["KEM", "Kemnath"],
  ["KF", "Kaufbeuren"],
  ["KG", "Bad Kissingen"],
  ["KH", "Bad Kreuznach"],
  ["KI", "Kiel [Stadt]"],
  ["KIB", "Donnersberg-Kreis (Kirchheimbolanden)"],
  ["KK", "Kempen-Krefeld (Kempen [Niederrhein])"],
  ["KL", "Kaiserslautern"],
  ["KLE", "Kleve"],
  ["KLZ", "Klötze"],
  ["KM", "Kamenz"],
  ["KN", "Konstanz"],
  ["KO", "Koblenz [Landkreis]"],
  ["KO", "Koblenz [Stadt]"],
  ["KÖN", "Königshofen [Grabfeld]"],
  ["KÖT", "Köthen"],
  ["KÖZ", "Kötzting"],
  ["KR", "Krefeld"],
  ["KRU", "Krumbach [Schwaben]"],
  ["KS", "Kassel"],
  ["KT", "Kitzingen"],
  ["KU", "Kulmbach"],
  ["KÜN", "Hohenlohe-Kreis (Künzelsau)"],
  ["KUS", "Kusel"],
  ["KW", "Königs Wusterhausen"],
  ["KY", "Kyritz"],
  ["KYF", "Kyffhäuserkreis (Sondershausen)"],
  ["L", "Lahn-Dill-Kreis (Wetzlar)"],
  ["L", "Leipzig"],
  ["LA", "Landshut [Bayern]"],
  ["LAN", "Landau [Isar]"],
  ["LAT", "Vogelsberg-Kreis (Lauterbach [Hessen])"],
  ["LAU", "Nürnberger Land (Lauf [Pegnitz])"],
  ["LB", "Ludwigsburg"],
  ["LBS", "Lobenstein"],
  ["LBZ", "Lübz"],
  ["LC", "Luckau"],
  ["LD", "Landau [Pfalz]"],
  ["LDK", "Lahn-Dill-Kreis (Wetzlar)"],
  ["LDS", "Dahme-Spreewald (Lübben)"],
  ["LE", "Lemgo"],
  ["LEO", "Leonberg [Württemberg]"],
  ["LER", "Leer [Ostfriesland]"],
  ["LEV", "Leverkusen"],
  ["LF", "Laufen [Salzach]"],
  ["LG", "Lüneburg"],
  ["LH", "Lüdinghausen"],
  ["LI", "Lindau [Bodensee]"],
  ["LIB", "Bad Liebenwerda"],
  ["LIF", "Lichtenfels"],
  ["LIN", "Lingen [Ems]"],
  ["LIP", "Lippe (Detmold)"],
  ["LK", "Lübbecke [Westfalen]"],
  ["LL", "Landsberg [Lech]"],
  ["LM", "Limburg-Weilburg (Limburg [Lahn])"],
  ["LN", "Lübben"],
  ["LÖ", "Lörrach"],
  ["LÖB", "Löbau"],
  ["LOH", "Lohr [Main]"],
  ["LOS", "Oder-Spree (Beeskow)"],
  ["LP", "Lippstadt"],
  ["LR", "Lahr [Schwarzwald]"],
  ["LS", "Märkischer Kreis (Lüdenscheid) (>1975,<1979->MK)"],
  ["LSA", "Sachsen-Anhalt"],
  ["LSN", "Sachsen"],
  ["LSZ", "Bad Langensalza"],
  ["LU", "Ludwigshafen"],
  ["LÜD", "Lüdenscheid"],
  ["LUK", "Luckenwalde"],
  ["LÜN", "Lünen"],
  ["LWL", "Ludwigslust"],
  ["M", "München"],
  ["MA", "Mannheim"],
  ["MAB", "Marienberg"],
  ["MAI", "Mainburg"],
  ["MAK", "Marktredwitz"],
  ["MAL", "Mallersdorf"],
  ["MAR", "Marktheidenfeld"],
  ["MB", "Miesbach"],
  ["MC", "Malchin"],
  ["MD", "Magdeburg"],
  ["ME", "Mettmann"],
  ["MED", "Süderdithmarschen (Meldorf)"],
  ["MEG", "Melsungen"],
  ["MEI", "Meißen"],
  ["MEK", "Mittlerer Erzgebirgskreis (Marienberg)"],
  ["MEL", "Melle"],
  ["MEP", "Meppen"],
  ["MER", "Merseburg"],
  ["MES", "Hochsauerlandkreis (Meschede)"],
  ["MET", "Mellrichstadt"],
  ["MG", "Mönchengladbach"],
  ["MGH", "Bad Mergentheim"],
  ["MGN", "Meiningen"],
  ["MH", "Mülheim [Ruhr]"],
  ["MHL", "Mühlhausen"],
  ["MI", "Minden-Lübbecke (Minden [Westfalen])"],
  ["MIL", "Miltenberg"],
  ["MK", "Märkischer Kreis (Lüdenscheid)"],
  ["ML", "Mansfelder Land (Lutherstadt Eisleben)"],
  ["MM", "Memmingen"],
  ["MN", "Unterallgäu (Mindelheim)"],
  ["MO", "Moers"],
  ["MOD", "Ostallgäu (Marktoberdorf)"],
  ["MOL", "Märkisch-Oderland (Seelow)"],
  ["MON", "Monschau"],
  ["MOS", "Neckar-Odenwald-Kreis (Mosbach)"],
  ["MQ", "Merseburg-Querfurt (Merseburg)"],
  ["MR", "Marburg-Biedenkopf (Marburg [Lahn])"],
  ["MS", "Münster [Westfalen]"],
  ["MSP", "Main-Spessart (Karlstadt)"],
  ["MST", "Mecklenburg-Strelitz (Neustrelitz)"],
  ["MT", "Westerwald (Montabaur)"],
  ["MTK", "Main-Taunus-Kreis (Hofheim am Taunus)"],
  ["MTL", "Muldentalkreis (Grimma)"],
  ["MÜ", "Mühldorf am Inn"],
  ["MÜB", "Münchberg [Oberfranken]"],
  ["MÜL", "Müllheim [Baden]"],
  ["MÜN", "Münsingen [Württemberg]"],
  ["MÜR", "Müritz (Waren)"],
  ["MVL", "Mecklenburg-Vorpommern"],
  ["MW", "Mittweida"],
  ["MY", "Mayen"],
  ["MYK", "Mayen-Koblenz (Koblenz)"],
  ["MZ", "Mainz"],
  ["MZG", "Merzig-Wadern (Merzig [Saar])"],
  ["N", "Nürnberg [Stadt]"],
  ["NAB", "Nabburg"],
  ["NAI", "Naila"],
  ["NAU", "Nauen"],
  ["NB", "Neubrandenburg [Landkreis]"],
  ["NB", "Neubrandenburg [Stadt]"],
  ["ND", "Neuburg-Schrobenhausen (Neuburg [Donau])"],
  ["NDH", "Nordhausen"],
  ["NE", "Neuss"],
  ["NEA", "Neustadt an der Aisch-Bad Windsheim"],
  ["NEB", "Nebra [Unstrut]"],
  ["NEC", "Neustadt [bei Coburg]"],
  ["NEN", "Neunburg vorm Wald"],
  ["NES", "Rhön-Grabfeld (Bad Neustadt [Saale])"],
  ["NEU", "Hochschwarzwald (Titisee-Neustadt)"],
  ["NEW", "Neustadt [an der Waldnaab]"],
  ["NF", "Nordfriesland (Husum)"],
  ["NH", "Neuhaus [Rennweg]"],
  ["NI", "Nienburg [Weser]"],
  ["NIB", "Süd-Tondern (Niebüll)"],
  ["NK", "Neunkirchen [Saar]"],
  ["NL", "Niedersachsen"],
  ["NM", "Neumarkt [Oberpfalz]"],
  ["NMB", "Naumburg [Saale]"],
  ["NMS", "Neumünster"],
  ["NÖ", "Nördlingen"],
  ["NOH", "Grafschaft Bentheim (Nordhorn)"],
  ["NOL", "Niederschlesischer Oberlausitzkreis (Görlitz)"],
  ["NOM", "Northeim"],
  ["NOR", "Norden"],
  ["NRW", "Nordrhein-Westfalen"],
  ["NP", "Neuruppin"],
  ["NR", "Neuwied [Rhein]"],
  ["NRÜ", "Neustadt [am Rübenberge]"],
  ["NT", "Nürtingen"],
  ["NU", "Neu-Ulm"],
  ["NVP", "Nordvorpommern (Grimmen)"],
  ["NW", "Neustadt [Weinstraße] [Stadt]"],
  ["NWM", "Nordwestmecklenburg (Grevesmühlen)"],
  ["NY", "Niesky"],
  ["NZ", "Neustrelitz"],
  ["OA", "Oberallgäu (Sonthofen)"],
  ["OAL", "Ostallgäu (Marktoberdorf) (>1979)"],
  ["OB", "Oberhausen [Rheinland]"],
  ["OBB", "Obernburg [Main]"],
  ["OBG", "Osterburg"],
  ["OC", "Oschersleben"],
  ["OCH", "Ochsenfurt"],
  ["OD", "Stormarn (Bad Oldesloe)"],
  ["OE", "Olpe"],
  ["OF", "Offenbach [Main]"],
  ["OG", "Ortenaukreis (Offenburg)"],
  ["OH", "Ostholstein (Eutin)"],
  ["OHA", "Osterode [am Harz]"],
  ["ÖHR", "Öhringen [Württemberg]"],
  ["OHV", "Oberhavel (Oranienburg)"],
  ["OHZ", "Osterholz (Osterholz-Scharmbeck)"],
  ["OK", "Ohrekreis (Haldensleben)"],
  ["OL", "Oldenburg [Oldenburg]"],
  ["OLD", "Oldenburg [Holstein]"],
  ["OP", "Rhein-Wupper-Kreis (Opladen)"],
  ["OPR", "Ostprignitz-Ruppin (Neuruppin)"],
  ["OR", "Oranienburg"],
  ["OS", "Osnabrück"],
  ["OSL", "Oberspreewald-Lausitz (Senftenberg)"],
  ["OTT", "Land Hadeln (Otterndorf)"],
  ["OTW", "Ottweiler [Saar]"],
  ["OVI", "Oberviechtach"],
  ["OVL", "Obervogtland (Oelsnitz und Klingenthal)"],
  ["OVP", "Ostvorpommern (Anklam)"],
  ["OZ", "Oschatz (>1991,<1995->TO)"],
  ["P", "Potsdam [Landkreis]"],
  ["P", "Potsdam [Stadt]"],
  ["PA", "Passau"],
  ["PAF", "Pfaffenhofen [an der Ilm]"],
  ["PAN", "Rottal-Inn (Pfarrkirchen [Inn])"],
  ["PAR", "Parsberg"],
  ["PB", "Paderborn"],
  ["PCH", "Parchim"],
  ["PE", "Peine"],
  ["PEG", "Pegnitz"],
  ["PER", "Perleberg"],
  ["PF", "Enzkreis und Pforzheim (Pforzheim)"],
  ["PI", "Pinneberg"],
  ["PIR", "Sächsische Schweiz (Pirna)"],
  ["PK", "Pritzwalk"],
  ["PL", "Plauen [Landkreis]"],
  ["PL", "Plauen [Stadt]"],
  ["PLÖ", "Plön (Holstein)"],
  ["PM", "Potsdam-Mittelmark (Belzig)"],
  ["PN", "Pößneck"],
  ["PR", "Prignitz (Perleberg)"],
  ["PRÜ", "Prüm [Eifel]"],
  ["PS", "Pirmasens"],
  ["PW", "Pasewalk"],
  ["PZ", "Prenzlau"],
  ["QFT", "Querfurt"],
  ["QLB", "Quedlinburg"],
  ["R", "Regensburg"],
  ["RA", "Rastatt"],
  ["RC", "Reichenbach [Vogtland]"],
  ["RD", "Rendsburg-Eckernförde (Rendsburg)"],
  ["RDG", "Ribnitz-Damgarten"],
  ["RE", "Recklinghausen"],
  ["REG", "Regen"],
  ["REH", "Rehau"],
  ["REI", "Berchtesgadener Land (Bad Reichenhall)"],
  ["RG", "Riesa-Großenhain (Großenhain)"],
  ["RH", "Roth"],
  ["RI", "Grafschaft Schaumburg (Rinteln)"],
  ["RID", "Riedenburg [Bayern]"],
  ["RIE", "Riesa"],
  ["RL", "Rochlitz"],
  ["RM", "Röbel [Müritz]"],
  ["RN", "Rathenow"],
  ["RO", "Rosenheim"],
  ["ROD", "Roding"],
  ["ROF", "Rotenburg [Fulda]"],
  ["ROH", "Rotenburg [Wümme, Hannover]"],
  ["ROK", "Rockenhausen"],
  ["ROL", "Rottenburg [Laaber]"],
  ["ROS", "Rostock [Landkreis]"],
  ["ROT", "Rothenburg ob der Tauber"],
  ["ROW", "Rotenburg [Wümme]"],
  ["RPL", "Rheinland-Pfalz"],
  ["RS", "Remscheid"],
  ["RSL", "Rosslau [Elbe]"],
  ["RT", "Reutlingen"],
  ["RU", "Rudolstadt"],
  ["RÜD", "Rheingau-Taunus-Kreis (Rüdesheim [Rhein])"],
  ["RÜG", "Rügen (Bergen)"],
  ["RV", "Ravensburg"],
  ["RW", "Rottweil"],
  ["RWL", "Nordrhein-Westfalen"],
  ["RY", "Rheydt"],
  ["RZ", "Herzogtum Lauenburg (Ratzeburg)"],
  ["S", "Stuttgart"],
  ["SAB", "Saarburg [Bezirk Trier]"],
  ["SAD", "Schwandorf"],
  ["SÄK", "Säckingen"],
  ["SAL", "Saarland"],
  ["SAN", "Stadtsteinach"],
  ["SAW", "Salzwedel"],
  ["SB", "Saarbrücken"],
  ["SBG", "Strasburg"],
  ["SBK", "Schönebeck [Elbe]"],
  ["SC", "Schwabach"],
  ["SCZ", "Schleiz"],
  ["SD", "Stade"],
  ["SDH", "Sondershausen"],
  ["SDL", "Stendal"],
  ["SDT", "Schwedt [Oder]"],
  ["SE", "Segeberg (Bad Segeberg)"],
  ["SEB", "Sebnitz"],
  ["SEE", "Seelow"],
  ["SEF", "Scheinfeld"],
  ["SEL", "Selb"],
  ["SF", "Oberallgäu (Sonthofen)"],
  ["SFA", "Soltau-Fallingbostel (Fallingbostel)"],
  ["SFB", "Senftenberg"],
  ["SFT", "Staßfurt"],
  ["SG", "Solingen"],
  ["SGH", "Sangerhausen"],
  ["SH", "Schleswig-Holstein"],
  ["SHA", "Schwäbisch Hall"],
  ["SHG", "Schaumburg (Stadthagen)"],
  ["SHK", "Saale-Holzland-Kreis (Eisenberg)"],
  ["SHL", "Suhl [Landkreis]"],
  ["SHL", "Suhl [Stadt]"],
  ["SI", "Siegen"],
  ["SIG", "Sigmaringen"],
  ["SIM", "Rhein-Hunsrück-Kreis (Simmern)"],
  ["SK", "Saalkreis (Halle)"],
  ["SL", "Schleswig-Flensburg (Schleswig)"],
  ["SLE", "Schleiden [Eifel]"],
  ["SLF", "Saalfeld-Rudolstadt (Saalfeld)"],
  ["SLG", "Saulgau"],
  ["SLN", "Schmölln"],
  ["SLS", "Saarlouis"],
  ["SLÜ", "Schlüchtern"],
  ["SLZ", "Bad Salzungen"],
  ["SM", "Schmalkalden-Meiningen"],
  ["SMÜ", "Schwabmünchen"],
  ["SN", "Schwerin [Landkreis]"],
  ["SN", "Schwerin [Stadt]"],
  ["SNH", "Sinsheim [Elsenz]"],
  ["SO", "Soest"],
  ["SOB", "Schrobenhausen"],
  ["SOG", "Schongau"],
  ["SOK", "Saale-Orla-Kreis (Schleiz)"],
  ["SOL", "Soltau"],
  ["SÖM", "Sömmerda"],
  ["SON", "Sonneberg"],
  ["SP", "Speyer"],
  ["SPB", "Spremberg"],
  ["SPN", "Spree-Neisse (Forst)"],
  ["SPR", "Springe [Deister]"],
  ["SR", "Straubing"],
  ["SRB", "Strausberg"],
  ["SRO", "Stadtroda"],
  ["ST", "Stade"],
  ["ST", "Steinfurt"],
  ["STA", "Starnberg"],
  ["STB", "Sternberg"],
  ["STD", "Stade"],
  ["STE", "Staffelstein"],
  ["STH", "Schaumburg-Lippe (Stadthagen)"],
  ["STL", "Stollberg"],
  ["STO", "Stockach [Baden]"],
  ["SU", "Rhein-Sieg-Kreis (Siegburg)"],
  ["SUL", "Sulzbach-Rosenberg"],
  ["SÜW", "Südliche Weinstraße (Landau [Pfalz])"],
  ["SW", "Schweinfurt"],
  ["SWA", "Rheingau-Taunus-Kreis (Bad Schwalbach)"],
  ["SY", "Grafschaft Hoya (Syke)"],
  ["SZ", "Salzgitter"],
  ["SZB", "Schwarzenberg"],
  ["TBB", "Main-Tauber-Kreis (Tauberbischofsheim)"],
  ["TE", "Tecklenburg (<1974->ST)"],
  ["TET", "Teterow"],
  ["TF", "Teltow-Flaeming (Luckenwalde)"],
  ["TG", "Torgau (>1991,<1995->TO)"],
  ["THL", "Thüringen"],
  ["THW", "Technisches Hilfswerk"],
  ["TIR", "Tirschenreuth"],
  ["TO", "Torgau-Oschatz (Torgau)"],
  ["TÖL", "Bad Tölz-Wolfratshausen (Bad Tölz)"],
  ["TÖN", "Eiderstedt (Tönning)"],
  ["TP", "Templin [Uckermark]"],
  ["TR", "Trier-Saarburg und Trier"],
  ["TS", "Traunstein [Oberbayern]"],
  ["TT", "Tettnang [Württemberg]"],
  ["TÜ", "Tübingen"],
  ["TUT", "Tuttlingen"],
  ["ÜB", "Überlingen [Bodensee]"],
  ["UE", "Uelzen"],
  ["UEM", "Ueckermünde"],
  ["UER", "Uecker-Randow (Pasewalk)"],
  ["UFF", "Uffenheim"],
  ["UH", "Unstrut-Hainich (Mühlhausen)"],
  ["UL", "Alb-Donau-Kreis und Ulm"],
  ["UM", "Uckermark (Prenzlau)"],
  ["UN", "Unna [Westfalen]"],
  ["USI", "Usingen [Taunus]"],
  ["V", "Vogtlandkreis"],
  ["VAI", "Vaihingen [Enz]"],
  ["VB", "Vogelsbergkreis (Lauterbach [Hessen])"],
  ["VEC", "Vechta"],
  ["VER", "Verden [Aller]"],
  ["VIB", "Vilsbiburg"],
  ["VIE", "Viersen"],
  ["VIT", "Viechtach"],
  ["VK", "Völklingen (Stadt) (>1968)"],
  ["VL", "Villingen [Schwarzwald]"],
  ["VOF", "Vilshofen [Niederbayern]"],
  ["VOH", "Vohenstrauß"],
  ["VS", "Schwarzwald-Baar-Kreis (Villingen-Schwenningen)"],
  ["W", "Wuppertal"],
  ["WA", "Waldeck (Korbach)"],
  ["WAF", "Warendorf"],
  ["WAK", "Wartburgkreis (Bad Salzungen, Eisenach)"],
  ["WAN", "Wanne-Eickel"],
  ["WAR", "Warburg [Westfalen]"],
  ["WAT", "Wattenscheid"],
  ["WB", "Wittenberg"],
  ["WBS", "Worbis"],
  ["WD", "Wiedenbrück"],
  ["WDA", "Werdau"],
  ["WE", "Weimar [Landkreis]"],
  ["WE", "Weimar"],
  ["WEB", "Oberwesterwaldkreis (Westerburg)"],
  ["WEG", "Wegscheid [Niederbayern]"],
  ["WEL", "Oberlahn-Kreis (Weilburg)"],
  ["WEM", "Wesermünde (Bremerhaven)"],
  ["WEN", "Weiden [Oberpfalz]"],
  ["WER", "Wertingen"],
  ["WES", "Wesel"],
  ["WF", "Wolfenbüttel"],
  ["WG", "Wangen [Allgäu]"],
  ["WHV", "Wilhelmshaven"],
  ["WI", "Wiesbaden"],
  ["WIL", "Bernkastel-Wittlich (Wittlich)"],
  ["WIS", "Wismar"],
  ["WIT", "Witten [Ruhr]"],
  ["WIZ", "Witzenhausen"],
  ["WK", "Wittstock"],
  ["WL", "Harburg (Winsen [Luhe])"],
  ["WLG", "Wolgast"],
  ["WM", "Weilheim-Schongau (Weilheim [Oberbayern])"],
  ["WMS", "Wolmirstedt"],
  ["WN", "Rems-Murr-Kreis (Waiblingen)"],
  ["WND", "St. Wendel [Saar]"],
  ["WO", "Worms"],
  ["WOB", "Wolfsburg"],
  ["WOH", "Wolfhagen [Bezirk Kassel]"],
  ["WOL", "Wolfach"],
  ["WOR", "Wolfratshausen"],
  ["WOS", "Wolfstein (Freyung [Wald])"],
  ["WR", "Wernigerode"],
  ["WRN", "Waren"],
  ["WS", "Wasserburg [Inn]"],
  ["WSF", "Weißenfels"],
  ["WST", "Ammerland (Westerstede)"],
  ["WSW", "Weißwasser"],
  ["WT", "Waldshut (Waldshut-Tiengen)"],
  ["WTL", "Wittlage (Bad Essen)"],
  ["WTM", "Wittmund"],
  ["WÜ", "Würzburg"],
  ["WUG", "Weißenburg-Gunzenhausen (Weißenburg [Bayern])"],
  ["WÜM", "Waldmünchen"],
  ["WUN", "Wunsiedel"],
  ["WUR", "Wurzen"],
  ["WW", "Westerwaldkreis (Montabaur)"],
  ["WZ", "Wetzlar"],
  ["WZL", "Wanzleben"],
  ["X", "Bundeswehr für Fahrzeuge der NATO-Hauptquartiere"],
  ["Y", "Bundeswehr"],
  ["Z", "Zoll"],
  ["Z", "Zwickau"],
  ["Z", "Zwickauer Land (Werdau)"],
  ["ZE", "Zerbst"],
  ["ZEL", "Zell [Mosel]"],
  ["ZI", "Sächsischer Oberlausitzkreis (Zittau)"],
  ["ZIG", "Ziegenhain (Schwalmstadt)"],
  ["ZP", "Zschopau"],
  ["ZR", "Zeulenroda"],
  ["ZS", "Zossen"],
  ["ZW", "Zweibrücken"],
  ["ZZ", "Zeitz"],
]);

const Data_Material = {
  "metadata": {
    "WName": {
      "Bezeichnung": "Werkstoffname",
      "Unit": "",
      "abbr": ""
    },
    "WNr": {
      "Bezeichnung": "Werkstoff Nummer",
      "Unit": "",
      "abbr": ""
    },
    "WNameAlt": {
      "Bezeichnung": "alt. Bezeichnung",
      "Unit": "",
      "abbr": ""
    },
    "matGroup": {
      "Bezeichnung": "Materialgruppe",
      "Unit": "",
      "abbr": ""
    },
    "matSort": {
      "Bezeichnung": "Werkstoffsorte",
      "Unit": "",
      "abbr": ""
    },
    "matZustand": {
      "Bezeichnung": "Materialzustand",
      "Unit": "",
      "abbr": ""
    },
    "matVerfahren": {
      "Bezeichnung": "Gussverfahren",
      "Unit": "",
      "abbr": ""
    },
    "d_B": {
      "Bezeichnung": "Bezugsdurchmesser",
      "Unit": "mm",
      "abbr": "d<sub>B</sub>"
    },
    "R_eR_p2": {
      "Bezeichnung": "Streckgrenze",
      "Unit": "N/mm²",
      "abbr": "R<sub>e</sub>/R<sub>p 0,2</sub>"
    },
    "R_m": {
      "Bezeichnung": "Zugfestigkeit",
      "Unit": "N/mm²",
      "abbr": "R<sub>M</sub>"
    },
    "S_z_W": {
      "Bezeichnung": "Zug-Druck-Wechselfestigkeit",
      "Unit": "N/mm²",
      "abbr": "&#963;<sub>zd_W</sub>"
    },
    "S_z_S": {
      "Bezeichnung": "Zug-Druck-Schwellfestigkeit",
      "Unit": "N/mm²",
      "abbr": "&#963;<sub>zd_Sch</sub>"
    },
    "S_b_W": {
      "Bezeichnung": "Biegewechselfestigkeit",
      "Unit": "N/mm²",
      "abbr": "&#963;<sub>b_W</sub>"
    },
    "S_b_S": {
      "Bezeichnung": "Biegeschwellfestigkeit",
      "Unit": "N/mm²",
      "abbr": "&#963;<sub>b_Sch</sub>"
    },
    "Sig_W": {
      "Bezeichnung": "Dauerschwingfestigkeit",
      "Unit": "N/mm²",
      "abbr": "&#963;<sub>W</sub>"
    },
    "T_t_W": {
      "Bezeichnung": "Torsionswechselfestigkeit",
      "Unit": "N/mm²",
      "abbr": "&#964;<sub>W</sub>"
    },
    "T_t_S": {
      "Bezeichnung": "Torsionsschwellfestigkeit",
      "Unit": "N/mm²",
      "abbr": "&#964;<sub>Sch</sub>"
    },
    "A": {
      "Bezeichnung": "Bruchdehnung",
      "Unit": "%",
      "abbr": "&#949;"
    },
    "roh": {
      "Bezeichnung": "Dichte",
      "Unit": "kg/dm³",
      "abbr": "&#961;"
    },
    "expansion": {
      "Bezeichnung": "Längenausdehnungskoef.",
      "Unit": "10<sup>-6</sup>/K",
      "abbr": "&#945;"
    },
    "brinell": {
      "Bezeichnung": "Brinellhärte",
      "Unit": "HB",
      "abbr": ""
    },
    "E-Modul": {
      "Bezeichnung": "Elastizitaetsmodul",
      "Unit": "N/mm²",
      "abbr": "E"
    },
    "G-Modul": {
      "Bezeichnung": "Gleitmodul",
      "Unit": "N/mm²",
      "abbr": "G"
    },
    "mue": {
      "Bezeichnung": "Gleitreibung / Stahl",
      "Unit": "",
      "abbr": "&#956;"
    },
    "t_min": {
      "Bezeichnung": "min. Anw.Temperatur",
      "Unit": "C",
      "abbr": "t<sub>min</sub>"
    },
    "t_max": {
      "Bezeichnung": "max. Anw.Temperatur",
      "Unit": "C",
      "abbr": "t<sub>max</sub>"
    }
  },
  "matSortList": [],
  "matZustandList": [],
  "Materials": {
    "S185": {
      "matGroup": "Stahl",
      "WName": "S185",
      "WNr": "1.0035",
      "WNameAlt": "St33",
      "matSort": 48,
      "d_B": 16,
      "R_m": 310,
      "R_eR_p2": 185,
      "A": 18,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "S235JR": {
      "matGroup": "Stahl",
      "WName": "S235JR",
      "WNr": "1.0037",
      "matSort": 48,
      "d_B": 16,
      "R_m": 440,
      "R_eR_p2": 300,
      "S_z_W": 175,
      "S_z_S": 280,
      "S_b_W": 220,
      "S_b_S": 330,
      "T_t_W": 130,
      "T_t_S": 210,
      "A": 9,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 11.1,
        "200": 12.1,
        "300": 12.9
      }
    },
    "S235JRG1": {
      "matGroup": "Stahl",
      "WName": "S235JRG1",
      "WNr": "1.0036",
      "WNameAlt": "USt37-2",
      "matSort": 48,
      "d_B": 16,
      "R_m": 360,
      "R_eR_p2": 235,
      "S_z_W": 140,
      "S_z_S": 225,
      "S_b_W": 180,
      "S_b_S": 270,
      "T_t_W": 105,
      "T_t_S": 160,
      "A": 26,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "S235JRG2": {
      "matGroup": "Stahl",
      "WName": "S235JRG2",
      "WNr": "1.0038",
      "WNameAlt": "RSt37-2",
      "matSort": 48,
      "d_B": 16,
      "R_m": 360,
      "R_eR_p2": 235,
      "S_z_W": 140,
      "S_z_S": 225,
      "S_b_W": 180,
      "S_b_S": 270,
      "T_t_W": 105,
      "T_t_S": 160,
      "A": 26,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "S235JO": {
      "matGroup": "Stahl",
      "WName": "S235JO",
      "WNr": "1.0114",
      "WNameAlt": "St37-3U",
      "matSort": 48,
      "d_B": 16,
      "R_m": 360,
      "R_eR_p2": 235,
      "S_z_W": 140,
      "S_z_S": 225,
      "S_b_W": 180,
      "S_b_S": 270,
      "T_t_W": 105,
      "T_t_S": 160,
      "A": 26,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "S235J2G3": {
      "matGroup": "Stahl",
      "WName": "S235J2G3",
      "WNr": "1.0570",
      "matSort": 48,
      "d_B": 16,
      "R_m": 600,
      "R_eR_p2": 450,
      "S_z_W": 240,
      "S_z_S": 385,
      "S_b_W": 300,
      "S_b_S": 450,
      "T_t_W": 180,
      "T_t_S": 305,
      "A": 7,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "S235J2G4": {
      "matGroup": "Stahl",
      "WName": "S235J2G4",
      "WNr": "1.0117",
      "matSort": 48,
      "d_B": 16,
      "R_m": 360,
      "R_eR_p2": 235,
      "S_z_W": 140,
      "S_z_S": 225,
      "S_b_W": 180,
      "S_b_S": 270,
      "T_t_W": 105,
      "T_t_S": 160,
      "A": 26,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "S275JR": {
      "matGroup": "Stahl",
      "WName": "S275JR",
      "WNr": "1.0044",
      "matSort": 48,
      "d_B": 16,
      "R_m": 530,
      "R_eR_p2": 380,
      "S_z_W": 210,
      "S_z_S": 335,
      "S_b_W": 265,
      "S_b_S": 395,
      "T_t_W": 160,
      "T_t_S": 265,
      "A": 8,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "S275J2G3": {
      "matGroup": "Stahl",
      "WName": "S275J2G3",
      "WNr": "1.0144",
      "WNameAlt": "St44-3",
      "matSort": 48,
      "d_B": 16,
      "R_m": 430,
      "R_eR_p2": 275,
      "S_z_W": 170,
      "S_z_S": 270,
      "S_b_W": 215,
      "S_b_S": 320,
      "T_t_W": 125,
      "T_t_S": 190,
      "A": 22,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "S355J2G3": {
      "matGroup": "Stahl",
      "WName": "S355J2G3",
      "WNr": "1.0570",
      "WNameAlt": "St52-3N",
      "matSort": 48,
      "d_B": 16,
      "R_m": 510,
      "R_eR_p2": 355,
      "S_z_W": 205,
      "S_z_S": 325,
      "S_b_W": 255,
      "S_b_S": 380,
      "T_t_W": 150,
      "T_t_S": 245,
      "A": 22,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "E295": {
      "matGroup": "Stahl",
      "WName": "E295",
      "WNr": "1.0050",
      "matSort": 48,
      "d_B": 16,
      "R_m": 580,
      "R_eR_p2": 420,
      "S_z_W": 230,
      "S_z_S": 370,
      "S_b_W": 290,
      "S_b_S": 435,
      "T_t_W": 175,
      "T_t_S": 290,
      "A": 7,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "E335": {
      "matGroup": "Stahl",
      "WName": "E335",
      "WNr": "1.0060",
      "matSort": 48,
      "d_B": 16,
      "R_m": 680,
      "R_eR_p2": 490,
      "S_z_W": 270,
      "S_z_S": 430,
      "S_b_W": 340,
      "S_b_S": 510,
      "T_t_W": 205,
      "T_t_S": 340,
      "A": 6,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "E360": {
      "matGroup": "Stahl",
      "WName": "E360",
      "WNr": "1.0070",
      "matSort": 48,
      "d_B": 16,
      "R_m": 780,
      "R_eR_p2": 560,
      "S_z_W": 310,
      "S_z_S": 495,
      "S_b_W": 390,
      "S_b_S": 585,
      "T_t_W": 235,
      "T_t_S": 390,
      "A": 6,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "S275N": {
      "matGroup": "Stahl",
      "WName": "S275N",
      "WNr": "1.0490",
      "WNameAlt": "StE285",
      "matSort": 48,
      "d_B": 16,
      "R_m": 370,
      "R_eR_p2": 275,
      "S_z_W": 150,
      "S_z_S": 240,
      "S_b_W": 185,
      "S_b_S": 275,
      "T_t_W": 110,
      "T_t_S": 185,
      "A": 24,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "S275NL": {
      "matGroup": "Stahl",
      "WName": "S275NL",
      "WNr": "1.0491",
      "matSort": 43,
      "d_B": 16,
      "R_m": 370,
      "R_eR_p2": 275,
      "S_z_W": 150,
      "S_z_S": 240,
      "S_b_W": 185,
      "S_b_S": 275,
      "T_t_W": 110,
      "T_t_S": 185,
      "A": 24,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "S355N": {
      "matGroup": "Stahl",
      "WName": "S355N",
      "WNr": "1.0545",
      "WNameAlt": "StE355",
      "matSort": 43,
      "d_B": 16,
      "R_m": 470,
      "R_eR_p2": 355,
      "S_z_W": 190,
      "S_z_S": 305,
      "S_b_W": 235,
      "S_b_S": 350,
      "T_t_W": 140,
      "T_t_S": 240,
      "A": 22,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "S355NL": {
      "matGroup": "Stahl",
      "WName": "S355NL",
      "WNr": "1.0546",
      "matSort": 43,
      "d_B": 16,
      "R_m": 470,
      "R_eR_p2": 355,
      "S_z_W": 190,
      "S_z_S": 305,
      "S_b_W": 235,
      "S_b_S": 350,
      "T_t_W": 140,
      "T_t_S": 240,
      "A": 22,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "S420N": {
      "matGroup": "Stahl",
      "WName": "S420N",
      "WNr": "1.8902",
      "WNameAlt": "StE420",
      "matSort": 43,
      "d_B": 19,
      "R_m": 520,
      "R_eR_p2": 420,
      "S_z_W": 210,
      "S_z_S": 335,
      "S_b_W": 260,
      "S_b_S": 390,
      "T_t_W": 155,
      "T_t_S": 265,
      "roh": 7.85,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "S420NL": {
      "matGroup": "Stahl",
      "WName": "S420NL",
      "WNr": "1.8912",
      "matSort": 43,
      "d_B": 19,
      "R_m": 520,
      "R_eR_p2": 420,
      "S_z_W": 210,
      "S_z_S": 335,
      "S_b_W": 260,
      "S_b_S": 390,
      "T_t_W": 155,
      "T_t_S": 265,
      "roh": 7.85,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "S460N": {
      "matGroup": "Stahl",
      "WName": "S460N",
      "WNr": "1.8901",
      "WNameAlt": "StE460",
      "matSort": 43,
      "d_B": 16,
      "R_m": 550,
      "R_eR_p2": 460,
      "S_z_W": 220,
      "S_z_S": 350,
      "S_b_W": 275,
      "S_b_S": 410,
      "T_t_W": 165,
      "T_t_S": 280,
      "A": 17,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "S460NL": {
      "matGroup": "Stahl",
      "WName": "S460NL",
      "WNr": "1.8903",
      "matSort": 43,
      "d_B": 16,
      "R_m": 550,
      "R_eR_p2": 460,
      "S_z_W": 220,
      "S_z_S": 350,
      "S_b_W": 275,
      "S_b_S": 410,
      "T_t_W": 165,
      "T_t_S": 280,
      "A": 17,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "C22E": {
      "matGroup": "Stahl",
      "WName": "C22E",
      "WNr": "1.1151",
      "matSort": 50,
      "d_B": 16,
      "R_m": 350,
      "R_eR_p2": 350,
      "S_z_W": 200,
      "S_z_S": 320,
      "S_b_W": 250,
      "S_b_S": 375,
      "T_t_W": 150,
      "T_t_S": 245,
      "A": 7,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "C25E": {
      "matGroup": "Stahl",
      "WName": "C25E",
      "WNr": "1.1158",
      "matSort": 50,
      "d_B": 16,
      "R_m": 550,
      "R_eR_p2": 370,
      "S_z_W": 220,
      "S_z_S": 350,
      "S_b_W": 275,
      "S_b_S": 410,
      "T_t_W": 165,
      "T_t_S": 255,
      "A": 19,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "C30E": {
      "matGroup": "Stahl",
      "WName": "C30E",
      "WNr": "1.1178",
      "WNameAlt": "Ck30",
      "matSort": 50,
      "d_B": 16,
      "R_m": 600,
      "R_eR_p2": 400,
      "S_z_W": 240,
      "S_z_S": 385,
      "S_b_W": 300,
      "S_b_S": 450,
      "T_t_W": 180,
      "T_t_S": 275,
      "A": 18,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "C35E": {
      "matGroup": "Stahl",
      "WName": "C35E",
      "WNr": "1.1181",
      "matSort": 50,
      "d_B": 16,
      "R_m": 370,
      "R_eR_p2": 370,
      "S_z_W": 220,
      "S_z_S": 350,
      "S_b_W": 275,
      "S_b_S": 410,
      "T_t_W": 165,
      "T_t_S": 255,
      "A": 8,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 11.5,
        "200": 12.5,
        "300": 13.3,
        "400": 13.9
      }
    },
    "C40E": {
      "matGroup": "Stahl",
      "WName": "C40E",
      "WNr": "1.1186",
      "WNameAlt": "Ck40",
      "matSort": 50,
      "d_B": 16,
      "R_m": 650,
      "R_eR_p2": 460,
      "S_z_W": 260,
      "S_z_S": 415,
      "S_b_W": 325,
      "S_b_S": 490,
      "T_t_W": 200,
      "T_t_S": 320,
      "A": 16,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "C45E": {
      "matGroup": "Stahl",
      "WName": "C45E",
      "WNr": "1.1191",
      "matSort": 50,
      "d_B": 16,
      "R_m": 430,
      "R_eR_p2": 430,
      "S_z_W": 250,
      "S_z_S": 400,
      "S_b_W": 315,
      "S_b_S": 470,
      "T_t_W": 190,
      "T_t_S": 300,
      "A": 6,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 11.1,
        "200": 12.1,
        "300": 12.9,
        "400": 13.5
      }
    },
    "C50E": {
      "matGroup": "Stahl",
      "WName": "C50E",
      "WNr": "1.1206",
      "matSort": 50,
      "d_B": 16,
      "R_m": 750,
      "R_eR_p2": 520,
      "S_z_W": 300,
      "S_z_S": 480,
      "S_b_W": 375,
      "S_b_S": 560,
      "T_t_W": 220,
      "T_t_S": 360,
      "A": 13,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "C55E": {
      "matGroup": "Stahl",
      "WName": "C55E",
      "WNr": "1.1203",
      "matSort": 50,
      "d_B": 16,
      "R_m": 800,
      "R_eR_p2": 550,
      "S_z_W": 320,
      "S_z_S": 510,
      "S_b_W": 400,
      "S_b_S": 600,
      "T_t_W": 240,
      "T_t_S": 380,
      "A": 12,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "C60E": {
      "matGroup": "Stahl",
      "WName": "C60E",
      "WNr": "1.1221",
      "matSort": 50,
      "d_B": 16,
      "R_m": 520,
      "R_eR_p2": 520,
      "S_z_W": 300,
      "S_z_S": 480,
      "S_b_W": 375,
      "S_b_S": 560,
      "T_t_W": 225,
      "T_t_S": 360,
      "A": 6,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "28Mn6": {
      "matGroup": "Stahl",
      "WName": "28Mn6",
      "WNr": "1.1170",
      "WNameAlt": "28Mn6",
      "matSort": 50,
      "d_B": 16,
      "R_m": 800,
      "R_eR_p2": 590,
      "S_z_W": 320,
      "S_z_S": 510,
      "S_b_W": 400,
      "S_b_S": 600,
      "T_t_W": 240,
      "T_t_S": 410,
      "A": 13,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "38Cr2": {
      "matGroup": "Stahl",
      "WName": "38Cr2",
      "WNr": "1.7003",
      "matSort": 50,
      "d_B": 16,
      "R_m": 800,
      "R_eR_p2": 550,
      "S_z_W": 320,
      "S_z_S": 510,
      "S_b_W": 400,
      "S_b_S": 600,
      "T_t_W": 240,
      "T_t_S": 380,
      "A": 14,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "46Cr2": {
      "matGroup": "Stahl",
      "WName": "46Cr2",
      "WNr": "1.7006",
      "matSort": 50,
      "d_B": 16,
      "R_m": 900,
      "R_eR_p2": 650,
      "S_z_W": 360,
      "S_z_S": 575,
      "S_b_W": 450,
      "S_b_S": 675,
      "T_t_W": 270,
      "T_t_S": 450,
      "A": 12,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "34Cr4": {
      "matGroup": "Stahl",
      "WName": "34Cr4",
      "WNr": "1.7033",
      "matSort": 50,
      "d_B": 16,
      "R_m": 900,
      "R_eR_p2": 700,
      "S_z_W": 360,
      "S_z_S": 575,
      "S_b_W": 450,
      "S_b_S": 675,
      "T_t_W": 270,
      "T_t_S": 460,
      "A": 12,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "37Cr4": {
      "matGroup": "Stahl",
      "WName": "37Cr4",
      "WNr": "1.7034",
      "matSort": 50,
      "d_B": 16,
      "R_m": 950,
      "R_eR_p2": 750,
      "S_z_W": 380,
      "S_z_S": 610,
      "S_b_W": 475,
      "S_b_S": 710,
      "T_t_W": 285,
      "T_t_S": 485,
      "A": 11,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "41Cr4": {
      "matGroup": "Stahl",
      "WName": "41Cr4",
      "WNr": "1.7035",
      "matSort": 50,
      "d_B": 16,
      "R_m": 1000,
      "R_eR_p2": 800,
      "S_z_W": 400,
      "S_z_S": 640,
      "S_b_W": 500,
      "S_b_S": 750,
      "T_t_W": 300,
      "T_t_S": 510,
      "A": 11,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 11.1,
        "200": 12.1,
        "300": 12.9,
        "400": 13.5
      }
    },
    "25CrMo4": {
      "matGroup": "Stahl",
      "WName": "25CrMo4",
      "WNr": "1.7218",
      "matSort": 50,
      "d_B": 16,
      "R_m": 900,
      "R_eR_p2": 700,
      "S_z_W": 360,
      "S_z_S": 575,
      "S_b_W": 450,
      "S_b_S": 675,
      "T_t_W": 270,
      "T_t_S": 460,
      "A": 12,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 11.5,
        "200": 12.5,
        "300": 13.3,
        "400": 13.9
      }
    },
    "34CrMo4": {
      "matGroup": "Stahl",
      "WName": "34CrMo4",
      "WNr": "1.7220",
      "WNameAlt": "34CrMo4",
      "matSort": 50,
      "d_B": 16,
      "R_m": 1000,
      "R_eR_p2": 800,
      "S_z_W": 400,
      "S_z_S": 640,
      "S_b_W": 500,
      "S_b_S": 750,
      "T_t_W": 300,
      "T_t_S": 510,
      "A": 11,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 11.1,
        "200": 12.1,
        "300": 12.9,
        "400": 13.5
      }
    },
    "42CrMo4": {
      "matGroup": "Stahl",
      "WName": "42CrMo4",
      "WNr": "1.7225",
      "matSort": 50,
      "d_B": 16,
      "R_m": 1100,
      "R_eR_p2": 900,
      "S_z_W": 440,
      "S_z_S": 705,
      "S_b_W": 550,
      "S_b_S": 825,
      "T_t_W": 330,
      "T_t_S": 560,
      "A": 10,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 11.1,
        "200": 12.1,
        "300": 12.9,
        "400": 13.5
      }
    },
    "50CrMo4": {
      "matGroup": "Stahl",
      "WName": "50CrMo4",
      "WNr": "1.7228",
      "matSort": 50,
      "d_B": 16,
      "R_m": 1100,
      "R_eR_p2": 900,
      "S_z_W": 440,
      "S_z_S": 705,
      "S_b_W": 550,
      "S_b_S": 825,
      "T_t_W": 330,
      "T_t_S": 560,
      "A": 9,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 11.1,
        "200": 12.1,
        "300": 12.9,
        "400": 13.5
      }
    },
    "36CrNiMo4": {
      "matGroup": "Stahl",
      "WName": "36CrNiMo4",
      "WNr": "1.6511",
      "matSort": 50,
      "d_B": 16,
      "R_m": 1100,
      "R_eR_p2": 900,
      "S_z_W": 440,
      "S_z_S": 705,
      "S_b_W": 550,
      "S_b_S": 825,
      "T_t_W": 330,
      "T_t_S": 560,
      "A": 10,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "34CrNiMo6": {
      "matGroup": "Stahl",
      "WName": "34CrNiMo6",
      "WNr": "1.6582",
      "matSort": 50,
      "d_B": 16,
      "R_m": 1200,
      "R_eR_p2": 1000,
      "S_z_W": 480,
      "S_z_S": 770,
      "S_b_W": 600,
      "S_b_S": 900,
      "T_t_W": 360,
      "T_t_S": 610,
      "A": 9,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 11.1,
        "200": 12.1,
        "300": 12.9,
        "400": 13.5
      }
    },
    "30CrNiMo8": {
      "matGroup": "Stahl",
      "WName": "30CrNiMo8",
      "WNr": "1.6580",
      "matSort": 50,
      "d_B": 16,
      "R_m": 1250,
      "R_eR_p2": 1050,
      "S_z_W": 500,
      "S_z_S": 800,
      "S_b_W": 625,
      "S_b_S": 935,
      "T_t_W": 375,
      "T_t_S": 635,
      "A": 9,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 11.5,
        "200": 12.5,
        "300": 13.3,
        "400": 13.9
      }
    },
    "36NiCrMo16": {
      "matGroup": "Stahl",
      "WName": "36NiCrMo16",
      "WNr": "1.6773",
      "matSort": 50,
      "d_B": 16,
      "R_m": 1250,
      "R_eR_p2": 1050,
      "S_z_W": 500,
      "S_z_S": 800,
      "S_b_W": 625,
      "S_b_S": 935,
      "T_t_W": 375,
      "T_t_S": 635,
      "A": 9,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "51CrV4": {
      "matGroup": "Stahl",
      "WName": "51CrV4",
      "WNr": "1.8159",
      "matSort": 50,
      "d_B": 16,
      "R_m": 1100,
      "R_eR_p2": 900,
      "S_z_W": 440,
      "S_z_S": 705,
      "S_b_W": 550,
      "S_b_S": 825,
      "T_t_W": 330,
      "T_t_S": 560,
      "A": 9,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 11.5,
        "200": 12.5,
        "300": 13.3,
        "400": 13.9
      }
    },
    "C10": {
      "matGroup": "Stahl",
      "WName": "C10",
      "WNr": "1.0301",
      "matSort": 11,
      "d_B": 16,
      "R_m": 300,
      "R_eR_p2": 300,
      "S_z_W": 180,
      "S_z_S": 290,
      "S_b_W": 225,
      "S_b_S": 335,
      "T_t_W": 135,
      "T_t_S": 210,
      "A": 9,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "C10E": {
      "matGroup": "Stahl",
      "WName": "C10E",
      "matSort": 11,
      "R_m": 500,
      "R_eR_p2": 310,
      "S_z_W": 200,
      "S_b_W": 250,
      "T_t_W": 150,
      "roh": 7.85,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "C15": {
      "matGroup": "Stahl",
      "WName": "C15",
      "WNr": "1.0401",
      "matSort": 11,
      "d_B": 16,
      "R_m": 340,
      "R_eR_p2": 340,
      "S_z_W": 190,
      "S_z_S": 305,
      "S_b_W": 240,
      "S_b_S": 360,
      "T_t_W": 145,
      "T_t_S": 235,
      "A": 8,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "17Cr3": {
      "matGroup": "Stahl",
      "WName": "17Cr3",
      "matSort": 11,
      "R_m": 800,
      "R_eR_p2": 545,
      "S_z_W": 320,
      "S_b_W": 400,
      "T_t_W": 240,
      "roh": 7.85,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "20Cr4": {
      "matGroup": "Stahl",
      "WName": "20Cr4",
      "WNr": "1.7027",
      "matSort": 11,
      "d_B": 11,
      "R_m": 900,
      "R_eR_p2": 630,
      "S_z_W": 360,
      "S_z_S": 575,
      "S_b_W": 450,
      "S_b_S": 675,
      "T_t_W": 270,
      "T_t_S": 435,
      "A": 10,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "16MoCr4": {
      "matGroup": "Stahl",
      "WName": "16MoCr4",
      "WNr": "1.7131",
      "matSort": 11,
      "d_B": 11,
      "R_m": 900,
      "R_eR_p2": 630,
      "S_z_W": 360,
      "S_z_S": 575,
      "S_b_W": 450,
      "S_b_S": 675,
      "T_t_W": 270,
      "T_t_S": 435,
      "A": 10,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "16MnCr5": {
      "matGroup": "Stahl",
      "WName": "16MnCr5",
      "matSort": 11,
      "R_m": 1000,
      "R_eR_p2": 695,
      "S_z_W": 400,
      "S_b_W": 500,
      "T_t_W": 300,
      "roh": 7.85,
      "expansion": {
        "100": 11.5,
        "200": 12.5,
        "300": 13.5,
        "400": 13.9
      }
    },
    "18MnCrS4": {
      "matGroup": "Stahl",
      "WName": "18MnCrS4",
      "matSort": 11,
      "R_m": 1100,
      "R_eR_p2": 775,
      "S_z_W": 440,
      "S_b_W": 550,
      "T_t_W": 330,
      "roh": 7.85,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "18CrNiMo7-6": {
      "matGroup": "Stahl",
      "WName": "18CrNiMo7-6",
      "matSort": 11,
      "d_B": 16,
      "R_m": 1200,
      "R_eR_p2": 850,
      "S_z_W": 480,
      "S_b_W": 600,
      "T_t_W": 360,
      "roh": 7.85,
      "expansion": {
        "100": 11.5,
        "200": 12.5,
        "300": 13.3,
        "400": 13.9
      }
    },
    "20MnCr5": {
      "matGroup": "Stahl",
      "WName": "20MnCr5",
      "matSort": 11,
      "R_m": 1200,
      "R_eR_p2": 850,
      "S_z_W": 480,
      "S_b_W": 600,
      "T_t_W": 360,
      "roh": 7.85,
      "expansion": {
        "100": 11.5,
        "200": 12.5,
        "300": 13.5,
        "400": 13.9
      }
    },
    "20MoCr4": {
      "matGroup": "Stahl",
      "WName": "20MoCr4",
      "WNr": "1.7321",
      "matSort": 11,
      "d_B": 11,
      "R_m": 900,
      "R_eR_p2": 630,
      "S_z_W": 360,
      "S_z_S": 575,
      "S_b_W": 450,
      "S_b_S": 675,
      "T_t_W": 270,
      "T_t_S": 435,
      "A": 10,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "22CrMoS3-5": {
      "matGroup": "Stahl",
      "WName": "22CrMoS3-5",
      "WNr": "1.7333",
      "matSort": 11,
      "d_B": 11,
      "R_m": 1100,
      "R_eR_p2": 730,
      "S_z_W": 440,
      "S_z_S": 705,
      "S_b_W": 550,
      "S_b_S": 825,
      "T_t_W": 330,
      "T_t_S": 505,
      "A": 8,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "21NiCrMo2": {
      "matGroup": "Stahl",
      "WName": "21NiCrMo2",
      "WNr": "1.6523",
      "matSort": 11,
      "d_B": 11,
      "R_m": 900,
      "R_eR_p2": 630,
      "S_z_W": 360,
      "S_z_S": 575,
      "S_b_W": 450,
      "S_b_S": 675,
      "T_t_W": 270,
      "T_t_S": 435,
      "A": 10,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "15CrNi6": {
      "matGroup": "Stahl",
      "WName": "15CrNi6",
      "WNr": "1.5919",
      "matSort": 11,
      "d_B": 11,
      "R_m": 1000,
      "R_eR_p2": 680,
      "S_z_W": 400,
      "S_z_S": 640,
      "S_b_W": 500,
      "S_b_S": 750,
      "T_t_W": 300,
      "T_t_S": 470,
      "A": 9,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "17CrNiMo6": {
      "matGroup": "Stahl",
      "WName": "17CrNiMo6",
      "WNr": "1.6587",
      "matSort": 11,
      "d_B": 11,
      "R_m": 1150,
      "R_eR_p2": 830,
      "S_z_W": 460,
      "S_z_S": 735,
      "S_b_W": 575,
      "S_b_S": 860,
      "T_t_W": 345,
      "T_t_S": 575,
      "A": 8,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "31CrMo12": {
      "matGroup": "Stahl",
      "WName": "31CrMo12",
      "WNr": "1.8515",
      "matSort": 19,
      "d_B": 100,
      "R_m": 1000,
      "R_eR_p2": 800,
      "S_z_W": 400,
      "S_z_S": 640,
      "S_b_W": 500,
      "S_b_S": 750,
      "T_t_W": 300,
      "T_t_S": 510,
      "A": 11,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "31CrMoV9": {
      "matGroup": "Stahl",
      "WName": "31CrMoV9",
      "WNr": "1.8519",
      "matSort": 19,
      "d_B": 100,
      "R_m": 1000,
      "R_eR_p2": 800,
      "S_z_W": 400,
      "S_z_S": 640,
      "S_b_W": 500,
      "S_b_S": 750,
      "T_t_W": 300,
      "T_t_S": 510,
      "A": 11,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 11.5,
        "200": 12.5,
        "300": 13.3,
        "400": 13.9
      }
    },
    "15CrMoV59": {
      "matGroup": "Stahl",
      "WName": "15CrMoV59",
      "WNr": "1.8521",
      "matSort": 19,
      "d_B": 100,
      "R_m": 900,
      "R_eR_p2": 750,
      "S_z_W": 360,
      "S_z_S": 575,
      "S_b_W": 450,
      "S_b_S": 675,
      "T_t_W": 270,
      "T_t_S": 460,
      "A": 10,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "34CrAlMo5": {
      "matGroup": "Stahl",
      "WName": "34CrAlMo5",
      "WNr": "1.8507",
      "matSort": 19,
      "d_B": 100,
      "R_m": 800,
      "R_eR_p2": 600,
      "S_z_W": 320,
      "S_z_S": 510,
      "S_b_W": 400,
      "S_b_S": 600,
      "T_t_W": 240,
      "T_t_S": 410,
      "A": 14,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "34CrAlNi7": {
      "matGroup": "Stahl",
      "WName": "34CrAlNi7",
      "WNr": "1.8550",
      "matSort": 19,
      "d_B": 100,
      "R_m": 850,
      "R_eR_p2": 650,
      "S_z_W": 340,
      "S_z_S": 545,
      "S_b_W": 425,
      "S_b_S": 635,
      "T_t_W": 255,
      "T_t_S": 435,
      "A": 12,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 11.1,
        "200": 12.1,
        "300": 12.9,
        "400": 13.5
      }
    },
    "Cf35": {
      "matGroup": "Stahl",
      "WName": "Cf35",
      "WNr": "1.1183",
      "matSort": 47,
      "d_B": 16,
      "R_m": 620,
      "R_eR_p2": 420,
      "S_z_W": 250,
      "S_z_S": 400,
      "S_b_W": 310,
      "S_b_S": 465,
      "T_t_W": 185,
      "T_t_S": 290,
      "A": 17,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "Cf45": {
      "matGroup": "Stahl",
      "WName": "Cf45",
      "WNr": "1.1193",
      "matSort": 47,
      "d_B": 16,
      "R_m": 700,
      "R_eR_p2": 480,
      "S_z_W": 280,
      "S_z_S": 450,
      "S_b_W": 350,
      "S_b_S": 525,
      "T_t_W": 210,
      "T_t_S": 330,
      "A": 14,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "Cf53": {
      "matGroup": "Stahl",
      "WName": "Cf53",
      "WNr": "1.1213",
      "matSort": 47,
      "d_B": 16,
      "R_m": 740,
      "R_eR_p2": 510,
      "S_z_W": 295,
      "S_z_S": 470,
      "S_b_W": 370,
      "S_b_S": 555,
      "T_t_W": 220,
      "T_t_S": 355,
      "A": 12,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "Cf70": {
      "matGroup": "Stahl",
      "WName": "Cf70",
      "WNr": "1.1249",
      "matSort": 47,
      "d_B": 16,
      "R_m": 780,
      "R_eR_p2": 560,
      "S_z_W": 310,
      "S_z_S": 495,
      "S_b_W": 390,
      "S_b_S": 585,
      "T_t_W": 235,
      "T_t_S": 390,
      "A": 11,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "45Cr2": {
      "matGroup": "Stahl",
      "WName": "45Cr2",
      "WNr": "1.7005",
      "matSort": 47,
      "d_B": 16,
      "R_m": 880,
      "R_eR_p2": 640,
      "S_z_W": 350,
      "S_z_S": 560,
      "S_b_W": 440,
      "S_b_S": 660,
      "T_t_W": 265,
      "T_t_S": 445,
      "A": 12,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "38Cr4": {
      "matGroup": "Stahl",
      "WName": "38Cr4",
      "WNr": "1.7043",
      "matSort": 47,
      "d_B": 16,
      "R_m": 930,
      "R_eR_p2": 740,
      "S_z_W": 370,
      "S_z_S": 590,
      "S_b_W": 465,
      "S_b_S": 700,
      "T_t_W": 280,
      "T_t_S": 475,
      "A": 11,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "42Cr4": {
      "matGroup": "Stahl",
      "WName": "42Cr4",
      "WNr": "1.7045",
      "matSort": 47,
      "d_B": 16,
      "R_m": 980,
      "R_eR_p2": 780,
      "S_z_W": 390,
      "S_z_S": 625,
      "S_b_W": 490,
      "S_b_S": 735,
      "T_t_W": 295,
      "T_t_S": 500,
      "A": 11,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "41CrMo4": {
      "matGroup": "Stahl",
      "WName": "41CrMo4",
      "WNr": "1.7223",
      "matSort": 47,
      "d_B": 16,
      "R_m": 1080,
      "R_eR_p2": 880,
      "S_z_W": 430,
      "S_z_S": 690,
      "S_b_W": 540,
      "S_b_S": 810,
      "T_t_W": 325,
      "T_t_S": 550,
      "A": 10,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "9SMn28": {
      "matGroup": "Stahl",
      "WName": "9SMn28",
      "WNr": "1.0715",
      "matSort": 8,
      "d_B": 16,
      "R_m": 510,
      "R_eR_p2": 410,
      "S_z_W": 205,
      "S_z_S": 325,
      "S_b_W": 255,
      "S_b_S": 380,
      "T_t_W": 150,
      "T_t_S": 255,
      "A": 7,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "9SMnPb28": {
      "matGroup": "Stahl",
      "WName": "9SMnPb28",
      "WNr": "1.0718",
      "matSort": 8,
      "d_B": 16,
      "R_m": 510,
      "R_eR_p2": 410,
      "S_z_W": 205,
      "S_z_S": 325,
      "S_b_W": 255,
      "S_b_S": 380,
      "T_t_W": 150,
      "T_t_S": 255,
      "A": 7,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "9SMn36": {
      "matGroup": "Stahl",
      "WName": "9SMn36",
      "WNr": "1.0736",
      "matSort": 8,
      "d_B": 16,
      "R_m": 540,
      "R_eR_p2": 430,
      "S_z_W": 215,
      "S_z_S": 345,
      "S_b_W": 270,
      "S_b_S": 405,
      "T_t_W": 160,
      "T_t_S": 270,
      "A": 7,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "9SMnPb36": {
      "matGroup": "Stahl",
      "WName": "9SMnPb36",
      "WNr": "1.0737",
      "matSort": 8,
      "d_B": 16,
      "R_m": 540,
      "R_eR_p2": 430,
      "S_z_W": 215,
      "S_z_S": 345,
      "S_b_W": 270,
      "S_b_S": 405,
      "T_t_W": 160,
      "T_t_S": 270,
      "A": 7,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "15S10": {
      "matGroup": "Stahl",
      "WName": "15S10",
      "WNr": "1.0710",
      "matSort": 8,
      "d_B": 16,
      "R_m": 500,
      "R_eR_p2": 400,
      "S_z_W": 200,
      "S_z_S": 320,
      "S_b_W": 250,
      "S_b_S": 375,
      "T_t_W": 150,
      "T_t_S": 255,
      "A": 7,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "10S20": {
      "matGroup": "Stahl",
      "WName": "10S20",
      "WNr": "1.0721",
      "matSort": 8,
      "d_B": 16,
      "R_m": 490,
      "R_eR_p2": 390,
      "S_z_W": 195,
      "S_z_S": 310,
      "S_b_W": 245,
      "S_b_S": 365,
      "T_t_W": 145,
      "T_t_S": 245,
      "A": 8,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "10SPb20": {
      "matGroup": "Stahl",
      "WName": "10SPb20",
      "WNr": "1.0722",
      "matSort": 8,
      "d_B": 16,
      "R_m": 490,
      "R_eR_p2": 390,
      "S_z_W": 195,
      "S_z_S": 310,
      "S_b_W": 245,
      "S_b_S": 365,
      "T_t_W": 145,
      "T_t_S": 245,
      "A": 8,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "35S20": {
      "matGroup": "Stahl",
      "WName": "35S20",
      "WNr": "1.0726",
      "matSort": 8,
      "d_B": 16,
      "R_m": 590,
      "R_eR_p2": 400,
      "S_z_W": 235,
      "S_z_S": 375,
      "S_b_W": 295,
      "S_b_S": 440,
      "T_t_W": 175,
      "T_t_S": 275,
      "A": 7,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "35SPb20": {
      "matGroup": "Stahl",
      "WName": "35SPb20",
      "WNr": "1.0756",
      "matSort": 8,
      "d_B": 16,
      "R_m": 590,
      "R_eR_p2": 400,
      "S_z_W": 235,
      "S_z_S": 375,
      "S_b_W": 295,
      "S_b_S": 440,
      "T_t_W": 175,
      "T_t_S": 275,
      "A": 7,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "45S20": {
      "matGroup": "Stahl",
      "WName": "45S20",
      "WNr": "1.0727",
      "matSort": 8,
      "d_B": 16,
      "R_m": 690,
      "R_eR_p2": 470,
      "S_z_W": 275,
      "S_z_S": 440,
      "S_b_W": 345,
      "S_b_S": 515,
      "T_t_W": 205,
      "T_t_S": 325,
      "A": 6,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "45SPb20": {
      "matGroup": "Stahl",
      "WName": "45SPb20",
      "WNr": "1.0757",
      "matSort": 8,
      "d_B": 16,
      "R_m": 690,
      "R_eR_p2": 470,
      "S_z_W": 275,
      "S_z_S": 440,
      "S_b_W": 345,
      "S_b_S": 515,
      "T_t_W": 205,
      "T_t_S": 325,
      "A": 6,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "60S20": {
      "matGroup": "Stahl",
      "WName": "60S20",
      "WNr": "1.0728",
      "matSort": 8,
      "d_B": 16,
      "R_m": 780,
      "R_eR_p2": 540,
      "S_z_W": 310,
      "S_z_S": 495,
      "S_b_W": 390,
      "S_b_S": 585,
      "T_t_W": 235,
      "T_t_S": 375,
      "A": 6,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "60SPb20": {
      "matGroup": "Stahl",
      "WName": "60SPb20",
      "WNr": "1.0758",
      "matSort": 8,
      "d_B": 16,
      "R_m": 780,
      "R_eR_p2": 540,
      "S_z_W": 310,
      "S_z_S": 495,
      "S_b_W": 390,
      "S_b_S": 585,
      "T_t_W": 235,
      "T_t_S": 375,
      "A": 6,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "X3CrNb17": {
      "matGroup": "Stahl",
      "WName": "X3CrNb17",
      "WNr": "1.4511",
      "matSort": 13,
      "R_m": 420,
      "R_eR_p2": 230,
      "S_z_W": 170,
      "S_z_S": 230,
      "S_b_W": 210,
      "S_b_S": 275,
      "T_t_W": 125,
      "T_t_S": 160,
      "A": 23,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "X6CrMoS17": {
      "matGroup": "Stahl",
      "WName": "X6CrMoS17",
      "WNr": "1.4105",
      "matSort": 13,
      "R_m": 430,
      "R_eR_p2": 250,
      "S_z_W": 170,
      "S_z_S": 250,
      "S_b_W": 215,
      "S_b_S": 300,
      "T_t_W": 130,
      "T_t_S": 175,
      "A": 20,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "X6Cr13": {
      "matGroup": "Stahl",
      "WName": "X6Cr13",
      "WNr": "1.4000",
      "matSort": 13,
      "R_m": 400,
      "R_eR_p2": 240,
      "S_z_W": 160,
      "S_z_S": 240,
      "S_b_W": 200,
      "S_b_S": 290,
      "T_t_W": 120,
      "T_t_S": 165,
      "A": 19,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "X6Cr17": {
      "matGroup": "Stahl",
      "WName": "X6Cr17",
      "WNr": "1.4016",
      "matSort": 13,
      "R_m": 450,
      "R_eR_p2": 240,
      "S_z_W": 180,
      "S_z_S": 240,
      "S_b_W": 225,
      "S_b_S": 290,
      "T_t_W": 135,
      "T_t_S": 165,
      "A": 20,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 13,
        "200": 13.5,
        "300": 14
      }
    },
    "X20Cr13": {
      "matGroup": "Stahl",
      "WName": "X20Cr13",
      "WNr": "1.4021",
      "matSort": 16,
      "R_m": 750,
      "R_eR_p2": 550,
      "S_z_W": 300,
      "S_z_S": 480,
      "S_b_W": 375,
      "S_b_S": 560,
      "T_t_W": 225,
      "T_t_S": 380,
      "A": 10,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "X39CrMo17-1": {
      "matGroup": "Stahl",
      "WName": "X39CrMo17-1",
      "WNr": "1.4122",
      "matSort": 16,
      "R_m": 750,
      "R_eR_p2": 500,
      "S_z_W": 300,
      "S_z_S": 480,
      "S_b_W": 375,
      "S_b_S": 560,
      "T_t_W": 225,
      "T_t_S": 345,
      "A": 12,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "X14CrMoS17": {
      "matGroup": "Stahl",
      "WName": "X14CrMoS17",
      "WNr": "1.4102",
      "matSort": 16,
      "R_m": 640,
      "R_eR_p2": 450,
      "S_z_W": 255,
      "S_z_S": 410,
      "S_b_W": 320,
      "S_b_S": 480,
      "T_t_W": 190,
      "T_t_S": 310,
      "A": 11,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "X50CrMoV15": {
      "matGroup": "Stahl",
      "WName": "X50CrMoV15",
      "WNr": "1.4116",
      "matSort": 16,
      "R_m": 850,
      "S_z_W": 340,
      "S_z_S": 545,
      "S_b_W": 425,
      "S_b_S": 635,
      "T_t_W": 255,
      "T_t_S": 410,
      "A": 12,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "X12Cr13": {
      "matGroup": "Stahl",
      "WName": "X12Cr13",
      "WNr": "1.4006",
      "matSort": 16,
      "R_m": 650,
      "R_eR_p2": 450,
      "S_z_W": 260,
      "S_z_S": 415,
      "S_b_W": 325,
      "S_b_S": 485,
      "T_t_W": 195,
      "T_t_S": 310,
      "A": 12,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "X3CrNiMo13-4": {
      "matGroup": "Stahl",
      "WName": "X3CrNiMo13-4",
      "WNr": "1.4313",
      "matSort": 16,
      "R_m": 900,
      "R_eR_p2": 800,
      "S_z_W": 360,
      "S_z_S": 575,
      "S_b_W": 450,
      "S_b_S": 675,
      "T_t_W": 270,
      "T_t_S": 460,
      "A": 11,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "X17CrNi16-2": {
      "matGroup": "Stahl",
      "WName": "X17CrNi16-2",
      "WNr": "1.4057",
      "matSort": 16,
      "R_m": 750,
      "R_eR_p2": 550,
      "S_z_W": 300,
      "S_z_S": 480,
      "S_b_W": 375,
      "S_b_S": 560,
      "T_t_W": 225,
      "T_t_S": 380,
      "A": 14,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "X5CrNi18-10": {
      "matGroup": "Stahl",
      "WName": "X5CrNi18-10",
      "WNr": "1.4301",
      "WNameAlt": "V2A",
      "matSort": 7,
      "R_m": 520,
      "R_eR_p2": 210,
      "S_z_W": 210,
      "S_z_S": 210,
      "S_b_W": 250,
      "S_b_S": 250,
      "T_t_W": 145,
      "T_t_S": 145,
      "A": 40,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 16,
        "200": 17,
        "300": 17,
        "400": 18,
        "500": 18
      }
    },
    "X8CrNiS18-9": {
      "matGroup": "Stahl",
      "WName": "X8CrNiS18-9",
      "WNr": "1.4305",
      "matSort": 7,
      "R_m": 500,
      "R_eR_p2": 190,
      "S_z_W": 190,
      "S_z_S": 190,
      "S_b_W": 230,
      "S_b_S": 230,
      "T_t_W": 130,
      "T_t_S": 130,
      "A": 35,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "X6CrNiTi18-10": {
      "matGroup": "Stahl",
      "WName": "X6CrNiTi18-10",
      "WNr": "1.4541",
      "matSort": 7,
      "R_m": 500,
      "R_eR_p2": 200,
      "S_z_W": 200,
      "S_z_S": 200,
      "S_b_W": 240,
      "S_b_S": 240,
      "T_t_W": 140,
      "T_t_S": 140,
      "A": 40,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 16,
        "200": 16.5,
        "300": 17,
        "400": 17.5,
        "500": 18
      }
    },
    "X2CrNiMo17-12-2": {
      "matGroup": "Stahl",
      "WName": "X2CrNiMo17-12-2",
      "WNr": "1.4404",
      "WNameAlt": "V4A",
      "matSort": 7,
      "R_m": 520,
      "R_eR_p2": 220,
      "S_z_W": 220,
      "S_z_S": 220,
      "S_b_W": 260,
      "S_b_S": 260,
      "T_t_W": 150,
      "T_t_S": 150,
      "A": 40,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 15.8,
        "200": 16.1,
        "300": 16.5,
        "400": 16.9
      }
    },
    "X2CrNiMoN17-13-3": {
      "matGroup": "Stahl",
      "WName": "X2CrNiMoN17-13-3",
      "WNr": "1.4429",
      "matSort": 7,
      "R_m": 580,
      "R_eR_p2": 295,
      "S_z_W": 230,
      "S_z_S": 295,
      "S_b_W": 290,
      "S_b_S": 355,
      "T_t_W": 175,
      "T_t_S": 205,
      "A": 35,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "X5CrNiMo17-12-2": {
      "matGroup": "Stahl",
      "WName": "X5CrNiMo17-12-2",
      "WNr": "1.4401",
      "WNameAlt": "V4A",
      "matSort": 7,
      "R_m": 520,
      "R_eR_p2": 220,
      "S_z_W": 220,
      "S_z_S": 220,
      "S_b_W": 260,
      "S_b_S": 260,
      "T_t_W": 150,
      "T_t_S": 150,
      "A": 40,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 16.5,
        "200": 17.5,
        "300": 17.5,
        "400": 18.5,
        "500": 18.5
      }
    },
    "X6CrNiMoTi17-12-2": {
      "matGroup": "Stahl",
      "WName": "X6CrNiMoTi17-12-2",
      "WNr": "1.4571",
      "WNameAlt": "V4A",
      "matSort": 7,
      "R_m": 520,
      "R_eR_p2": 220,
      "S_z_W": 220,
      "S_z_S": 220,
      "S_b_W": 260,
      "S_b_S": 260,
      "T_t_W": 150,
      "T_t_S": 150,
      "A": 40,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 16.5,
        "200": 17.5,
        "300": 18.5,
        "400": 18.5,
        "500": 19
      }
    },
    "X2CrNiN24-4": {
      "matGroup": "Stahl",
      "WName": "X2CrNiN24-4",
      "WNr": "1.4362",
      "matSort": 6,
      "R_m": 600,
      "R_eR_p2": 400,
      "S_z_W": 240,
      "S_z_S": 385,
      "S_b_W": 300,
      "S_b_S": 450,
      "T_t_W": 180,
      "T_t_S": 275,
      "A": 25,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "X3CrNiMoN27-5-2": {
      "matGroup": "Stahl",
      "WName": "X3CrNiMoN27-5-2",
      "WNr": "1.4460",
      "matSort": 6,
      "R_m": 600,
      "R_eR_p2": 450,
      "S_z_W": 240,
      "S_z_S": 385,
      "S_b_W": 300,
      "S_b_S": 450,
      "T_t_W": 180,
      "T_t_S": 305,
      "A": 20,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "X2CrNiMoN22-5-3": {
      "matGroup": "Stahl",
      "WName": "X2CrNiMoN22-5-3",
      "WNr": "1.4462",
      "matSort": 6,
      "R_m": 640,
      "R_eR_p2": 450,
      "S_z_W": 255,
      "S_z_S": 410,
      "S_b_W": 320,
      "S_b_S": 480,
      "T_t_W": 190,
      "T_t_S": 310,
      "A": 30,
      "roh": 7.85,
      "E-Modul": 210000,
      "G-Modul": 81000,
      "expansion": {
        "100": 12,
        "200": 12,
        "300": 12,
        "400": 12
      }
    },
    "Silumin": {
      "matGroup": "Aluminium",
      "WName": "Silumin",
      "matSort": 12,
      "matZustand": 0,
      "matVerfahren": "Sandguss",
      "R_m": 150,
      "R_eR_p2": 70,
      "A": 6,
      "roh": 2.7,
      "brinell": 45,
      "Sig_W": "60-90",
      "E-Modul": 75000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi12(a)": {
      "matGroup": "Aluminium",
      "WName": "AlSi12(a)",
      "matSort": 12,
      "matZustand": 0,
      "matVerfahren": "Kokillenguss",
      "R_m": 170,
      "R_eR_p2": 80,
      "A": 6,
      "roh": 2.7,
      "brinell": 55,
      "Sig_W": "60-90",
      "E-Modul": 75000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlS12(b)": {
      "matGroup": "Aluminium",
      "WName": "AlS12(b)",
      "matSort": 12,
      "matZustand": 0,
      "matVerfahren": "Sandguss",
      "R_m": 150,
      "R_eR_p2": 70,
      "A": 4,
      "roh": 2.7,
      "brinell": 50,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi12(Cu)": {
      "matGroup": "Aluminium",
      "WName": "AlSi12(Cu)",
      "matSort": 12,
      "matZustand": 0,
      "matVerfahren": "Kokillenguss",
      "R_m": 170,
      "R_eR_p2": 90,
      "A": 2,
      "roh": 2.7,
      "brinell": 55,
      "Sig_W": "60-90",
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "Silium": {
      "matGroup": "Aluminium",
      "WName": "Silium",
      "matSort": 12,
      "matZustand": 0,
      "matVerfahren": "Kokillenguss",
      "R_m": 170,
      "R_eR_p2": 80,
      "A": 7,
      "roh": 2.7,
      "brinell": 45,
      "Sig_W": "60-90",
      "E-Modul": 75000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi12(Fe)(a)": {
      "matGroup": "Aluminium",
      "WName": "AlSi12(Fe)(a)",
      "matSort": 12,
      "matZustand": 0,
      "matVerfahren": "Druckguss",
      "R_m": 240,
      "R_eR_p2": 130,
      "A": 1,
      "roh": 2.7,
      "brinell": 60,
      "Sig_W": "60-90",
      "E-Modul": 75000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi12(Fe)(b)": {
      "matGroup": "Aluminium",
      "WName": "AlSi12(Fe)(b)",
      "matSort": 12,
      "matZustand": 0,
      "matVerfahren": "Druckguss",
      "R_m": 240,
      "R_eR_p2": 140,
      "A": 1,
      "roh": 2.7,
      "brinell": 60,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi12Cu1(Fe)": {
      "matGroup": "Aluminium",
      "WName": "AlSi12Cu1(Fe)",
      "matSort": 12,
      "matZustand": 0,
      "matVerfahren": "Druckguss",
      "R_m": 240,
      "R_eR_p2": 140,
      "A": 1,
      "roh": 2.7,
      "brinell": 70,
      "Sig_W": "60-90",
      "E-Modul": 75000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "Silumin-Kappa-Sr": {
      "matGroup": "Aluminium",
      "WName": "Silumin-Kappa-Sr",
      "matSort": 12,
      "matZustand": 0,
      "matVerfahren": "Kokillenguss",
      "R_m": 170,
      "R_eR_p2": 80,
      "A": 6,
      "roh": 2.7,
      "brinell": 45,
      "Sig_W": "60-90",
      "E-Modul": 74000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "Silumin-Beta-Sr": {
      "matGroup": "Aluminium",
      "WName": "Silumin-Beta-Sr",
      "matSort": 12,
      "matZustand": 5,
      "matVerfahren": "Kokillenguss",
      "R_m": 250,
      "R_eR_p2": 180,
      "A": 6,
      "roh": 2.7,
      "brinell": 80,
      "Sig_W": "60-90",
      "E-Modul": 74000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi11": {
      "matGroup": "Aluminium",
      "WName": "AlSi11",
      "matSort": 12,
      "matZustand": 0,
      "matVerfahren": "Kokillenguss",
      "R_m": 170,
      "R_eR_p2": 80,
      "A": 7,
      "roh": 2.7,
      "brinell": 45,
      "Sig_W": "60-90",
      "E-Modul": 74000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "Silumin-Beta/AlSi9Mg": {
      "matGroup": "Aluminium",
      "WName": "Silumin-Beta/AlSi9Mg",
      "matSort": 0,
      "matZustand": 5,
      "matVerfahren": "Kokillenguss",
      "R_m": 250,
      "R_eR_p2": 180,
      "A": 6,
      "roh": 2.7,
      "brinell": 80,
      "Sig_W": "80-110",
      "E-Modul": 74000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi10Mg(a)": {
      "matGroup": "Aluminium",
      "WName": "AlSi10Mg(a)",
      "matSort": 0,
      "matZustand": 5,
      "matVerfahren": "Kokillenguss",
      "R_m": 240,
      "R_eR_p2": 200,
      "A": 2,
      "roh": 2.7,
      "brinell": 80,
      "E-Modul": 74000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi10Mg(b)": {
      "matGroup": "Aluminium",
      "WName": "AlSi10Mg(b)",
      "matSort": 0,
      "matZustand": 5,
      "matVerfahren": "Kokillenguss",
      "R_m": 240,
      "R_eR_p2": 200,
      "A": 2,
      "roh": 2.7,
      "brinell": 80,
      "E-Modul": 74000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi10Mg(Cu)": {
      "matGroup": "Aluminium",
      "WName": "AlSi10Mg(Cu)",
      "matSort": 0,
      "matZustand": 6,
      "matVerfahren": "Kokillenguss",
      "R_m": 240,
      "R_eR_p2": 200,
      "A": 1,
      "roh": 2.7,
      "brinell": 80,
      "Sig_W": "80-110",
      "E-Modul": 74000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi10Mg(Fe)": {
      "matGroup": "Aluminium",
      "WName": "AlSi10Mg(Fe)",
      "matSort": 0,
      "matZustand": 0,
      "matVerfahren": "Druckguss",
      "R_m": 240,
      "R_eR_p2": 140,
      "A": 1,
      "roh": 2.7,
      "brinell": 70,
      "Sig_W": "60-90",
      "E-Modul": 74000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi9": {
      "matGroup": "Aluminium",
      "WName": "AlSi9",
      "matSort": 0,
      "matZustand": 0,
      "matVerfahren": "Druckguss",
      "R_m": 220,
      "R_eR_p2": 120,
      "A": 2,
      "roh": 2.7,
      "brinell": 55,
      "Sig_W": "60-90",
      "E-Modul": 74000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "Silumin-Delta": {
      "matGroup": "Aluminium",
      "WName": "Silumin-Delta",
      "matSort": 0,
      "matZustand": 0,
      "matVerfahren": "Druckguss",
      "R_m": 220,
      "R_eR_p2": 120,
      "A": 4,
      "roh": 2.7,
      "brinell": 55,
      "Sig_W": "60-90",
      "E-Modul": 74000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "Silumin-Gamma": {
      "matGroup": "Aluminium",
      "WName": "Silumin-Gamma",
      "matSort": 0,
      "matZustand": 6,
      "matVerfahren": "Druckguss",
      "R_m": 290,
      "R_eR_p2": 210,
      "A": 7,
      "roh": 2.7,
      "brinell": 100,
      "E-Modul": 74000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "Pantal7/AlSi7Mg0.3": {
      "matGroup": "Aluminium",
      "WName": "Pantal7/AlSi7Mg0.3",
      "matSort": 1,
      "matZustand": 5,
      "matVerfahren": "Kokillenguss",
      "R_m": 250,
      "R_eR_p2": 180,
      "A": 8,
      "roh": 2.7,
      "brinell": 80,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi7Mg0.6": {
      "matGroup": "Aluminium",
      "WName": "AlSi7Mg0.6",
      "matSort": 1,
      "matZustand": 5,
      "matVerfahren": "Kokillenguss",
      "R_m": 290,
      "R_eR_p2": 210,
      "A": 6,
      "roh": 2.7,
      "brinell": 90,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi7Mg": {
      "matGroup": "Aluminium",
      "WName": "AlSi7Mg",
      "matSort": 1,
      "matZustand": 5,
      "matVerfahren": "Kokillenguss",
      "R_m": 240,
      "R_eR_p2": 200,
      "A": 2,
      "roh": 2.7,
      "brinell": 80,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "Pantal5": {
      "matGroup": "Aluminium",
      "WName": "Pantal5",
      "matSort": 1,
      "matZustand": 4,
      "matVerfahren": "Kokillenguss",
      "R_m": 210,
      "R_eR_p2": 160,
      "A": 5,
      "roh": 2.7,
      "brinell": 75,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi5Mg": {
      "matGroup": "Aluminium",
      "WName": "AlSi5Mg",
      "matSort": 1,
      "matZustand": 4,
      "matVerfahren": "Kokillenguss",
      "R_m": 210,
      "R_eR_p2": 160,
      "A": 4,
      "roh": 2.7,
      "brinell": 75,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi5Cu1Mg": {
      "matGroup": "Aluminium",
      "WName": "AlSi5Cu1Mg",
      "matSort": 1,
      "matZustand": 4,
      "matVerfahren": "Kokillenguss",
      "R_m": 230,
      "R_eR_p2": 140,
      "A": 3,
      "roh": 2.7,
      "brinell": 85,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi7Cu0.5Mg": {
      "matGroup": "Aluminium",
      "WName": "AlSi7Cu0.5Mg",
      "matSort": 1,
      "matZustand": 6,
      "matVerfahren": "Kokillenguss",
      "R_m": 320,
      "R_eR_p2": 240,
      "A": 4,
      "roh": 2.7,
      "brinell": 100,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi8Cu3": {
      "matGroup": "Aluminium",
      "WName": "AlSi8Cu3",
      "matSort": 5,
      "matZustand": 0,
      "matVerfahren": "Druckguss",
      "R_m": 240,
      "R_eR_p2": 140,
      "A": 1,
      "roh": 2.7,
      "brinell": 80,
      "Sig_W": "60-90",
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi7Cu3Mg": {
      "matGroup": "Aluminium",
      "WName": "AlSi7Cu3Mg",
      "matSort": 5,
      "matZustand": 0,
      "matVerfahren": "Kokillenguss",
      "R_m": 180,
      "R_eR_p2": 100,
      "A": 1,
      "roh": 2.7,
      "brinell": 80,
      "Sig_W": "60-90",
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi9Cu1Mg": {
      "matGroup": "Aluminium",
      "WName": "AlSi9Cu1Mg",
      "matSort": 5,
      "matZustand": 6,
      "matVerfahren": "Kokillenguss",
      "R_m": 275,
      "R_eR_p2": 235,
      "A": "1.5.",
      "roh": 2.7,
      "brinell": 105,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi7Cu2": {
      "matGroup": "Aluminium",
      "WName": "AlSi7Cu2",
      "matSort": 5,
      "matZustand": 0,
      "matVerfahren": "Kokillenguss",
      "R_m": 170,
      "R_eR_p2": 100,
      "A": 1,
      "roh": 2.7,
      "brinell": 75,
      "Sig_W": "50-70",
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi6Cu4": {
      "matGroup": "Aluminium",
      "WName": "AlSi6Cu4",
      "matSort": 5,
      "matZustand": 4,
      "matVerfahren": "Kokillenguss",
      "R_m": 230,
      "R_eR_p2": 110,
      "A": 6,
      "roh": 2.7,
      "brinell": 75,
      "Sig_W": "70-100",
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi5Cu3Mg": {
      "matGroup": "Aluminium",
      "WName": "AlSi5Cu3Mg",
      "matSort": 5,
      "matZustand": 6,
      "matVerfahren": "Kokillenguss",
      "R_m": 320,
      "R_eR_p2": 280,
      "A": "<1",
      "roh": 2.7,
      "brinell": 110,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi5Cu3": {
      "matGroup": "Aluminium",
      "WName": "AlSi5Cu3",
      "matSort": 5,
      "matZustand": 0,
      "matVerfahren": "Kokillenguss",
      "R_m": 170,
      "R_eR_p2": 100,
      "A": 1,
      "roh": 2.7,
      "brinell": 75,
      "Sig_W": "60-90",
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi11Cu2(Fe)": {
      "matGroup": "Aluminium",
      "WName": "AlSi11Cu2(Fe)",
      "matSort": 5,
      "matZustand": 0,
      "matVerfahren": "Druckguss",
      "R_m": 240,
      "R_eR_p2": 140,
      "A": "<1",
      "roh": 2.7,
      "brinell": 80,
      "Sig_W": "60-90",
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlMg1.8": {
      "matGroup": "Aluminium",
      "WName": "AlMg1.8",
      "matSort": 4,
      "matZustand": 1,
      "R_m": 150,
      "R_eR_p2": 50,
      "A": 14,
      "roh": 2.7,
      "brinell": 38,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlMg3(H)": {
      "matGroup": "Aluminium",
      "WName": "AlMg3(H)",
      "matSort": 4,
      "matZustand": 0,
      "matVerfahren": "Kokillenguss",
      "R_m": 150,
      "R_eR_p2": 70,
      "A": 5,
      "roh": 2.7,
      "brinell": 50,
      "Sig_W": "60-90",
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlMg3": {
      "matGroup": "Aluminium",
      "WName": "AlMg3",
      "matSort": 4,
      "matZustand": 0,
      "R_m": 140,
      "R_eR_p2": 70,
      "A": 3,
      "roh": 2.7,
      "brinell": 50,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlMg3(Cu)": {
      "matGroup": "Aluminium",
      "WName": "AlMg3(Cu)",
      "matSort": 4,
      "matZustand": 0,
      "matVerfahren": "Kokillenguss",
      "R_m": 150,
      "R_eR_p2": 70,
      "A": 3,
      "roh": 2.7,
      "brinell": 50,
      "Sig_W": "60-90",
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlMg3Si(H)": {
      "matGroup": "Aluminium",
      "WName": "AlMg3Si(H)",
      "matSort": 4,
      "matZustand": 6,
      "matVerfahren": "Kokillenguss",
      "R_m": 220,
      "R_eR_p2": 150,
      "A": 4,
      "roh": 2.7,
      "brinell": 75,
      "Sig_W": "70-90",
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlMg4.5Mn0.7": {
      "matGroup": "Aluminium",
      "WName": "AlMg4.5Mn0.7",
      "matSort": 4,
      "matZustand": 1,
      "R_m": 270,
      "R_eR_p2": 120,
      "A": 12,
      "roh": 2.7,
      "brinell": 65,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlMg5": {
      "matGroup": "Aluminium",
      "WName": "AlMg5",
      "matSort": 4,
      "matZustand": 0,
      "R_m": 160,
      "R_eR_p2": 90,
      "A": 3,
      "roh": 2.7,
      "brinell": 55,
      "E-Modul": 69000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi2MgTi": {
      "matGroup": "Aluminium",
      "WName": "AlSi2MgTi",
      "matSort": 4,
      "matZustand": 6,
      "matVerfahren": "Kokillenguss",
      "R_m": 260,
      "R_eR_p2": 180,
      "A": 5,
      "roh": 2.7,
      "brinell": 85,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlMg5(Si)": {
      "matGroup": "Aluminium",
      "WName": "AlMg5(Si)",
      "matSort": 4,
      "matZustand": 0,
      "R_m": 180,
      "R_eR_p2": 110,
      "A": 3,
      "roh": 2.7,
      "brinell": 65,
      "E-Modul": 69000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlMg9(H)/Fe": {
      "matGroup": "Aluminium",
      "WName": "AlMg9(H)/Fe",
      "matSort": 4,
      "matZustand": 0,
      "matVerfahren": "Druckguss",
      "R_m": 200,
      "R_eR_p2": 140,
      "A": 1,
      "roh": 2.7,
      "brinell": 70,
      "Sig_W": "60-90",
      "E-Modul": 68000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlMg9": {
      "matGroup": "Aluminium",
      "WName": "AlMg9",
      "matSort": 4,
      "matZustand": 0,
      "matVerfahren": "Druckguss",
      "R_m": 200,
      "R_eR_p2": 130,
      "A": 1,
      "roh": 2.7,
      "brinell": 70,
      "Sig_W": "60-90",
      "E-Modul": 68000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlCu4Ti": {
      "matGroup": "Aluminium",
      "WName": "AlCu4Ti",
      "matSort": 14,
      "matZustand": 5,
      "matVerfahren": "Sandguss",
      "R_m": 280,
      "R_eR_p2": 180,
      "A": 5,
      "roh": 2.7,
      "brinell": 85,
      "E-Modul": 72000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlCu4TiMg": {
      "matGroup": "Aluminium",
      "WName": "AlCu4TiMg",
      "matSort": 14,
      "matZustand": 4,
      "matVerfahren": "Sandguss",
      "R_m": 300,
      "R_eR_p2": 200,
      "A": 5,
      "roh": 2.7,
      "brinell": 90,
      "E-Modul": 72000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlCu4TiMgAg": {
      "matGroup": "Aluminium",
      "WName": "AlCu4TiMgAg",
      "matSort": 14,
      "matZustand": 6,
      "matVerfahren": "Kokillenguss",
      "R_m": "460-510",
      "R_eR_p2": "410-460",
      "A": 8,
      "roh": 2.7,
      "brinell": "130-150",
      "Sig_W": "100-110",
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlCu5NiCoSbZr": {
      "matGroup": "Aluminium",
      "WName": "AlCu5NiCoSbZr",
      "matSort": 14,
      "matZustand": 3,
      "matVerfahren": "Sandguss",
      "R_m": "180-220",
      "R_eR_p2": "160-180",
      "A": "1-1.5",
      "roh": 2.7,
      "brinell": "80-90",
      "Sig_W": "90-100",
      "E-Modul": 76000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlCu4Ti(H)": {
      "matGroup": "Aluminium",
      "WName": "AlCu4Ti(H)",
      "matSort": 14,
      "matZustand": 5,
      "matVerfahren": "Kokillenguss",
      "R_m": 320,
      "R_eR_p2": 180,
      "A": 8,
      "roh": 2.7,
      "brinell": 90,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlCu4MgTi": {
      "matGroup": "Aluminium",
      "WName": "AlCu4MgTi",
      "matSort": 14,
      "matZustand": 4,
      "matVerfahren": "Kokillenguss",
      "R_m": 320,
      "R_eR_p2": 200,
      "A": 8,
      "roh": 2.7,
      "brinell": 95,
      "Sig_W": "80-110",
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlCu6BiPb": {
      "matGroup": "Aluminium",
      "WName": "AlCu6BiPb",
      "matSort": 14,
      "matZustand": 6,
      "R_m": 310,
      "R_eR_p2": 230,
      "A": 8,
      "roh": 2.7,
      "brinell": 110,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlCu4SiMg": {
      "matGroup": "Aluminium",
      "WName": "AlCu4SiMg",
      "matSort": 14,
      "matZustand": 6,
      "R_m": 440,
      "R_eR_p2": 380,
      "A": 6,
      "roh": 2.7,
      "brinell": 12,
      "Sig_W": ">120",
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlCu4Mg1": {
      "matGroup": "Aluminium",
      "WName": "AlCu4Mg1",
      "matSort": 14,
      "matZustand": 4,
      "R_m": 420,
      "R_eR_p2": 260,
      "A": 8,
      "roh": 2.7,
      "brinell": 100,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi12CuNiMg": {
      "matGroup": "Aluminium",
      "WName": "AlSi12CuNiMg",
      "matSort": 15,
      "matZustand": 3,
      "matVerfahren": "Druckguss",
      "R_m": 240,
      "R_eR_p2": 140,
      "A": "< 1",
      "roh": 2.7,
      "brinell": 90,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi12.5MgCuNi": {
      "matGroup": "Aluminium",
      "WName": "AlSi12.5MgCuNi",
      "matSort": 15,
      "matZustand": 6,
      "R_m": 360,
      "R_eR_p2": 340,
      "A": 5,
      "roh": 2.7,
      "brinell": 115,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi17Cu4Mg": {
      "matGroup": "Aluminium",
      "WName": "AlSi17Cu4Mg",
      "matSort": 15,
      "matZustand": 3,
      "matVerfahren": "Druckguss",
      "R_m": 230,
      "R_eR_p2": 210,
      "A": "< 1",
      "roh": 2.7,
      "brinell": 100,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlSi18CuNiMg": {
      "matGroup": "Aluminium",
      "WName": "AlSi18CuNiMg",
      "matSort": 15,
      "matZustand": 0,
      "matVerfahren": "Druckguss",
      "R_m": 210,
      "R_eR_p2": 180,
      "A": "< 1",
      "roh": 2.7,
      "brinell": 100,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "Autodur": {
      "matGroup": "Aluminium",
      "WName": "Autodur",
      "matSort": 44,
      "matZustand": 2,
      "matVerfahren": "Kokillenguss",
      "R_m": 260,
      "R_eR_p2": 210,
      "A": "< 1",
      "roh": 2.7,
      "brinell": 100,
      "Sig_W": "80-100",
      "E-Modul": 75000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "AlZn10Si8Mg": {
      "matGroup": "Aluminium",
      "WName": "AlZn10Si8Mg",
      "matSort": 44,
      "matZustand": 2,
      "matVerfahren": "Sandguss",
      "R_m": 210,
      "R_eR_p2": 190,
      "A": 1,
      "roh": 2.7,
      "brinell": 90,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "Autodur(Fe)": {
      "matGroup": "Aluminium",
      "WName": "Autodur(Fe)",
      "matSort": 44,
      "matZustand": 2,
      "matVerfahren": "Druckguss",
      "R_m": 290,
      "R_eR_p2": 230,
      "A": "< 1",
      "roh": 2.7,
      "brinell": 100,
      "E-Modul": 75000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "Al99.7E": {
      "matGroup": "Aluminium",
      "WName": "Al99.7E",
      "matSort": 42,
      "matZustand": 0,
      "matVerfahren": "Druckguss",
      "R_m": 80,
      "R_eR_p2": 20,
      "A": 10,
      "roh": 2.7,
      "brinell": 15,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "Al99.6E": {
      "matGroup": "Aluminium",
      "WName": "Al99.6E",
      "matSort": 42,
      "matZustand": 0,
      "matVerfahren": "Druckguss",
      "R_m": 80,
      "R_eR_p2": 20,
      "A": 10,
      "roh": 2.7,
      "brinell": 15,
      "E-Modul": 70000,
      "expansion": {
        "100": 23.5
      },
      "G-Modul": 25500
    },
    "PA6E": {
      "WNr": "PA6E",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.14,
      "R_m": 80,
      "A": 70,
      "E-Modul": 3000,
      "t min": -40,
      "t max": 90,
      "S_b_W": 33,
      "S_b_S": 125,
      "mue": [
        0.38,
        0.45
      ]
    },
    "PA6flex": {
      "WNr": "PA6flex",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.12,
      "R_m": 30,
      "A": 275,
      "E-Modul": 650,
      "t min": -50,
      "t max": 80,
      "S_b_W": "-",
      "S_b_S": ""
    },
    "PA6V0": {
      "WNr": "PA6V0",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.17,
      "R_m": 80,
      "A": 10,
      "E-Modul": 3800,
      "t min": -40,
      "t max": 90,
      "S_b_W": 110,
      "S_b_S": "-"
    },
    "PA6G": {
      "WNr": "PA6G",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.14,
      "R_m": 80,
      "A": "",
      "E-Modul": 3450,
      "t min": -30,
      "t max": 100,
      "S_b_S": "",
      "mue": [
        0.36,
        0.42
      ]
    },
    "PA6GÖl": {
      "WNr": "PA6GÖl",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.14,
      "R_m": 70,
      "A": "",
      "E-Modul": 3150,
      "t min": -30,
      "t max": 100,
      "S_b_S": ""
    },
    "PA6GF25": {
      "WNr": "PA6GF25",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.32,
      "R_m": 160,
      "E-Modul": 8000,
      "t min": -40,
      "t max": 130,
      "S_b_W": 35,
      "S_b_S": 220
    },
    "PA6GF50": {
      "WNr": "PA6GF50",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.55,
      "R_m": 220,
      "E-Modul": 15000,
      "t min": -40,
      "t max": 130,
      "S_b_W": 35,
      "S_b_S": 320
    },
    "PA6M30": {
      "WNr": "PA6M30",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.36,
      "R_m": 75,
      "A": 15,
      "E-Modul": 4600,
      "t min": -40,
      "t max": 90,
      "S_b_W": "-",
      "S_b_S": 145
    },
    "PA6G210": {
      "WNr": "PA6G210",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.15,
      "R_m": 90,
      "A": 20,
      "E-Modul": 3600,
      "t min": -40,
      "t max": 90,
      "S_b_W": "-",
      "S_b_S": 140,
      "mue": [
        0.36,
        0.43
      ]
    },
    "PA6G212": {
      "WNr": "PA6G212",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.15,
      "R_m": 90,
      "E-Modul": 4000,
      "t min": -40,
      "t max": 90,
      "S_b_W": "-",
      "S_b_S": 140,
      "mue": [
        0.36,
        0.43
      ]
    },
    "PA6G210AX": {
      "WNr": "PA6G210AX",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.15,
      "R_m": 80,
      "A": 15,
      "E-Modul": 3400,
      "t min": -40,
      "t max": 90,
      "S_b_S": "",
      "mue": [
        0.25,
        0.37
      ]
    },
    "PA6GGB30": {
      "WNr": "PA6GGB30",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.38,
      "R_m": 80,
      "E-Modul": 5700,
      "t min": -40,
      "t max": 90,
      "S_b_S": 125
    },
    "PA66E": {
      "WNr": "PA66E",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.14,
      "R_m": 86,
      "A": 50,
      "E-Modul": 3100,
      "t min": -40,
      "t max": 90,
      "S_b_W": 30,
      "S_b_S": 140,
      "mue": [
        0.37,
        0.5
      ]
    },
    "PA66": {
      "WNr": "PA66",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.14,
      "R_m": 90,
      "A": 35,
      "E-Modul": 3300,
      "t min": -25,
      "t max": 100,
      "S_b_W": 30,
      "S_b_S": "",
      "mue": [
        0.35,
        0.42
      ]
    },
    "PA66H": {
      "WNr": "PA66H",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.14,
      "R_m": 80,
      "A": 25,
      "E-Modul": 3100,
      "t min": -40,
      "t max": 118,
      "S_b_W": 30,
      "S_b_S": 140,
      "mue": [
        0.37,
        0.5
      ]
    },
    "PA66GV30": {
      "WNr": "PA66GV30",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.3,
      "R_m": 100,
      "E-Modul": 5800,
      "t min": -20,
      "t max": 110,
      "S_b_S": ""
    },
    "PA66GF25": {
      "WNr": "PA66GF25",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.32,
      "R_m": 170,
      "E-Modul": 8000,
      "t min": -40,
      "t max": 130,
      "S_b_W": 39,
      "S_b_S": 220
    },
    "PA66GF50": {
      "WNr": "PA66GF50",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.55,
      "R_m": 230,
      "E-Modul": 16000,
      "t min": -40,
      "t max": 130,
      "S_b_W": 35,
      "S_b_S": 320
    },
    "PA66GF40LFT": {
      "WNr": "PA66GF40LFT",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.45,
      "R_m": 200,
      "A": 2.4,
      "E-Modul": 14000,
      "t min": -40,
      "t max": 150,
      "S_b_S": 370
    },
    "PPAGF33": {
      "WNr": "PPAGF33",
      "WName": "Polyamide",
      "matSort": 33,
      "matGroup": "Thermoplaste",
      "Dichte": 1.46,
      "R_m": 233,
      "A": 2.5,
      "E-Modul": 13100,
      "t min": -30,
      "t max": 165,
      "S_b_W": 40,
      "S_b_S": 317
    },
    "PA12E": {
      "WNr": "PA12E",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.02,
      "R_m": 47,
      "A": 280,
      "E-Modul": 1500,
      "t min": -70,
      "t max": 95,
      "S_b_S": 55,
      "mue": [
        0.32,
        0.38
      ]
    },
    "PA12GF30": {
      "WNr": "PA12GF30",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.22,
      "R_m": "-",
      "A": "-",
      "E-Modul": "-",
      "t min": -70,
      "t max": 110,
      "S_b_S": ""
    },
    "PA12G": {
      "WNr": "PA12G",
      "WName": "Polyamide",
      "matSort": 22,
      "matGroup": "Thermoplaste",
      "Dichte": 1.03,
      "R_m": 60,
      "E-Modul": 2100,
      "t min": -70,
      "t max": 90,
      "S_b_S": 90
    },
    "POM-CE": {
      "WNr": "POM-CE",
      "WName": "Polyacetale",
      "matSort": 30,
      "matGroup": "Thermoplaste",
      "Dichte": 1.39,
      "R_m": 63,
      "A": 31,
      "E-Modul": 2600,
      "t min": -50,
      "t max": 100,
      "S_b_W": 34,
      "S_b_S": "",
      "mue": [
        0.32,
        0.4
      ]
    },
    "POMAX": {
      "WNr": "POMAX",
      "WName": "Polyacetale",
      "matSort": 30,
      "matGroup": "Thermoplaste",
      "Dichte": 1.33,
      "R_m": 40,
      "A": 17,
      "E-Modul": 2100,
      "t min": -50,
      "t max": 80,
      "S_b_W": 52,
      "S_b_S": "",
      "mue": [
        0.17
      ]
    },
    "POMGF40": {
      "WNr": "POMGF40",
      "WName": "Polyacetale",
      "matSort": 30,
      "matGroup": "Thermoplaste",
      "Dichte": 1.72,
      "R_m": 140,
      "A": 2,
      "E-Modul": 13000,
      "t min": -50,
      "t max": 100,
      "S_b_S": ""
    },
    "PET": {
      "WNr": "PET",
      "WName": "Polyester",
      "matSort": 29,
      "matGroup": "Thermoplaste",
      "Dichte": 1.4,
      "R_m": 80,
      "A": 70,
      "E-Modul": 2800,
      "t min": -50,
      "t max": 100,
      "S_b_W": 31,
      "S_b_S": "",
      "mue": [
        0.25,
        0.34
      ]
    },
    "PBT": {
      "WNr": "PBT",
      "WName": "Polyester",
      "matSort": 23,
      "matGroup": "Thermoplaste",
      "Dichte": 1.3,
      "R_m": 60,
      "A": 200,
      "E-Modul": 2500,
      "t min": -50,
      "t max": 140,
      "S_b_W": 30,
      "S_b_S": 85,
      "mue": [
        0.23,
        0.35
      ]
    },
    "PBTGF30": {
      "WNr": "PBTGF30",
      "WName": "Polyester",
      "matSort": 23,
      "matGroup": "Thermoplaste",
      "Dichte": 1.53,
      "R_m": 135,
      "E-Modul": 10000,
      "t min": -50,
      "t max": 140,
      "S_b_W": 37,
      "S_b_S": 200,
      "mue": [
        0.58,
        0.65
      ]
    },
    "PBTGF50": {
      "WNr": "PBTGF50",
      "WName": "Polyester",
      "matSort": 23,
      "matGroup": "Thermoplaste",
      "Dichte": 1.73,
      "R_m": 140,
      "E-Modul": 16000,
      "t min": -50,
      "t max": 140,
      "S_b_S": ""
    },
    "PE-UHMW": {
      "WNr": "PE-UHMW",
      "WName": "Polyetylene",
      "matSort": 28,
      "matGroup": "Thermoplaste",
      "Dichte": 0.93,
      "R_m": 17,
      "A": 50,
      "E-Modul": 720,
      "t min": -200,
      "t max": 80,
      "S_b_S": "",
      "mue": [
        0.2,
        0.3
      ]
    },
    "PE-HD": {
      "WNr": "PE-HD",
      "WName": "Polyetylene",
      "matSort": 28,
      "matGroup": "Thermoplaste",
      "Dichte": 0.96,
      "R_m": 30,
      "A": 400,
      "E-Modul": 1350,
      "t min": -80,
      "t max": 90,
      "S_b_W": 5,
      "S_b_S": "",
      "mue": [
        0.2,
        0.3
      ]
    },
    "PE-LD": {
      "WNr": "PE-LD",
      "WName": "Polyetylene",
      "matSort": 28,
      "matGroup": "Thermoplaste",
      "Dichte": 0.92,
      "R_m": 9,
      "A": 400,
      "E-Modul": 200,
      "t min": -80,
      "t max": 70,
      "S_b_S": ""
    },
    "PP-H": {
      "WNr": "PP-H",
      "WName": "Polypropylene",
      "matSort": 34,
      "matGroup": "Thermoplaste",
      "Dichte": 0.9,
      "R_m": 33,
      "A": 700,
      "E-Modul": 1450,
      "t min": 0,
      "t max": 100,
      "S_b_W": 20,
      "S_b_S": "",
      "mue": [
        0.3,
        0.4
      ]
    },
    "PP-CHI": {
      "WNr": "PP-CHI",
      "WName": "Polypropylene",
      "matSort": 34,
      "matGroup": "Thermoplaste",
      "Dichte": 0.91,
      "R_m": 23,
      "A": 630,
      "E-Modul": 1100,
      "t min": -40,
      "t max": 80,
      "S_b_W": 24,
      "S_b_S": ""
    },
    "PP-GF30": {
      "WNr": "PP-GF30",
      "WName": "Polypropylene",
      "matSort": 34,
      "matGroup": "Thermoplaste",
      "Dichte": 1.12,
      "R_m": 100,
      "E-Modul": 7000,
      "t min": -30,
      "t max": 100,
      "S_b_W": 27,
      "S_b_S": 135
    },
    "PP-M40": {
      "WNr": "PP-M40",
      "WName": "Polypropylene",
      "matSort": 34,
      "matGroup": "Thermoplaste",
      "Dichte": 1.22,
      "R_m": 31,
      "A": 4,
      "E-Modul": 3800,
      "t min": 0,
      "t max": 100,
      "S_b_S": ""
    },
    "PTFE": {
      "WNr": "PTFE",
      "WName": "Fluorkunststoffe",
      "matSort": 37,
      "matGroup": "Thermoplaste",
      "Dichte": 2.16,
      "R_m": 10,
      "A": 350,
      "E-Modul": 420,
      "t min": -200,
      "t max": 260,
      "S_b_S": 14,
      "mue": [
        0.18,
        0.23
      ]
    },
    "PFA": {
      "WNr": "PFA",
      "WName": "Fluorkunststoffe",
      "matSort": 20,
      "matGroup": "Thermoplaste",
      "Dichte": 2.15,
      "R_m": 31,
      "A": 300,
      "E-Modul": 690,
      "t min": -200,
      "t max": 260,
      "S_b_S": ""
    },
    "PVDF": {
      "WNr": "PVDF",
      "WName": "Fluorkunststoffe",
      "matSort": 41,
      "matGroup": "Thermoplaste",
      "Dichte": 1.78,
      "R_m": 40,
      "A": 20,
      "E-Modul": 2500,
      "t min": -30,
      "t max": 150,
      "S_b_W": 35,
      "S_b_S": 78,
      "mue": [
        0.2,
        0.35
      ]
    },
    "PVDFGF20": {
      "WNr": "PVDFGF20",
      "WName": "Fluorkunststoffe",
      "matSort": 41,
      "matGroup": "Thermoplaste",
      "Dichte": 1.92,
      "R_m": 90,
      "E-Modul": 10000,
      "t min": -40,
      "t max": 150,
      "S_b_S": 124
    },
    "PEEK": {
      "WNr": "PEEK",
      "WName": "Teilkristalline Hochleistungskunststoffe",
      "matSort": 25,
      "matGroup": "Thermoplaste",
      "Dichte": 1.32,
      "R_m": 97,
      "A": 60,
      "E-Modul": 3600,
      "t min": -65,
      "t max": 240,
      "S_b_W": 76,
      "S_b_S": 170,
      "mue": [
        0.3,
        0.38
      ]
    },
    "PEEKGF30": {
      "WNr": "PEEKGF30",
      "WName": "Teilkristalline Hochleistungskunststoffe",
      "matSort": 25,
      "matGroup": "Thermoplaste",
      "Dichte": 1.49,
      "R_m": 156,
      "E-Modul": 10000,
      "t min": -65,
      "t max": 240,
      "S_b_W": 95,
      "S_b_S": 250
    },
    "SB": {
      "WNr": "SB",
      "WName": "Styrolpolymere",
      "matSort": 35,
      "matGroup": "Amorphe Thermoplaste",
      "Dichte": 1.05,
      "R_m": 55,
      "A": 3,
      "E-Modul": 3200,
      "t min": "-",
      "t max": 70,
      "S_b_W": 25,
      "S_b_S": 103
    },
    "ABS": {
      "WNr": "ABS",
      "WName": "Styrolpolymere",
      "matSort": 2,
      "matGroup": "Amorphe Thermoplaste",
      "Dichte": 1.04,
      "R_m": 45,
      "A": 10,
      "E-Modul": 2300,
      "t min": -30,
      "t max": 95,
      "S_b_S": 75,
      "mue": [
        0.81
      ]
    },
    "ABSGF17": {
      "WNr": "ABSGF17",
      "WName": "Styrolpolymere",
      "matSort": 2,
      "matGroup": "Amorphe Thermoplaste",
      "Dichte": 1.15,
      "R_m": 80,
      "A": 2,
      "E-Modul": 5500,
      "t min": -40,
      "t max": 85,
      "S_b_S": 115
    },
    "SAN": {
      "WNr": "SAN",
      "WName": "Styrolpolymere",
      "matSort": 46,
      "matGroup": "Amorphe Thermoplaste",
      "Dichte": 1.08,
      "R_m": 79,
      "A": 3,
      "E-Modul": 3800,
      "t min": "-",
      "t max": 85,
      "S_b_W": 25,
      "S_b_S": 140,
      "mue": [
        0.6
      ]
    },
    "ASA": {
      "WNr": "ASA",
      "WName": "Styrolpolymere",
      "matSort": 3,
      "matGroup": "Amorphe Thermoplaste",
      "Dichte": 1.07,
      "R_m": 35,
      "A": 8,
      "E-Modul": 2600,
      "t min": -20,
      "t max": 90,
      "S_b_W": 15,
      "S_b_S": 80
    },
    "PPO": {
      "WNr": "PPO",
      "WName": "Polymer-Blends",
      "matSort": 31,
      "matGroup": "Amorphe Thermoplaste",
      "Dichte": 1.06,
      "R_m": 50,
      "A": 30,
      "E-Modul": 2300,
      "t min": -50,
      "t max": 105,
      "S_b_W": 12,
      "S_b_S": 75,
      "mue": [
        0.35
      ]
    },
    "PPOGF20": {
      "WNr": "PPOGF20",
      "WName": "Polymer-Blends",
      "matSort": 31,
      "matGroup": "Amorphe Thermoplaste",
      "Dichte": 1.25,
      "R_m": 80,
      "E-Modul": 6000,
      "t min": -50,
      "t max": 110,
      "S_b_S": 120
    },
    "PC+ABS": {
      "WNr": "PC+ABS",
      "WName": "Polymer-Blends",
      "matSort": 24,
      "matGroup": "Amorphe Thermoplaste",
      "Dichte": 1.13,
      "R_m": 52,
      "A": 50,
      "E-Modul": 2200,
      "t min": -50,
      "t max": 90,
      "S_b_S": 80
    },
    "PC": {
      "WNr": "PC",
      "WName": "Polyester",
      "matSort": 24,
      "matGroup": "Amorphe Thermoplaste",
      "Dichte": 1.2,
      "R_m": 66,
      "A": 80,
      "E-Modul": 2400,
      "t min": -100,
      "t max": 125,
      "S_b_S": 70
    },
    "PCGF30": {
      "WNr": "PCGF30",
      "WName": "Polyester",
      "matSort": 24,
      "matGroup": "Amorphe Thermoplaste",
      "Dichte": 1.42,
      "R_m": 55,
      "A": 4,
      "E-Modul": 5000,
      "t min": -100,
      "t max": 125,
      "S_b_S": 130
    },
    "PSU": {
      "WNr": "PSU",
      "WName": "Schwefelpolymere",
      "matSort": 36,
      "matGroup": "Amorphe Thermoplaste",
      "Dichte": 1.24,
      "R_m": 70,
      "A": 50,
      "E-Modul": 2480,
      "t min": -100,
      "t max": 160,
      "S_b_W": 8,
      "S_b_S": 106,
      "mue": [
        0.6
      ]
    },
    "PSUGF30": {
      "WNr": "PSUGF30",
      "WName": "Schwefelpolymere",
      "matSort": 36,
      "matGroup": "Amorphe Thermoplaste",
      "Dichte": 1.49,
      "R_m": 108,
      "A": 2,
      "E-Modul": 7380,
      "t min": -100,
      "t max": 160,
      "S_b_S": 155,
      "mue": [
        0.46
      ]
    },
    "PES": {
      "WNr": "PES",
      "WName": "Schwefelpolymere",
      "matSort": 27,
      "matGroup": "Amorphe Thermoplaste",
      "Dichte": 1.37,
      "R_m": 90,
      "A": 15,
      "E-Modul": 2800,
      "t min": -100,
      "t max": 190,
      "S_b_W": 18,
      "S_b_S": "",
      "mue": [
        0.62
      ]
    },
    "PESGF30": {
      "WNr": "PESGF30",
      "WName": "Schwefelpolymere",
      "matSort": 27,
      "matGroup": "Amorphe Thermoplaste",
      "Dichte": 1.6,
      "R_m": 140,
      "E-Modul": 10200,
      "t min": -100,
      "t max": 190,
      "S_b_S": 195,
      "mue": [
        0.54
      ]
    },
    "PPSU": {
      "WNr": "PPSU",
      "WName": "Schwefelpolymere",
      "matSort": 32,
      "matGroup": "Amorphe Thermoplaste",
      "Dichte": 1.29,
      "R_m": 70,
      "A": 60,
      "E-Modul": 2340,
      "t min": -100,
      "t max": 160,
      "S_b_S": 91
    },
    "PEI": {
      "WNr": "PEI",
      "WName": "Polyimide",
      "matSort": 26,
      "matGroup": "Amorphe Thermoplaste",
      "Dichte": 1.27,
      "R_m": 85,
      "A": 60,
      "E-Modul": 3200,
      "t min": -100,
      "t max": 170,
      "S_b_S": 160
    },
    "PEIGF30": {
      "WNr": "PEIGF30",
      "WName": "Polyimide",
      "matSort": 26,
      "matGroup": "Amorphe Thermoplaste",
      "Dichte": 1.51,
      "R_m": 165,
      "A": 2,
      "E-Modul": 9500,
      "t min": -100,
      "t max": 180,
      "S_b_W": 31,
      "S_b_S": 225
    },
    "PF31": {
      "WNr": "PF31",
      "WName": "Formmassen",
      "matSort": 21,
      "matGroup": "Duroplaste",
      "Dichte": 1.42,
      "R_m": 50,
      "A": 0.9,
      "E-Modul": 7500,
      "t min": "-",
      "t max": 150,
      "S_b_W": 28,
      "S_b_S": 95
    },
    "PF51": {
      "WNr": "PF51",
      "WName": "Formmassen",
      "matSort": 21,
      "matGroup": "Duroplaste",
      "Dichte": 1.41,
      "R_m": 60,
      "A": 0.8,
      "E-Modul": 8000,
      "t min": "-",
      "t max": 130,
      "S_b_S": 85
    },
    "MP183": {
      "WNr": "MP183",
      "WName": "Formmassen",
      "matSort": 17,
      "matGroup": "Duroplaste",
      "Dichte": 1.65,
      "R_m": 60,
      "A": 0.7,
      "E-Modul": 10000,
      "t min": "-",
      "t max": 150,
      "S_b_S": 120
    },
    "PURIHS22k": {
      "WNr": "PURIHS22k",
      "WName": "Polyurethane",
      "matSort": 39,
      "matGroup": "Duroplaste",
      "Dichte": 0.6,
      "R_m": 21,
      "A": 7,
      "E-Modul": 950,
      "t min": -40,
      "t max": 70,
      "S_b_W": 8,
      "S_b_S": 38
    },
    "PURIHS51K": {
      "WNr": "PURIHS51K",
      "WName": "Polyurethane",
      "matSort": 39,
      "matGroup": "Duroplaste",
      "Dichte": 0.6,
      "R_m": 14,
      "A": 10,
      "E-Modul": 800,
      "t min": -40,
      "t max": 60,
      "S_b_S": 33
    },
    "PURGS": {
      "WNr": "PURGS",
      "WName": "Polyurethane",
      "matSort": 38,
      "matGroup": "Duroplaste",
      "Dichte": 1.17,
      "R_m": 45,
      "A": 23,
      "E-Modul": 1300,
      "t min": -40,
      "t max": 80,
      "S_b_S": 72
    },
    "PUR5217": {
      "WNr": "PUR5217",
      "WName": "Polyurethane",
      "matSort": 40,
      "matGroup": "Duroplaste",
      "Dichte": 1.2,
      "R_m": 37,
      "A": 13,
      "E-Modul": 1250,
      "t min": -40,
      "t max": 80,
      "S_b_S": 55
    },
    "NBR": {
      "WNr": "NBR",
      "matSort": 18,
      "matGroup": "Elastomere",
      "Dichte": 0.93,
      "R_m": 22,
      "A": "",
      "E-Modul": "",
      "t max": 70,
      "S_b_S": ""
    },
    "SBR": {
      "WNr": "SBR",
      "matSort": 45,
      "matGroup": "Elastomere",
      "Dichte": 0.94,
      "R_m": 5,
      "A": "",
      "E-Modul": "",
      "t max": 80,
      "S_b_S": ""
    },
    "IIR": {
      "WNr": "IIR",
      "matSort": 9,
      "matGroup": "Elastomere",
      "Dichte": 0.93,
      "R_m": 5,
      "A": "",
      "E-Modul": "",
      "t max": 120,
      "S_b_S": ""
    },
    "CR": {
      "WNr": "CR",
      "matSort": 10,
      "matGroup": "Elastomere",
      "Dichte": 1.25,
      "R_m": 11,
      "A": "",
      "E-Modul": "",
      "t max": 110,
      "S_b_S": ""
    },
    "PUR": {
      "WNr": "PUR",
      "matSort": 49,
      "matGroup": "Elastomere",
      "Dichte": 1.25,
      "R_m": 20,
      "A": "",
      "E-Modul": "",
      "t max": 100,
      "S_b_S": ""
    }
  }
};

const Data_Kounselor = [{
  "RAL": "1000",
  "RGB": [190, 189, 127],
  "Name": "Grünbeige"
}, {
  "RAL": "1001",
  "RGB": [194, 176, 120],
  "Name": "Beige"
}, {
  "RAL": "1002",
  "RGB": [198, 166, 100],
  "Name": "Sandgelb"
}, {
  "RAL": "1003",
  "RGB": [229, 190, 1],
  "Name": "Signalgelb"
}, {
  "RAL": "1004",
  "RGB": [205, 164, 42],
  "Name": "Goldgelb"
}, {
  "RAL": "1005",
  "RGB": [169, 131, 7],
  "Name": "Honiggelb"
}, {
  "RAL": "1006",
  "RGB": [228, 160, 14],
  "Name": "Maisgelb"
}, {
  "RAL": "1007",
  "RGB": [220, 156, 0],
  "Name": "Narzissengelb"
}, {
  "RAL": "1011",
  "RGB": [138, 102, 54],
  "Name": "Braunbeige"
}, {
  "RAL": "1012",
  "RGB": [199, 180, 56],
  "Name": "Zitronengelb"
}, {
  "RAL": "1013",
  "RGB": [234, 230, 202],
  "Name": "Perlweiß"
}, {
  "RAL": "1014",
  "RGB": [225, 204, 79],
  "Name": "Elfenbein"
}, {
  "RAL": "1015",
  "RGB": [230, 214, 144],
  "Name": "Hellelfenbein"
}, {
  "RAL": "1016",
  "RGB": [237, 255, 27],
  "Name": "Schwefelgelb"
}, {
  "RAL": "1017",
  "RGB": [245, 208, 41],
  "Name": "Safrangelb"
}, {
  "RAL": "1018",
  "RGB": [248, 243, 43],
  "Name": "Zinkgelb"
}, {
  "RAL": "1019",
  "RGB": [158, 151, 100],
  "Name": "Graubeige"
}, {
  "RAL": "1020",
  "RGB": [153, 153, 80],
  "Name": "Olivgelb"
}, {
  "RAL": "1021",
  "RGB": [243, 218, 9],
  "Name": "Rapsgelb"
}, {
  "RAL": "1023",
  "RGB": [250, 210, 1],
  "Name": "Verkehrsgelb"
}, {
  "RAL": "1024",
  "RGB": [174, 160, 61],
  "Name": "Ockergelb"
}, {
  "RAL": "1026",
  "RGB": [255, 255, 0],
  "Name": "Leuchtgelb"
}, {
  "RAL": "1027",
  "RGB": [157, 145, 1],
  "Name": "Currygelb"
}, {
  "RAL": "1028",
  "RGB": [244, 169, 0],
  "Name": "Melonengelb"
}, {
  "RAL": "1032",
  "RGB": [214, 174, 1],
  "Name": "Ginstergelb"
}, {
  "RAL": "1033",
  "RGB": [243, 165, 5],
  "Name": "Dahliengelb"
}, {
  "RAL": "1034",
  "RGB": [239, 169, 60],
  "Name": "Pastellgelb"
}, {
  "RAL": "1035",
  "RGB": [106, 93, 63],
  "Name": "Perlbeige"
}, {
  "RAL": "1036",
  "RGB": [112, 83, 43],
  "Name": "Perlgold"
}, {
  "RAL": "1037",
  "RGB": [243, 159, 20],
  "Name": "Sonnengelb"
}, {
  "RAL": "2000",
  "RGB": [237, 118, 12],
  "Name": "Gelborange"
}, {
  "RAL": "2001",
  "RGB": [201, 48, 26],
  "Name": "Rotorange"
}, {
  "RAL": "2002",
  "RGB": [203, 32, 27],
  "Name": "Blutorange"
}, {
  "RAL": "2003",
  "RGB": [255, 117, 16],
  "Name": "Pastellorange"
}, {
  "RAL": "2004",
  "RGB": [244, 56, 15],
  "Name": "Reinorange"
}, {
  "RAL": "2005",
  "RGB": [255, 29, 1],
  "Name": "Leuchtorange"
}, {
  "RAL": "2007",
  "RGB": [255, 164, 26],
  "Name": "Leuchthellorange"
}, {
  "RAL": "2008",
  "RGB": [247, 94, 31],
  "Name": "Hellrotorange"
}, {
  "RAL": "2009",
  "RGB": [245, 52, 27],
  "Name": "Verkehrsorange"
}, {
  "RAL": "2010",
  "RGB": [216, 61, 26],
  "Name": "Signalorange"
}, {
  "RAL": "2011",
  "RGB": [236, 124, 38],
  "Name": "Tieforange"
}, {
  "RAL": "2012",
  "RGB": [235, 106, 12],
  "Name": "Lachsorange"
}, {
  "RAL": "2013",
  "RGB": [195, 88, 49],
  "Name": "Perlorange"
}, {
  "RAL": "3000",
  "RGB": [175, 35, 24],
  "Name": "Feuerrot"
}, {
  "RAL": "3001",
  "RGB": [165, 26, 21],
  "Name": "Signalrot"
}, {
  "RAL": "3002",
  "RGB": [162, 29, 29],
  "Name": "Karminrot"
}, {
  "RAL": "3003",
  "RGB": [155, 15, 24],
  "Name": "Rubinrot"
}, {
  "RAL": "3004",
  "RGB": [117, 17, 24],
  "Name": "Purpurrot"
}, {
  "RAL": "3005",
  "RGB": [94, 27, 33],
  "Name": "Weinrot"
}, {
  "RAL": "3007",
  "RGB": [53, 28, 39],
  "Name": "Schwarzrot"
}, {
  "RAL": "3009",
  "RGB": [100, 30, 30],
  "Name": "Oxidrot"
}, {
  "RAL": "3011",
  "RGB": [120, 25, 21],
  "Name": "Braunrot"
}, {
  "RAL": "3012",
  "RGB": [193, 135, 107],
  "Name": "Beigerot"
}, {
  "RAL": "3013",
  "RGB": [161, 29, 18],
  "Name": "Tomatenrot"
}, {
  "RAL": "3014",
  "RGB": [211, 110, 112],
  "Name": "Altrosa"
}, {
  "RAL": "3015",
  "RGB": [234, 137, 154],
  "Name": "Hellrosa"
}, {
  "RAL": "3016",
  "RGB": [179, 32, 27],
  "Name": "Korallenrot"
}, {
  "RAL": "3017",
  "RGB": [230, 40, 68],
  "Name": "Rosé"
}, {
  "RAL": "3018",
  "RGB": [213, 48, 40],
  "Name": "Erdbeerrot"
}, {
  "RAL": "3020",
  "RGB": [204, 6, 5],
  "Name": "Verkehrsrot"
}, {
  "RAL": "3022",
  "RGB": [217, 80, 48],
  "Name": "Lachsrot"
}, {
  "RAL": "3024",
  "RGB": [248, 0, 0],
  "Name": "Leuchtrot"
}, {
  "RAL": "3026",
  "RGB": [254, 0, 0],
  "Name": "Leuchthellrot"
}, {
  "RAL": "3027",
  "RGB": [197, 29, 42],
  "Name": "Himbeerrot"
}, {
  "RAL": "3028",
  "RGB": [203, 40, 42],
  "Name": "Reinrot"
}, {
  "RAL": "3031",
  "RGB": [179, 30, 32],
  "Name": "Orientrot"
}, {
  "RAL": "3032",
  "RGB": [114, 16, 28],
  "Name": "Perlrubinrot"
}, {
  "RAL": "3033",
  "RGB": [180, 62, 55],
  "Name": "Perlrosa"
}, {
  "RAL": "4001",
  "RGB": [109, 51, 91],
  "Name": "Rotlila"
}, {
  "RAL": "4002",
  "RGB": [146, 35, 50],
  "Name": "Rotviolett"
}, {
  "RAL": "4003",
  "RGB": [222, 62, 138],
  "Name": "Erikaviolett"
}, {
  "RAL": "4004",
  "RGB": [110, 28, 42],
  "Name": "Bordeauxviolett"
}, {
  "RAL": "4005",
  "RGB": [108, 56, 117],
  "Name": "Blaulila"
}, {
  "RAL": "4006",
  "RGB": [160, 42, 114],
  "Name": "Verkehrspurpur"
}, {
  "RAL": "4007",
  "RGB": [60, 21, 36],
  "Name": "Purpurviolett"
}, {
  "RAL": "4008",
  "RGB": [144, 56, 132],
  "Name": "Signalviolett"
}, {
  "RAL": "4009",
  "RGB": [164, 125, 144],
  "Name": "Pastellviolett"
}, {
  "RAL": "4010",
  "RGB": [215, 37, 109],
  "Name": "Telemagenta"
}, {
  "RAL": "4011",
  "RGB": [134, 115, 161],
  "Name": "Perlviolett"
}, {
  "RAL": "4012",
  "RGB": [108, 104, 129],
  "Name": "Perlbrombeer"
}, {
  "RAL": "5000",
  "RGB": [34, 38, 61],
  "Name": "Violettblau"
}, {
  "RAL": "5001",
  "RGB": [25, 42, 46],
  "Name": "Grünblau"
}, {
  "RAL": "5002",
  "RGB": [26, 27, 79],
  "Name": "Ultramarinblau"
}, {
  "RAL": "5003",
  "RGB": [29, 24, 41],
  "Name": "Saphirblau"
}, {
  "RAL": "5004",
  "RGB": [20, 19, 28],
  "Name": "Schwarzblau"
}, {
  "RAL": "5005",
  "RGB": [24, 37, 110],
  "Name": "Signalblau"
}, {
  "RAL": "5007",
  "RGB": [50, 95, 138],
  "Name": "Brillantblau"
}, {
  "RAL": "5008",
  "RGB": [38, 31, 37],
  "Name": "Graublau"
}, {
  "RAL": "5009",
  "RGB": [2, 86, 105],
  "Name": "Azurblau"
}, {
  "RAL": "5010",
  "RGB": [12, 33, 61],
  "Name": "Enzianblau"
}, {
  "RAL": "5011",
  "RGB": [29, 22, 30],
  "Name": "Stahlblau"
}, {
  "RAL": "5012",
  "RGB": [59, 131, 189],
  "Name": "Lichtblau"
}, {
  "RAL": "5013",
  "RGB": [31, 33, 60],
  "Name": "Kobaltblau"
}, {
  "RAL": "5014",
  "RGB": [96, 111, 140],
  "Name": "Taubenblau"
}, {
  "RAL": "5015",
  "RGB": [28, 113, 179],
  "Name": "Himmelblau"
}, {
  "RAL": "5017",
  "RGB": [6, 47, 113],
  "Name": "Verkehrsblau"
}, {
  "RAL": "5018",
  "RGB": [51, 136, 143],
  "Name": "Türkisblau"
}, {
  "RAL": "5019",
  "RGB": [23, 85, 131],
  "Name": "Capriblau"
}, {
  "RAL": "5020",
  "RGB": [29, 41, 60],
  "Name": "Ozeanblau"
}, {
  "RAL": "5021",
  "RGB": [31, 109, 123],
  "Name": "Wasserblau"
}, {
  "RAL": "5022",
  "RGB": [31, 32, 80],
  "Name": "Nachtblau"
}, {
  "RAL": "5023",
  "RGB": [59, 103, 141],
  "Name": "Fernblau"
}, {
  "RAL": "5024",
  "RGB": [93, 155, 155],
  "Name": "Pastellblau"
}, {
  "RAL": "5025",
  "RGB": [34, 100, 120],
  "Name": "Perlenzian"
}, {
  "RAL": "5026",
  "RGB": [14, 36, 84],
  "Name": "Perlnachtblau"
}, {
  "RAL": "6000",
  "RGB": [49, 102, 80],
  "Name": "Patinagrün"
}, {
  "RAL": "6001",
  "RGB": [32, 114, 41],
  "Name": "Smaragdgrün"
}, {
  "RAL": "6002",
  "RGB": [37, 87, 36],
  "Name": "Laubgrün"
}, {
  "RAL": "6003",
  "RGB": [54, 56, 40],
  "Name": "Olivgrün"
}, {
  "RAL": "6004",
  "RGB": [25, 58, 49],
  "Name": "Blaugrün"
}, {
  "RAL": "6005",
  "RGB": [39, 69, 46],
  "Name": "Moosgrün"
}, {
  "RAL": "6006",
  "RGB": [50, 59, 40],
  "Name": "Grauoliv"
}, {
  "RAL": "6007",
  "RGB": [42, 59, 33],
  "Name": "Flaschengrün"
}, {
  "RAL": "6008",
  "RGB": [47, 43, 34],
  "Name": "Braungrün"
}, {
  "RAL": "6009",
  "RGB": [49, 45, 35],
  "Name": "Tannengrün"
}, {
  "RAL": "6010",
  "RGB": [43, 104, 37],
  "Name": "Grasgrün"
}, {
  "RAL": "6011",
  "RGB": [88, 114, 56],
  "Name": "Resedagrün"
}, {
  "RAL": "6012",
  "RGB": [42, 50, 52],
  "Name": "Schwarzgrün"
}, {
  "RAL": "6013",
  "RGB": [108, 113, 86],
  "Name": "Schilfgrün"
}, {
  "RAL": "6014",
  "RGB": [57, 52, 38],
  "Name": "Gelboliv"
}, {
  "RAL": "6015",
  "RGB": [59, 48, 44],
  "Name": "Schwarzoliv"
}, {
  "RAL": "6016",
  "RGB": [24, 89, 69],
  "Name": "Türkisgrün"
}, {
  "RAL": "6017",
  "RGB": [62, 145, 53],
  "Name": "Maigrün"
}, {
  "RAL": "6018",
  "RGB": [87, 166, 47],
  "Name": "Gelbgrün"
}, {
  "RAL": "6019",
  "RGB": [189, 236, 182],
  "Name": "Weißgrün"
}, {
  "RAL": "6020",
  "RGB": [38, 58, 29],
  "Name": "Chromoxidgrün"
}, {
  "RAL": "6021",
  "RGB": [137, 172, 118],
  "Name": "Blassgrün"
}, {
  "RAL": "6022",
  "RGB": [31, 28, 23],
  "Name": "Braunoliv"
}, {
  "RAL": "6024",
  "RGB": [48, 132, 56],
  "Name": "Verkehrsgrün"
}, {
  "RAL": "6025",
  "RGB": [49, 100, 37],
  "Name": "Farngrün"
}, {
  "RAL": "6026",
  "RGB": [1, 93, 82],
  "Name": "Opalgrün"
}, {
  "RAL": "6027",
  "RGB": [132, 195, 190],
  "Name": "Lichtgrün"
}, {
  "RAL": "6028",
  "RGB": [36, 85, 69],
  "Name": "Kieferngrün"
}, {
  "RAL": "6029",
  "RGB": [26, 96, 49],
  "Name": "Minzgrün"
}, {
  "RAL": "6032",
  "RGB": [49, 127, 55],
  "Name": "Signalgrün"
}, {
  "RAL": "6033",
  "RGB": [59, 126, 118],
  "Name": "Minttürkis"
}, {
  "RAL": "6034",
  "RGB": [127, 181, 181],
  "Name": "Pastelltürkis"
}, {
  "RAL": "6035",
  "RGB": [28, 84, 37],
  "Name": "Perlgrün"
}, {
  "RAL": "6036",
  "RGB": [18, 43, 45],
  "Name": "Perlopalgrün"
}, {
  "RAL": "6037",
  "RGB": [0, 143, 47],
  "Name": "Reingrün"
}, {
  "RAL": "6038",
  "RGB": [0, 187, 37],
  "Name": "Leuchtgrün"
}, {
  "RAL": "7000",
  "RGB": [120, 133, 139],
  "Name": "Fehgrau"
}, {
  "RAL": "7001",
  "RGB": [138, 149, 151],
  "Name": "Silbergrau"
}, {
  "RAL": "7002",
  "RGB": [126, 123, 82],
  "Name": "Olivgrau"
}, {
  "RAL": "7003",
  "RGB": [108, 112, 89],
  "Name": "Moosgrau"
}, {
  "RAL": "7004",
  "RGB": [150, 153, 146],
  "Name": "Signalgrau"
}, {
  "RAL": "7005",
  "RGB": [100, 107, 99],
  "Name": "Mausgrau"
}, {
  "RAL": "7006",
  "RGB": [109, 101, 82],
  "Name": "Beigegrau"
}, {
  "RAL": "7008",
  "RGB": [106, 95, 49],
  "Name": "Khakigrau"
}, {
  "RAL": "7009",
  "RGB": [63, 86, 69],
  "Name": "Grüngrau"
}, {
  "RAL": "7010",
  "RGB": [62, 81, 60],
  "Name": "Zeltgrau"
}, {
  "RAL": "7011",
  "RGB": [55, 61, 63],
  "Name": "Eisengrau"
}, {
  "RAL": "7012",
  "RGB": [78, 87, 84],
  "Name": "Basaltgrau"
}, {
  "RAL": "7013",
  "RGB": [56, 69, 49],
  "Name": "Braungrau"
}, {
  "RAL": "7015",
  "RGB": [55, 57, 80],
  "Name": "Schiefergrau"
}, {
  "RAL": "7016",
  "RGB": [33, 49, 41],
  "Name": "Anthrazitgrau"
}, {
  "RAL": "7021",
  "RGB": [29, 32, 35],
  "Name": "Schwarzgrau"
}, {
  "RAL": "7022",
  "RGB": [41, 39, 36],
  "Name": "Umbragrau"
}, {
  "RAL": "7023",
  "RGB": [104, 108, 94],
  "Name": "Betongrau"
}, {
  "RAL": "7024",
  "RGB": [57, 60, 81],
  "Name": "Graphitgrau"
}, {
  "RAL": "7026",
  "RGB": [39, 43, 59],
  "Name": "Granitgrau"
}, {
  "RAL": "7030",
  "RGB": [139, 140, 122],
  "Name": "Steingrau"
}, {
  "RAL": "7031",
  "RGB": [57, 61, 78],
  "Name": "Blaugrau"
}, {
  "RAL": "7032",
  "RGB": [184, 183, 153],
  "Name": "Kieselgrau"
}, {
  "RAL": "7033",
  "RGB": [125, 132, 113],
  "Name": "Zementgrau"
}, {
  "RAL": "7034",
  "RGB": [143, 139, 102],
  "Name": "Gelbgrau"
}, {
  "RAL": "7035",
  "RGB": [203, 208, 204],
  "Name": "Lichtgrau"
}, {
  "RAL": "7036",
  "RGB": [127, 118, 121],
  "Name": "Platingrau"
}, {
  "RAL": "7037",
  "RGB": [125, 127, 120],
  "Name": "Staubgrau"
}, {
  "RAL": "7038",
  "RGB": [195, 195, 195],
  "Name": "Achatgrau"
}, {
  "RAL": "7039",
  "RGB": [108, 105, 96],
  "Name": "Quarzgrau"
}, {
  "RAL": "7040",
  "RGB": [157, 161, 170],
  "Name": "Fenstergrau"
}, {
  "RAL": "7042",
  "RGB": [141, 148, 141],
  "Name": "Verkehrsgrau A"
}, {
  "RAL": "7043",
  "RGB": [78, 84, 82],
  "Name": "Verkehrsgrau B"
}, {
  "RAL": "7044",
  "RGB": [202, 196, 176],
  "Name": "Seidengrau"
}, {
  "RAL": "7045",
  "RGB": [144, 144, 144],
  "Name": "Telegrau 1"
}, {
  "RAL": "7046",
  "RGB": [130, 137, 143],
  "Name": "Telegrau 2"
}, {
  "RAL": "7047",
  "RGB": [208, 208, 208],
  "Name": "Telegrau 4"
}, {
  "RAL": "7048",
  "RGB": [137, 129, 118],
  "Name": "Perlmausgrau"
}, {
  "RAL": "8000",
  "RGB": [130, 108, 42],
  "Name": "Grünbraun"
}, {
  "RAL": "8001",
  "RGB": [149, 95, 26],
  "Name": "Ockerbraun"
}, {
  "RAL": "8002",
  "RGB": [108, 59, 34],
  "Name": "Signalbraun"
}, {
  "RAL": "8003",
  "RGB": [115, 54, 28],
  "Name": "Lehmbraun"
}, {
  "RAL": "8004",
  "RGB": [142, 52, 34],
  "Name": "Kupferbraun"
}, {
  "RAL": "8007",
  "RGB": [89, 43, 25],
  "Name": "Rehbraun"
}, {
  "RAL": "8008",
  "RGB": [111, 79, 32],
  "Name": "Olivbraun"
}, {
  "RAL": "8011",
  "RGB": [91, 58, 33],
  "Name": "Nussbraun"
}, {
  "RAL": "8012",
  "RGB": [89, 29, 27],
  "Name": "Rotbraun"
}, {
  "RAL": "8014",
  "RGB": [46, 36, 24],
  "Name": "Sepiabraun"
}, {
  "RAL": "8015",
  "RGB": [99, 58, 42],
  "Name": "Kastanienbraun"
}, {
  "RAL": "8016",
  "RGB": [62, 39, 39],
  "Name": "Mahagonibraun"
}, {
  "RAL": "8017",
  "RGB": [69, 40, 38],
  "Name": "Schokoladenbraun"
}, {
  "RAL": "8019",
  "RGB": [52, 58, 58],
  "Name": "Graubraun"
}, {
  "RAL": "8022",
  "RGB": [27, 27, 27],
  "Name": "Schwarzbraun"
}, {
  "RAL": "8023",
  "RGB": [166, 94, 38],
  "Name": "Orangebraun"
}, {
  "RAL": "8024",
  "RGB": [121, 85, 49],
  "Name": "Beigebraun"
}, {
  "RAL": "8025",
  "RGB": [117, 92, 58],
  "Name": "Blassbraun"
}, {
  "RAL": "8028",
  "RGB": [78, 59, 49],
  "Name": "Terrabraun"
}, {
  "RAL": "8029",
  "RGB": [118, 48, 32],
  "Name": "Perlkupfer"
}, {
  "RAL": "9001",
  "RGB": [250, 244, 227],
  "Name": "Cremeweiß"
}, {
  "RAL": "9002",
  "RGB": [231, 235, 218],
  "Name": "Grauweiß"
}, {
  "RAL": "9003",
  "RGB": [244, 244, 244],
  "Name": "Signalweiß"
}, {
  "RAL": "9004",
  "RGB": [32, 32, 32],
  "Name": "Signalschwarz"
}, {
  "RAL": "9005",
  "RGB": [8, 8, 11],
  "Name": "Tiefschwarz"
}, {
  "RAL": "9006",
  "RGB": [165, 165, 165],
  "Name": "Weißaluminium"
}, {
  "RAL": "9007",
  "RGB": [143, 143, 143],
  "Name": "Graualuminium"
}, {
  "RAL": "9010",
  "RGB": [255, 255, 255],
  "Name": "Reinweiß"
}, {
  "RAL": "9011",
  "RGB": [28, 28, 2],
  "Name": "Graphitschwarz"
}, {
  "RAL": "9016",
  "RGB": [246, 246, 246],
  "Name": "Verkehrsweiß"
}, {
  "RAL": "9017",
  "RGB": [24, 24, 24],
  "Name": "Verkehrsschwarz"
}, {
  "RAL": "9018",
  "RGB": [207, 211, 205],
  "Name": "Papyrusweiß"
}, {
  "RAL": "9022",
  "RGB": [156, 156, 156],
  "Name": "Perlhellgrau"
}, {
  "RAL": "9023",
  "RGB": [130, 130, 130],
  "Name": "Perldunkelgrau"
}];

const Data_Names = {
  female: ["Annika",
    "Brunhilde",
    "Chiara",
    "Dora",
    "Emma",
    "Frida",
    "Gemma",
    "Hannah",
    "Ida",
    "Janine",
    "Karolin",
    "Lina",
    "Martha",
    "Nora",
    "Olga",
    "Patrizia",
    "Quirin",
    "Rebekka",
    "Svenja",
    "Tabea",
    "Ulrike",
    "Valentine",
    "Wiebke",
    "Xenia",
    "Yvette",
    "Zora"
  ],
  male: [
    "Arne",
    "Bernd",
    "Carl",
    "Damian",
    "Ernst",
    "Friedrich",
    "Gustav",
    "Hans",
    "Ingolf",
    "Jens",
    "Kurt",
    "Lars",
    "Murat",
    "Norbert",
    "Olaf",
    "Paul",
    "Quentin",
    "Robert",
    "Sebastian",
    "Thorsten",
    "Ulf",
    "Volker",
    "Walther",
    "Xaver",
    "Yves",
    "Zoltan"
  ],
  genders: [
    "agender", "androgyn", "bigender", "Burrnesha", "cisgenderfluid", "demigender", "Enbie", "Femme", "Frau", "girlfag", "guydyke", "Herr", "ilyagender", "maverique", "neurogender", "neutrois", "nibi", "pangender", "sonstig", "spiegelgender", "trans", "transfeminin", "transmaskulin", "xenogender"
  ],
  get all() {
    return [...Data_Names.female, ...Data_Names.male].sort();
  }
};

const Data_AkademischerGrad = {
  data: {
    "Bachelorgrad": {
      "B.A.": "Bachelor of Arts",
      "BBA": "Bachelor of Business Administration",
      "B.Sc.": "Bachelor of Science",
      "LL.B.": "Bachelor of Laws",
      "B.Ed.": "Bachelor of Education",
      "B.Eng.": "Bachelor of Engineering",
      "B.F.A.": "Bachelor of Fine Arts",
      "B.Mus.": "Bachelor of Music",
      "B.M.A.": "Bachelor of Musical Arts"
    },
    "Mastergrade konsekutiv": {
      "M.A.": "Master of Arts",
      "M.Sc.": "Master of Science",
      "M.Eng.": "Master of Engineering",
      "LL.M.": "Master of Laws",
      "M.F.A.": "Master of Fine Arts",
      "M.Mus.": "Master of Music",
      "M.Ed.": "Master of Education"
    },
    "Mastergrade nicht konsekutiv": {
      "M.Ac.": "Master of Acoustics",
      "MBA": "Master of Business Administration ",
      "MBA Eng.": "Master of Business Administration and Engineering ",
      "M.Edu": "Master of Adult Education",
      "MAS": "Master of Advanced Studies in Applied Ethics",
      "M.Arch.": "Master of Architecture",
      "M.AVIMA": "Master of Aviation Management ",
      "M.BP.": "Master of Building Physics ",
      "MBE": "Master of Business Engineering ",
      "MBC": "International Master of Business Consulting",
      "MBI": "International Master of Business Informatics",
      "M.B.L.": "Master of Business Law",
      "LL.M.oec.": "Master Wirtschaftsrecht/Business Law and Economic Law",
      "MScBL": "Master of Science in Business and Law",
      "MBM": "Master of Business Marketing ",
      "MBR": "Master of Business Research ",
      "MBS": "Master of Business Systems ",
      "M.C.L.": "Master of Comparative Law ",
      "M.Comp.Sc.": "Master of Computer Science ",
      "Master of Criminology and Police Science": "-",
      "MCA": "Master of Customs Administration ",
      "Master of Economics": "Master of Economics",
      "Master of Economics and Business": "-",
      "MDM": "Master in Disaster Management and Risk Governance ",
      "M.D.R.A.": "Master of Drug Regulatory Affairs",
      "Master of Engineering in Traffic Accident Research": "-",
      "M.E.S": "Master of European Studies ",
      "M.Eval.": "Master of Evaluation",
      "MIM": "Master in Information Management ",
      "MHA": "Master of Health Administration ",
      "MHMM": "Master in Health and Medical Management",
      "MHBA": "Master of Health Business Administration",
      "MaHM": "Master of Hospital Management ",
      "MaHE": "Master of Health Economics ",
      "MoHE": "Master of Higher Education ",
      "M.I.Tax": "Master of International Taxation ",
      "MALIS": "Master of Arts Library and Information Science",
      "Library and Information Science": "Master of Arts ",
      "MM": "Master of Mediation ",
      "M.mel.": "Master of Medicine, Ethics and Law ",
      "MoM": "Master of Organizational Management ",
      "MoP": "Master of Organizational Psychology ",
      "MPA": "Master of Public Administration ",
      "MPH": "Master of Public Health",
      "MPM": "Master of Public Management ",
      "MPP": "Master of Public Policy",
      "Master in Redevelopment": "-",
      "MScHM": "Master of Science in Heritage Management",
      "MSM": "Master of Social Management ",
      "MTM": "Master of Technology Management ",
      "M.Th.": "Master of Theology"
    },
    "Lizenziat": {
      "lic.theol.": "Lizenziat der Theologie",
      "lic.iur.can.": "Lizenziat des (kanonischen) Kirchenrechts",
      "lic.rer.publ.": "Lizenziat der Publizistik",
      "lic.rer.reg.": "Lizenziat der Regionalwissenschaft"
    },
    "Bakkalaureusgrad": {
      "B.A.": "Bakkalaureus Artium bzw. Baccalaureus Artium",
      "Bac.Jur.": "Bakkalaureus Juris bzw. Baccalaureus Juris",
      "Bac.Oec.": "Bakkalaureus Oeconomicus bzw. Baccalaureus Oeconomicus"
    },
    "Magistergrad": {
      "M.A.": "Magister Artium",
      "M.Sc.": "Magister Scientiarum",
      "LL.M.": "Legum Magister",
      "MLE": "Magister Legum Europae",
      "Mag.rer.publ.": "Magister rerum publicarum",
      "Mag.theol. bzw. M.Theol.": "Magister Theologiae",
      "Mag.iur.": "Magister iuris",
      "M.Th.": "Magister Theologiae"
    },
    "Diplomgrad_FH": {
      "Dipl.-Agrar Ing. (FH)": "Diplom-Agraringenieur (FH)",
      "Dipl.-Archivar (FH)": "Diplom-Archivar (FH)",
      "Dipl.-Betriebsw. (FH)": "Diplom-Betriebswirt (FH)",
      "Dipl.-Bibl. (FH)": "Diplom-Bibliothekar (FH)",
      "Dipl.-Bioinf. (FH)": "Diplom-Bioinformatiker (FH)",
      "Dipl.-Bioing. (FH)": "Diplom-Bioingenieur (FH)",
      "Dipl.-Biomath. (FH)": "Diplom-Biomathematiker (FH)",
      "Dipl.-Chem. (FH)": "Diplom-Chemiker (FH)",
      "Dipl.-Des. (FH)": "Diplom-Designer (FH)",
      "Dipl.-Dok. (FH)": "Diplom-Dokumentar (FH)",
      "Dipl.-Dolm. (FH)": "Diplom-Dolmetscher (FH)",
      "Dipl.-Energiewirt (FH)": "Diplom-Energiewirt (FH)",
      "Dipl.-Ergotherapeut (FH)": "Diplom-Ergotherapeut (FH)",
      "Dipl.-oec.-troph. (FH)": "Diplom-Oecotrophologe (FH)",
      "Dipl.-Fachübersetzer (FH)": "Diplom-Fachübersetzer (FH)",
      "Dipl.-Finw. (FH)": "Diplom-Finanzwirt (FH)",
      "Dipl.-Forsting. (FH)": "Diplom-Forstingenieur (FH)",
      "Dipl. FÖ (FH)": "Diplom-Fitnessökonom (FH)",
      "Dipl.-Freizeitwiss. (FH)": "Diplom-Freizeitwissenschaftler (FH)",
      "Dipl.-Ges.oec. (FH)": "Diplom-Gesundheitsökonom (FH)",
      "Dipl.-Immobilienw. (FH)": "Diplom-Immobilienwirt (FH)",
      "Dipl.-Inf.(FH)": "Diplom-Informatiker (FH)",
      "Dipl.-Inf.-Wirt (FH)": "Diplom-Informationswirt (FH)",
      "Dipl.-Ing. (FH)": "Diplom-Ingenieur (FH)",
      "Dipl.-Ing.Gartenbau (FH)": "Diplom-Gartenbauingenieur (FH)",
      "Dipl.-Journ. (FH)": "Diplom-Journalist (FH)",
      "Dipl.-Kffr. (FH)": "Diplom-Kauffrau (FH)",
      "Dipl.-Kfm. (FH)": "Diplom-Kaufmann (FH)",
      "Dipl.-Komm.Psych. (FH)": "Diplom-Kommunikationspsychologe (FH)",
      "Dipl.-Kult.arb. (FH)": "Diplom-Kulturarbeiter (FH).[22]",
      "Dipl.-Künstler (FH)": "Diplom-Künstler (FH)",
      "Dipl.-Kunsttherap. (FH)": "Diplom-Kunsttherapeut (FH)",
      "Dipl.-Logist. (FH)": "Diplom-Logistiker (FH)",
      "Dipl.-Math. (FH)": "Diplom-Mathematiker (FH)",
      "Dipl.-Medieninform. (FH)": "Diplom-Medieninformatiker (FH)",
      "Dipl.-Medienök. (FH)": "Diplom-Medienökonom (FH)",
      "Dipl.-Medienw. (FH)": "Diplom-Medienwirt (FH)",
      "Dipl.-Mediator (FH)": "Diplom-Mediator (FH)",
      "Dipl.-Museol. (FH)": "Diplom-Museologe (FH)",
      "Dipl.-Musiktherap. (FH)": "Diplom-Musiktherapeut/in (FH)",
      "Dipl.-Naut. (FH)": "Diplom-Nautiker (FH)",
      "Dipl.oec.troph (FH)": "Diplom-Ökotrophologe (FH)",
      "Dipl.-Online-Journalist (FH)": "Diplom-Online-Journalist (FH)",
      "Dipl.-Pfl. (FH)": "Diplom-Pfleger (FH)",
      "Dipl.-Pflegew. (FH)": "Diplom-Pflegewirt (FH)",
      "Dipl.-Pflegepäd. (FH)": "Diplom-Pflegepädagoge (FH)",
      "Dipl.-Physiotherapeut (FH)": "Diplom-Physiotherapeut (FH)",
      "Dipl.-Pol. (FH)": "Diplom-Politologe (FH)",
      "Dipl.-Red. (FH)": "Diplom-Redakteur (FH)",
      "Dipl.-Rel.-päd. (FH)": "Diplom-Religionspädagoge (FH)",
      "Dipl.-Rest. (FH)": "Diplom-Restaurator (FH)",
      "Dipl.-Reha-psych. (FH)": "Diplom-Rehabilitationspsychologe (FH)",
      "Dipl.-Rpfl. (FH)": "Diplom-Rechtspfleger (FH)",
      "Dipl.-Sicherheitsing. (FH)": "Diplom-Sicherheitsingenieur (FH)",
      "Dipl.-Soz. Arb. (FH)": "Diplom-Sozialarbeiter (FH)",
      "Dipl.-Soz.jur. (FH)": "Diplom-Sozialjurist (FH)",
      "Dipl.-Soz.päd. (FH)": "Diplom-Sozialpädagoge (FH)",
      "Dipl.-Soz.-wirt (FH)": "Diplom-Sozialwirt (FH)",
      "Dipl.-Techn. (FH)": "Diplom-Technologe (FH)",
      "Dipl.-Tech.-Red. (FH)": "Diplom-Technik-Redakteur (FH)",
      "Dipl.-Übers. (FH)": "Diplom-Übersetzer (FH)",
      "Dipl.-Vers.-Betriebsw. (FH)": "Diplom-Versicherungsbetriebswirt (FH)",
      "Dipl.-Verww. (FH)": "Diplom-Verwaltungswirt (FH)",
      "Dipl.-Verw.-Betriebsw. (FH)": "Diplom-Verwaltungsbetriebswirt (FH)",
      "Dipl.-Verw.-Manager (FH)": "Diplom-Verwaltungsmanager (FH)",
      "Dipl.-Volksw. (FH)": "Diplom-Volkswirt (FH)",
      "Dipl.-Wirt.-Inf. (FH)": "Diplom-Wirtschaftsinformatiker (FH)",
      "Dipl.-Wi.-Inform. (FH)": "Diplom-Wirtschaftsinformatiker (FH)",
      "Dipl.-Wirtsch.-Ing. (FH)": "Diplom-Wirtschaftsingenieur (FH)",
      "Dipl.-Wirt.-Ing. (FH)": "Diplom-Wirtschaftsingenieur (FH)",
      "Dipl.-Wi.Jur. (FH)": "Diplom-Wirtschaftsjurist (FH)",
      "Dipl.-Wirtschaftspsych. (FH)": "Diplom-Wirtschaftspsychologe (FH)",
      "Dipl.-Wirt.-Übers.(FH)": "Diplom-Wirtschaftsübersetzer (FH) ",
      "Dipl.-Inf. (DH)": "Diplom-Informatiker (Duale Hochschule)",
      "Dipl.-Ing. (DH)": "Diplom-Ingenieur (Duale Hochschule)",
      "Dipl.-Betriebsw. (DH)": "Diplom-Betriebswirt (Duale Hochschule)",
      "Dipl.-Wirtsch.-Inf. (DH)": "Diplom-Wirtschaftsinformatiker (Duale Hochschule)",
      "Dipl.-Soz.päd. (DH)": "Diplom-Sozialpädagoge (Duale Hochschule)",
      "Dipl.-Anim.": "Diplom-Animator",
      "Dipl.-Arch.": "Diplom-Architekt (DDR-Grad, wird nicht mehr vergeben)",
      "Dipl.-Audiovisuelle Medien": "Diplom in audiovisuellen Medien",
      "Dipl.-Des.": "Diplom-Designer",
      "Dipl.-Film- u. Fernsehdram.": "Diplom-Film- und Fernsehdramaturg",
      "Dipl.-Film- u. Fernsehwirt.": "Diplom-Film- und Fernsehwirtschaftler",
      "Dipl.-Filmkomp.": "Diplom-Filmkomponist",
      "Dipl.-Freie Kunst": "Diplom für Freie Kunst",
      "Dipl.-Ing.": "Diplom-Ingenieur",
      "Dipl.-Kam.": "Diplom-Kameramann",
      "Dipl.-Kunstpädagogik": "Diplom für Bildende Kunst und Pädagogik",
      "Dipl.-Kunstpädagogik/Kunstvermittlung": "Diplom in Kunstpädagogik/Kunstvermittlung",
      "Dipl.-Kunst.-Päd.": "Diplom-Kunstpädagoge",
      "Dipl.-Rest.": "Diplom-Restaurator",
      "Dipl. Mus.": "Diplom in Musik",
      "Dipl.-Mus.-Päd.": "Diplom-Musikpädagoge",
      "Dipl.-Musikl.": "Diplom-Musiklehrer",
      "Dipl.-Reg.": "Diplom-Regisseur (auch Musiktheaterregisseur)",
      "Dipl.-Schau.": "Diplom-Schauspieler",
      "Dipl.-Schnittm.": "Diplom-Schnittmeister",
      "Dipl.-Szeneb.": "Diplom-Szenebildner",
      "Dipl.-Szenem.": "Diplom-Szenemeister",
      "Dipl.-Tonm.": "Diplom-Tonmeister",
      "Dipl. Vis. Komm.": "Diplom für Visuelle Kommunikation"
    },
    "Diplomgrad_Uni": {
      "Dipl.agr.biol.": "Diplom-Agrarbiologe",
      "Dipl.agr.oec.": "Diplom-Agrarökonom",
      "Dipl.-Angl.": "Diplom-Anglist",
      "Dipl.-Arch.": "Diplom-Architekt",
      "Dipl.-Berufspäd.": "Diplom-Berufspädagoge",
      "Dipl.-Betriebsw.": "Diplom-Betriebswirt",
      "Dipl.-Bibl.": "Diplom-Bibliothekar",
      "Dipl.-Biochem.": "Diplom-Biochemiker",
      "Dipl.-Biogeogr.": "Diplom-Biogeograph",
      "Dipl.-Bioinf.": "Diplom-Bioinformatiker",
      "Dipl.-Biol.": "Diplom-Biologe",
      "Dipl.-Biol. (t.o.)": "Diplom-Biologe",
      "Dipl.-Biophys.": "Diplom-Biophysiker",
      "Dipl.-Biotechnol.": "Diplom-Biotechnologie",
      "Dipl.-Braumeister": "Diplom-Braumeister",
      "Dipl.-Chem.": "Diplom-Chemiker",
      "Dipl.-Chem.-Ing.": "Diplom-Chemieingenieur",
      "Dipl.-Chem.oec.": "Diplom-Wirtschaftschemiker",
      "Dipl.-Comp.-Math.": "Diplom-Computermathematiker/-in",
      "Dipl.-Demogr.": "Diplom-Demograph",
      "Dipl.-Des.": "Diplom-Designer",
      "Dipl.-Dolm.": "Diplom-Dolmetscher",
      "Dipl.-Dram.": "Diplom-Dramaturg",
      "Dipl.-Forstw.": "Diplom-Forstwirt",
      "Dipl.-Geogr.": "Diplom-Geograph",
      "Dipl.-Geoinf.": "Diplom-Geoinformatiker",
      "Dipl.-Geol.": "Diplom-Geologe",
      "Dipl.-Geoökol.": "Diplom-Geoökologe",
      "Dipl.-Geophys.": "Diplom-Geophysiker",
      "Dipl.-Germ.": "Diplom-Germanist",
      "Dipl.-Geront.": "Diplom-Gerontologe",
      "Dipl.-Ges.oec.": "Diplom-Gesundheitsökonom",
      "Dipl.-Ghl.": "Diplom-Gesundheitslehrer",
      "Dipl. GDFS": "Diplom für Grenzüberschreitende deutsch-französische Studien",
      "Dipl.-Gwl.": "Diplom-Gewerbelehrer",
      "Dipl.-Gyml.": "Diplom-Gymnasiallehrer",
      "Dipl.-Hdl.": "Diplom-Handelslehrer",
      "Dipl.-Heilpäd.": "Diplom-Heilpädagoge",
      "Dipl.-Hist.": "Diplom-Historiker",
      "Dipl.-Holzwirt": "Diplom-Holzwirt",
      "Dipl.-Humanbiologe": "Diplom-Humanbiologe",
      "Dipl. human. biol.": "Diplom-Humanbiologe",
      "Dipl.-Hydrol.": "Diplom-Hydrologe",
      "Dipl.-Ind. Arch.": "Diplom-Industriearchäologe",
      "Dipl.-Inf. oder Dipl.-Inform.": "Diplom-Informatiker",
      "Dipl.-Inform. Med.": "Diplom-Informatiker der Medizin",
      "Dipl.-Inf.Wirt/Inform.Wirt": "Diplom-Informationswirt",
      "Dipl.-Inf.wiss": "Diplom-Informationswissenschaftler",
      "Dipl.-Ing.": "Diplom-Ingenieur",
      "Dipl.-Ing. agr.": "Diplom-Agraringenieur",
      "Dipl.-Ing.-Inf.": "Diplom-Ingenieurinformatiker",
      "Dipl.-Ing. oec.": "Diplom-Ingenieur-Ökonom Wirtschaftsingenieur",
      "Dipl.-Ing.-Päd.": "Diplom-Ingenieur-Pädagoge",
      "Dipl.-Ing. silv.": "Diplom-Forstingenieur",
      "Dipl.-jur. oder Dipl.-Jur.": "Diplom-Jurist",
      "Dipl.-Journ.": "Diplom-Journalist",
      "Dipl.-Kff.": "Diplom-Kauffrau",
      "Dipl.-Kfm.": "Diplom-Kaufmann",
      "Dipl.-Kfm. t.o.": "Diplom-Kaufmann technisch orientiert",
      "Dipl.-Komm.-Wirt": "Diplom-Kommunikationswirt",
      "Dipl.-Krim.": "Diplom-Kriminalist",
      "Dipl.-Kult.": "Diplom-Kulturwissenschaftler",
      "Dipl.-Kult.Päd.": "Diplom-Kulturpädagoge",
      "Dipl.-Kult.Man.": "Diplom-Kulturmanager",
      "Dipl.-Kulturwirt": "Diplom-KulturwirtIn",
      "Dipl.-Künstler": "Diplom-Künstler",
      "Dipl.-Kunstpädagoge": "Diplom-Kunstpädagoge",
      "Dipl.-Landsch.-ökol.": "Diplom-Landschaftsökologe",
      "Dipl.-Lebensmittelchem.": "Diplom-Lebensmittelchemiker",
      "Dipl.-Lehrer": "Diplom-Lehrer",
      "Dipl.-Ling.": "Diplom-Linguist",
      "Dipl.-LMChem.": "Diplom-Lebensmittelchemiker",
      "Dipl.-LM-Ing.": "Diplom-Lebensmittelingenieur",
      "Dipl.-Logist.": "Diplom-Logistiker",
      "Dipl.-Math.": "Diplom-Mathematiker",
      "Dipl.-Math. oec.": "Diplom-Wirtschaftsmathematiker",
      "Dipl.-Wi.-Math.": "Diplom-Finanz- und Wirtschaftsmathematiker",
      "Dipl.-Math. techn.": "Diplom-Technomathematiker",
      "Dipl.-Med.": "Diplom-Mediziner",
      "Dipl.-Vet.-Med.": "Diplom-Veterinärmediziner",
      "Dipl.-Med. Päd.": "Diplommedizinpädagoge",
      "Dipl.-Medienberater": "Diplom-Medienberater",
      "Dipl.-Mediengestalter": "Diplom-Mediengestalter",
      "Dipl.-Medieninf.": "Diplom-Medieninformatiker",
      "Dipl.-Medienprakt.": "Diplom-Medienpraktiker",
      "Dipl.-Medienwirt": "Diplom-Medienwirt",
      "Dipl.-Medienwiss.": "Diplom-Medienwissenschaftler",
      "Dipl.-Met.": "Diplom-Meteorologe",
      "Dipl.-Mot.": "Diplom-Motologe",
      "Dipl.-Mol.Med.": "Diplom-Molekularmediziner",
      "Dipl.-Mikrobiol.": "Diplom-Mikrobiologe",
      "Dipl.-Mil.": "Diplom-Militärwissenschaftler",
      "Dipl.-Min.": "Diplom-Mineraloge",
      "Dipl.-NanoSc.": "Diplom-Nanostrukturwissenschaftler",
      "Dipl.-Nat.": "Diplom-Naturwissenschaftler",
      "Dipl.-Hist.Sc": "Diplom-Naturwissenschaftshistoriker",
      "Dipl.-Neurowiss.": "Diplom-Neurowissenschaftler",
      "Dipl.oec.troph.": "Diplom-Ökotrophologe",
      "Dipl.-Oec.": "Diplom-Ökonom",
      "Dipl.-Ök.": "Diplom-Ökonom",
      "Dipl.-oen.": "Diplom-Oenologe",
      "Dipl.-Orient.": "Diplom-Orientalist",
      "Dipl.-Orientarchäologe": "Diplom-Orientarchäologe",
      "Dipl.-Oz.": "Diplom-Ozeanograph",
      "Dipl.-Päd.": "Diplom-Pädagoge",
      "Dipl.-PGW": "Diplom-Pflege- und Gesundheitswissenschaftler",
      "Dipl.-Pharm.": "Diplom-Pharmazeut",
      "Dipl.-Phil.": "Diplom-Philosoph",
      "Dipl.-Phys.": "Diplom-Physiker",
      "Dipl.-Phys. (Med.)": "Diplom-Medizinphysiker",
      "Dipl.-Phys.Ing.": "Diplom-Physikingenieur",
      "Dipl.-Phys. oec.": "Diplom-Wirtschaftsphysiker",
      "Dipl.-Pol.": "Diplom-Politologe",
      "Dipl.-Prähist.": "Diplom-Prähistoriker",
      "Dipl.-Psych.": "Diplom-Psychologe",
      "Dipl.-Reg.-Wiss.": "Diplom-Regionalwissenschaftler",
      "Dipl.-Reh.-Päd.": "Diplom-Rehabilitationspädagoge",
      "Dipl. rer. com.": "Diplom-Kommunikationswissenschaftler",
      "Dipl. rer. oec.": "Diplom-Wirtschaftswissenschaftler",
      "Dipl. rer. pol.": "Diplomatus rerum politicarum",
      "Dipl.-Rom.": "Diplom-Romanist",
      "Dipl. sc. pol. Univ.": "Diplomaticus scientiae politicae Universitatis",
      "Dipl.-Sicherheits.-Ing.": "Diplom-Sicherheitsingenieur",
      "Dipl.-Soz.Ök.": "Diplom-Sozialökonom",
      "Dipl.-Soz.": "Diplom-Soziologe",
      "Dipl.-Soz. tech.": "Diplom-Soziologe technikwissenschaftlicher Richtung",
      "Dipl.-Soz.päd.": "Diplom-Sozialpädagoge",
      "Dipl.-Sozw.": "Diplom-Sozialwirt",
      "Dipl.-Sozialw.": "Diplom-Sozialwissenschaftler",
      "Dipl.-Sporting.": "Diplom-Sportingenieur",
      "Dipl.-Sportl.": "Diplom-Sportlehrer",
      "Dipl.-SpOec.": "Diplom-Sportökonom",
      "Dipl.-Sportwiss.": "Diplom-Sportwissenschaftler",
      "Dipl.-Sprachm.": "Diplom-Sprachmittler",
      "Dipl.-Sprechwiss.": "Diplom-Sprechwissenschaftler",
      "Dipl.-Staatsw.": "Diplom-Staatswissenschaftler",
      "Dipl.-Stat.": "Diplom-Statistiker",
      "Dipl.-Stom.": "Diplom-Zahnarzt",
      "Dipl.-Stomat.": "Diplom-Zahnarzt",
      "Dipl.-Systemwiss.": "Diplom-Systemwissenschaftler",
      "Dipl.-Tech. Math.": "Diplom-Technomathematiker",
      "Dipl.-Technoinform.": "Diplom-Technoinformatiker",
      "Dipl.-Theol.": "Diplom-Theologe",
      "Dipl.-Troph.": "Diplom-Trophologe",
      "Dipl.-Übersetzer": "Diplom-Übersetzer",
      "Dipl.-Umweltwiss.": "Diplom-Umweltwissenschaftler",
      "Dipl.-UWT": "Diplom-Umwelttechniker",
      "Dipl.-Verk.wirtsch.": "Diplom-Verkehrswirtschaftler",
      "Dipl.-Verw. Wiss.": "Diplom-Verwaltungswissenschaftler",
      "Dipl.-Volksw.": "Diplom-Volkswirt",
      "Dipl.-Wirt.": "Diplom-Wirtschaftler",
      "Dipl.-Wirtchem.": "Diplom-Wirtschaftschemiker",
      "Dipl.-Wirt.-Inf.": "Diplom-Wirtschaftsinformatiker",
      "Dipl.-Wi.-Ing.": "Diplom-Wirtschaftsingenieur",
      "Dipl. iur .oec. univ.": "Diplom-Wirtschaftsjurist Univ.",
      "Dipl.-Wigeo.": "Diplom-Wirtschaftsgeograph",
      "Dipl.-Wirtl.": "Diplom-Wirtschaftslehrer",
      "Dipl.-Wipäd.": "Diplom-Wirtschaftspädagoge",
      "Dipl.-Wiss.org.": "Diplom-Wissenschaftsorganisator",
      "Dipl.-WiWi.": "Diplom-Wirtschaftswissenschaftler"
    },
    "Doktorgrad": {
      "Dr.agr. (agriculturae)": "Doktor der Agrarwissenschaft",
      "Dr.B.A. (D.B.A.)": "Doctor of Business Administration",
      "Dr.biol.anim. (biologiae animalis)": "Doktor der Tierphysiologie",
      "Dr.biol.hom. (biologiae hominis)": "Doktor der Humanbiologie",
      "Dr.cult. (culturae)": "Doktor der Kulturwissenschaften",
      "Dr.disc.pol. (disciplinarum politicarum)": "Doktor der Sozialwissenschaften",
      "Dr.-Ing.(Doktoringenieur)": "Doktor der Ingenieurwissenschaften",
      "Dr.iur. (iuris)": "Doktor der Rechte bzw. Doktor des Rechts/der Rechtswissenschaft",
      "Dr.iur.can. (iuris canonici)": "Doktor der kanonischen Rechtswissenschaften",
      "Dr.iur. et rer.pol. (iuris et rerum politicarum)": "Doktor der Rechts- und Staatswissenschaften",
      "Dr.iur.utr. (iuris utriusque)": "Doktor beider Rechte",
      "Dr.math. (mathematicae)": "Doktor der Mathematik",
      "Dr.med. (medicinae)": "Doktor der Medizin",
      "Dr.med.dent. (medicinae dentariae)": "Doktor der Zahnheilkunde/Zahnmedizin",
      "Dr.med.sci.": "Doktor der Medizinischen Wissenschaft",
      "Dr.med.vet. (medicinae veterinariae)": "Doktor der Tiermedizin",
      "Dr.nat.med.": "Doktor der naturwissenschaftlichen Medizin",
      "Dr.nat.techn. (naturalium technicarum)": "Doktor der Bodenkultur",
      "Dr.oec. (oeconomiae)": "Doktor der Wirtschafts-/Verwaltungswissenschaften",
      "Dr.oec.publ. (oeconomiae publicae)": "Doktor der Staatswissenschaften/Volkswirtschaft",
      "Dr.oec.troph. (oecotrophologiae)": "Doktor der Ernährungswissenschaften/Haushaltswissenschaft",
      "Dr.paed. (paedagogiae)": "Doktor der Erziehungswissenschaften",
      "Dr.pharm. (pharmaciae)": "Doktor der Pharmazie",
      "Dr.phil. (philosophiae)": "Doktor der Philosophie",
      "Dr.phil. in art. (philosophiae in artibus)": "Doktor der Philosophie in den Künsten (künstlerisch-wissenschaftlich)",
      "Dr.phil.nat. (philosophiae naturalis)": "Doktor der Naturwissenschaften",
      "Dr.PH (public health)": "Doktor der Public Health",
      "Dr.rer.agr. (rerum agriculturarum)": "Doktor der Landbauwissenschaften",
      "Dr.rer.biol.hum. (rerum biologiae humanae)": "Doktor der Humanbiologie",
      "Dr.rer.biol.vet. (rerum biologiae veterinariae)": "Doktor der Veterinärbiologie",
      "Dr.rer.cult. (rerum culturarum)": "Doktor der Kulturwissenschaften",
      "Dr.rer.cur. (rerum curae)": "Doktor der Pflegewissenschaften",
      "Dr.rer.forest. (rerum forestalium)": "Doktor der Forstwissenschaften",
      "Dr.rer.hort. (rerum horticulturarum)": "Doktor der Gartenbauwissenschaften",
      "Dr.rer.hum. (rerum humanarum)": "Doktor der Medizinwissenschaften",
      "Dr.rer.med. (rerum medicarum)": "Doktor der Medizinwissenschaften",
      "Dr.rer.medic. (rerum medicinalium)": "Doktor der theoretischen Medizin, Medizinwissenschaften, Biomedizin, Medizintechnologie, medizinischen Biometrie und Bioinformatik, Gesundheitswissenschaften",
      "Dr.rer.merc. (rerum mercantilium)": "Doktor der Handelswissenschaften",
      "Dr.rer.mont. (rerum montanarum)": "Doktor der Bergbauwissenschaften",
      "Dr.rer.nat. (rerum naturalium)": "Doktor der Naturwissenschaften",
      "Dr.rer.oec. (rerum oeconomicarum)": "Doktor der Wirtschaftswissenschaften",
      "Dr.rer.physiol. (rerum physiologicarum)": "Doktor der Humanbiologie",
      "Dr.rer.pol. (rerum politicarum)": "Sammelbegriff für Doktoren der Politikwissenschaft, Sozialwissenschaften, Staatswissenschaften oder Wirtschaftswissenschaften",
      "Dr.rer.publ. (rerum publicarum)": "Doktor der Verwaltungswissenschaften",
      "Dr.rer.sec. (rerum securitatis)": "Doktor der Sicherheitswissenschaften",
      "Dr.rer.silv. (rerum silvestrium bzw. rerum silvaticarum)": "Doktor der Forstwissenschaften",
      "Dr.rer.soc. (rerum socialium)": "Doktor der Sozialwissenschaften",
      "Dr.rer.tech. (rerum technicarium)": "Doktor der Technischen Wissenschaften",
      "Dr.sc.agr. (scientiarum agrarium)": "Doktor der Agrarwissenschaften",
      "Dr.sc.hum. (scientiarum humanarum)": "Doktor der Humanwissenschaften",
      "Dr.sc.mus. (scientiae musicae)": "Doktor der Musikwissenschaften",
      "Dr.sc.oec. (scientiarum oeconomicarum)": "Doktor der Wirtschaftswissenschaften",
      "Dr.sc.phil. (scientiarum philosophiae)": "Doktor der Philosophiewissenschaften",
      "Dr.sc.pol. (scientiarum politicarum)": "Doktor der Wirtschafts- und Sozialwissenschaften",
      "Dr.sc.soc. (scientiae socialis)": "Doktor der Sozialwissenschaften",
      "Dr.sc.techn. (scientiarum technicarum)": "Doktor der technischen Wissenschaften",
      "Dr.Sportwiss.": "Doktor der Sportwissenschaften",
      "Dr.theol. (theologiae)": "Doktor der Theologie",
      "Dr.troph. (trophologiae)": "Doktor der Ernährungswissenschaft",
      "Ph.D. Freie Kunst": "Doktorgrad für Graduierte aus den Künsten (Bauhaus-Universität Weimar)",
      "Ph.D. Kunst und Design": "Doktorgrad für Graduierte aus dem Design (Bauhaus-Universität Weimar)",
      "Ph.D. Medienkunst": "Doktorgrad für Graduierte aus der Medienkunst (Bauhaus-Universität Weimar)",
      "Dr.h.c. (honoris causa)": "Ehrendoktor",
      "Dr.e.h. (ehrenhalber)": "Ehrendoktor",
      "D. (ehrenhalber)": "Ehrendoktor der ev. Theologie"
    }
  },
  get allGrades() {
    return Object.keys(Data_AkademischerGrad.data);
  },
  get allEntries() {
    let data = {};
    for (let k in Data_AkademischerGrad.data) {
      data = {
        ...data,
        ...Data_AkademischerGrad.data[k]
      }
    }
    return data
  }
}