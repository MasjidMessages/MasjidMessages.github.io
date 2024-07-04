var skipStartScreen = true;

/* ----------------------------------------- */
/*             DO NOT MODIFY JS              */
/* ----------------------------------------- */
var tempCount = 0;
var messages = [];
var mTitleElement;
var mBodyElement;
var mBodyListElement;
var mRepeatLabelsElement;
var mFootnotesTitleElement;
var mFootnotesListElement;
var currentMessage = 0;
var size = 18;
var speed = 100;
var startIn = 59;
window.addEventListener("load", function (event) {
    main();
});

/* Messages Constructor Function */
function Message(
    title,
    body = "",
    bodyList = [],
    footnotesTitle = "",
    footnotes = []
) {
    this.title = englishToArabicNumbers(title);
    this.body = starToAyahNumber(englishToArabicNumbers(body))
        .replace(/\(/g, "<sup>")
        .replace(/\)/g, "</sup>");
    this.bodyList = createOL(listEngToArab(bodyList));
    this.footnotesTitle = englishToArabicNumbers(footnotesTitle);
    this.footnotes = createOL(listEngToArab(footnotes));
    this.repeatLabels = "";
    this.messageCharacters = title.trim().length + body.trim().length;
}

function outputMessage(m) {
    mTitleElement.innerHTML = m.title + " " + englishToArabicNumbers(String(currentMessage + 1)) + " من " + englishToArabicNumbers(String(messages.length));
    mBodyElement.innerHTML = m.body;
    mBodyListElement.innerHTML = m.bodyList;
    mRepeatLabelsElement.innerHTML = m.repeatLabels;
    mFootnotesTitleElement.innerHTML = m.footnotesTitle;
    mFootnotesListElement.innerHTML = m.footnotes;
}
/* AfterPrayerMessages Constructor Function */
function MorningEveningMessage(
    title = "بدون عنوان",
    body = "الدعاء",
    morning = 0,
    evening = 0,
    day = 0,
    footnotes = [],
    footnotesTitle = "",
    basmallah = false,
    taooth = false
) {
    let m = new Message(title, body, undefined, footnotesTitle, footnotes);
    m.morning = morning;
    m.evening = evening;
    m.day = day;
    m.basmallah = basmallah;
    m.taooth = taooth;
    if (m.basmallah || m.taooth) {
        m.body =
            "<span class='braces'>﴿</span>" +
            m.body +
            "<span class='braces'>﴾</span>";
    }
    let repeatLabelStartTag = "<span class='repeatLabel'>";
    let repeatLabelEndTag = "</span>";
    if (m.day > 0) {
        m.repeatLabels +=
            repeatLabelStartTag +
            "اليوم" +
            " x " +
            englishToArabicNumbers("" + m.day) +
            repeatLabelEndTag;
    } else {
        if (m.morning > 0)
            m.repeatLabels +=
                repeatLabelStartTag +
                "الصباح" +
                " x " +
                englishToArabicNumbers("" + m.morning) +
                repeatLabelEndTag;
        if (m.evening > 0)
            m.repeatLabels +=
                repeatLabelStartTag +
                "المساء" +
                " x " +
                englishToArabicNumbers("" + m.evening) +
                repeatLabelEndTag;
    }
    return m;
}

/* Change English to Arabic numbers */
function englishToArabicNumbers(s) {
    return s.replace(/\d/g, function (d) {
        return "٠١٢٣٤٥٦٧٨٩"[d];
    });
}
function starToAyahNumber(s, start = 1) {
    tempCount = start;
    return s.replace(/\*/g, function () {
        let arabic = "٠١٢٣٤٥٦٧٨٩"[tempCount];
        tempCount++;
        return "<span class='ayah'>" + "۝" + "</span>" + arabic;
    });
}
function listEngToArab(list) {
    let newList = [];
    if (list != undefined) {
        for (i = 0; i < list.length; i++) {
            newList.push(
                englishToArabicNumbers(list[i]).replace(/\//g, "/&rlm;")
            );
        }
    }
    return newList;
}

/* Create Ordered List Elements */
function createOL(list) {
    let elements = "";
    if (list.length > 0) {
        elements = "<ol>";
        for (let i = 0; i < list.length; i++) {
            elements += "<li>" + list[i] + "</li>";
        }
        elements += "</ol>";
    }
    return elements;
}

function main() {
    mTitleElement = document.getElementById("mTitle");
    mBodyElement = document.getElementById("mBody");
    mBodyListElement = document.getElementById("mBodyList");
    mRepeatLabelsElement = document.getElementById("mRepeatLabels");
    mFootnotesTitleElement = document.getElementById("mFootnotesTitle");
    mFootnotesListElement = document.getElementById("mFootnotesList");
    if (skipStartScreen) {
        nextMessage();
        return;
    }
    let qString = (window.location.search.replace(/\?/g, "")).split("&");
    for (let i = 0; i < qString.length; i++) {
        let pair = qString[i].split("=");
        if (pair.length = 2) {
            if (pair[0].trim().toLowerCase() === "size") {
                document.documentElement.style.fontSize = pair[1] + "px";
                size = Number(pair[1])

            } else if (pair[0].trim().toLowerCase() === "speed") {
                speed = Number(pair[1])
            }
        }
    }
    mBodyListElement.innerHTML = "<ol><li>speed=" + speed + "</li><li>size=" + size + "</li></ol>";
    let date = new Date();
    let startDate = new Date(date.valueOf())
    let startInSeconds = (1 - date.getMinutes() % 2) * 60 + (60 - new Date().getSeconds());
    startDate.setSeconds(startDate.getSeconds() + startInSeconds);
    setTimeout(nextMessage, startDate.getTime() - new Date().getTime());
    mFootnotesListElement.innerHTML = "<ol><li>العرض " + englishToArabicNumbers(String(window.innerWidth)) + "</li><li>الطول " + englishToArabicNumbers(String(window.innerHeight)) + "</li><li>سيبدأ البرنامج " + startDate.toLocaleTimeString("ar-sa") + "</li></ol>"

}

function nextMessage() {

    outputMessage(messages[currentMessage])
    setTimeout(nextMessage, messages[currentMessage].messageCharacters * speed);
    nextMessageIndex();
}
function nextMessageIndex() {
    if (currentMessage === undefined) {
        currentMessage = 0;
    } else if (currentMessage < messages.length - 1) {
        currentMessage++
    }
    else {
        currentMessage = 0;
    }
}

