// TO DO
// desk modes: colored teams
// center the desks
// check if user wants to overwrite existing configs or not
// timer functions: count up, count down (set time vs. to something o'clock)
// timer fullscreen, subtimer, and split functions
// create auto class timeline with variable options for hard and soft time limits
// add grade / scoring / progress chart

const gridBackground    = document.getElementById('gridBackground')
const deskLayer         = document.getElementById('deskLayer')
const nameClass         = document.getElementById('nameClass')
const studentNum        = document.getElementById('studentNum')
const columnNum         = document.getElementById('columnNum')
const classSelect       = document.getElementById('classSelect')
const nameConfig        = document.getElementById('nameConfig')
const configButtons     = document.getElementById('configButtons')
const dotGapSlider      = document.getElementById('dotGapSlider')
const timerLayer        = document.getElementById('timerLayer')
const timeOfDay         = document.getElementById('timeOfDay')
const monthYear         = document.getElementById('monthYear')
const timerDirectionBtn = document.getElementById('timerDirectionBtn')
const timerTargetBtn    = document.getElementById('timerTargetBtn')
const timeAmountSet     = document.getElementById('timeAmountSet')
const timeDaySet        = document.getElementById('timeDaySet')
const timeInput         = document.getElementById('timeInput')
const timerName         = document.getElementById('timerName')
const pickHours         = document.getElementById('pickHours')
const pickMinutes       = document.getElementById('pickMinutes')

const timerTemplate     = document.querySelector("[timer-template]")

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December']

const classes = {
    '201' : [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
        13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
    ],
    '202' : [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
        13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24
    ],
    '501': [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 
        13, 14, 16, 17, 18, 19, 20, 21, 22, 23
    ],
    '502': [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
        12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22
    ],
    '601': [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
        12, 13, 14, 16, 17, 18, 19, 20, 21
    ],
    '602': [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
        12, 13, 15, 14, 16, 17, 18, 19, 20, 21
    ]
}

let gap = 50
let studentCount = 20

let viewWnum
let viewHnum

// dotGapSlider.oninput = function() {
//     checkPixels(dotGapSlider.value)
// }

let allConfigs = []
let timerObjects = []

if (localStorage.getItem("desk_configs")) {
    allConfigs = JSON.parse(localStorage.getItem("desk_configs"))
}

let currentClass
let classIndex = 0
let configIndex = 0

let timerDirection = -1
let timerTarget = 'amount'
let timerCount = 0

populateClassOptions()
switchClass(classIndex)

//localStorage.setItem("desk_configs", "")

function populateGridDots(n, screenW, screenH) {
    let iterationsW = Math.ceil((screenW - 0) / n)
    let iterationsH = Math.floor((screenH - 0) / n)

    gridBackground.innerHTML = ''

    const gapStr = n + "px "
    let columnSpacingStr = ""
    let rowSpacingStr = ""
    
    for (let i = 0; i < iterationsW; i++) {

        for (let j = 0; j < iterationsH; j++) {
            newDot = document.createElement('div')
            newDot.classList.add('one-dot')
            newDot.style.width = gapStr
            newDot.style.height = gapStr
            newDot.style.lineHeight = gapStr
            newDot.innerText = "·"
    
            if (i==0) {
                rowSpacingStr = rowSpacingStr.concat(gapStr)
            }

            gridBackground.append(newDot)
        }

        columnSpacingStr = columnSpacingStr.concat(gapStr)
    }
    // console.log(columnSpacingStr)
    gridBackground.style.gridTemplateColumns = columnSpacingStr
    gridBackground.style.gridTemplateRows = rowSpacingStr
}

function checkPixels (n) {
    // let resWnum = screen.availWidth;
    // let resHnum = screen.height;
    viewWnum = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    viewHnum = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    console.log(viewWnum, viewHnum)

    populateGridDots(n, viewWnum, viewHnum)
}

checkPixels(gap);
update = function(){checkPixels(gap)};

// updates the stats anytime the window is resized

window.addEventListener("resize", update)


// CODE SNIP PROGRAMMING DRAGGABLE ELEMENT (NOT RESIZABLE)

//let dragDesk = document.getElementsByClassName('desk')
//dragInit(dragDesk[0]);

function dragInit( elemToDrag ) {

    // the required css code to resize

    elemToDrag.style.cursor = 'grab';

    elemToDrag.onmousedown =(e)=> {
        
        initMouseX = e.clientX
        initMouseY = e.clientY
        initBoxX = Math.floor((e.target.getBoundingClientRect().x) / gap) * gap
        initBoxY = Math.floor((e.target.getBoundingClientRect().y) / gap) * gap

        // console.log("mouse down", initMouseX, initMouseY, e.target.getBoundingClientRect())

        elemToDrag.style.cursor = 'grabbing';
        e = (e || window.event);
        e.preventDefault();

        // start dragging
        document.onmousemove =(e)=> {
            e = (e || window.event);
            e.preventDefault();

            currentMouseX = e.clientX
            currentMouseY = e.clientY

            newX = (currentMouseX - initMouseX) - ((currentMouseX - initMouseX) % gap) + ((gap + 0) / 2)
            newY = (currentMouseY - initMouseY) - ((currentMouseY - initMouseY) % gap) + ((gap + 0) / 2)

            elemToDrag.style.left = (newX + initBoxX) + "px";
            elemToDrag.style.top  = (newY + initBoxY) + "px";
        }

        // stop dragging
        document.onmouseup =()=>  {

            document.onmouseup = null;
            document.onmousemove = null;
            elemToDrag.style.cursor = 'grab';

        };
    }    
}

// END OF CODE SNIP

// CODE SNIP: drag and resize initialization function

function dragResizeInit( elemToDrag) {
    
    // the required css code to resize
    elemToDrag.style.overflow = 'auto';
    elemToDrag.style.position = 'absolute';
    //elemToDrag.style.resize = 'both';

    elemToDrag.style.cursor = 'grab';

    elemToDrag.onmousedown =(e)=> {

        rect = e.target.getBoundingClientRect()

        initMouseX = e.clientX
        initMouseY = e.clientY
        initBoxX = Math.floor((rect.x) / gap) * gap
        initBoxY = Math.floor((rect.y) / gap) * gap

        initWidth = rect.width
        initHeight = rect.height
    
        // see if the mouse cursor is at lower right corner
        // above the resize graphic, if so, set the variable
        // [currentlyResizing] to true
        let rectActiveElem = elemToDrag.getBoundingClientRect(),
           x = parseInt(e.clientX - rectActiveElem.left),
           y = parseInt(e.clientY - rectActiveElem.top),
           rightEdge = ((elemToDrag.offsetWidth - x) < 15),
           bottomEdge = ((elemToDrag.offsetHeight - y) < 15),
           currentlyResizing = (rightEdge && bottomEdge);
           
        // if [currentlyResizing]we don't want to
        // move [elemToDrag] we want to resize it
        if(!currentlyResizing){
            elemToDrag.style.cursor = 'grabbing';
            e = (e || window.event);
            e.preventDefault();
            
            // start dragging
            document.onmousemove =(e)=> {
                e = (e || window.event);
                e.preventDefault();

                currentMouseX = e.clientX
                currentMouseY = e.clientY

                newX = (currentMouseX - initMouseX) - ((currentMouseX - initMouseX) % gap) + ((gap + 0) / 2)
                newY = (currentMouseY - initMouseY) - ((currentMouseY - initMouseY) % gap) + ((gap + 0) / 2)

                elemToDrag.style.left = (newX + initBoxX) + "px";
                elemToDrag.style.top  = (newY + initBoxY) + "px";
            } 

            // stop dragging
            document.onmouseup =()=>  {
               document.onmouseup = null;
               document.onmousemove = null;
               elemToDrag.style.cursor = 'grab';
            }

        } else {
            e = (e || window.event);
            e.preventDefault();

            document.onmousemove =(e)=> {
                e = (e || window.event);
                e.preventDefault();

                currentMouseX = e.clientX 
                currentMouseY = e.clientY
    
                newWidth = (currentMouseX) - currentMouseX % gap
                newHeight = (currentMouseY) - currentMouseY % gap
    
                elemToDrag.style.width  = newWidth  - (rect.x - rect.x % gap) + "px";
                elemToDrag.style.height = newHeight - (rect.y - rect.y % gap) + "px";
            }

            document.onmouseup =()=>  {
                document.onmouseup = null;
                document.onmousemove = null;
                elemToDrag.style.cursor = 'grab';
            }

        }
    }   
}

// END OF CODE SNIP

function saveClass() {
    if (nameClass.value) {
        // grab class name, total studen number, and column number from inputs
        currentClass = nameClass.value.toString()
        currentStudentNum = studentNum.value
        currentColumnNum = columnNum.value

        // create default desk layout
        populateDesks(null, currentStudentNum, currentColumnNum)
        defaultConfig = assignConfigCoords()

        classDict = {
            'class_name': currentClass,
            'num_and_col': [currentStudentNum, currentColumnNum],
            'configs': [{
                'name': 'default',
                'positions': defaultConfig
            }]
        }
        console.log(classDict)

        allConfigs.push(classDict)
        localStorage.setItem("desk_configs", JSON.stringify(allConfigs))

        populateConfigButtons(configIndex)

        // create dropdown menu options

        let newOption = document.createElement('option')
        newOption.value = configIndex
        newOption.innerText = currentClass

        classSelect.append(newOption)
    }
}

function setClassIndex(str) {
    
    for (let i=0; !(allConfigs[i].class_name == str); i++) {
        classIndex = i
    }

    console.log(classIndex)
}

function assignConfigCoords() {
    allDesks = Array.from(document.getElementsByClassName('desk'))
    deskPos = []

    allDesks.forEach(element => {
        rect = element.getBoundingClientRect()
        rectX = rect.left + window.scrollX
        rectY = rect.top + window.scrollY

        coord = [rectX, rectY]
        deskPos.push(coord)
    })

    return deskPos
}

function saveConfig(str) {
    if (str) {
        // check to see if config name is already in use
        // if so, give user the option to overwrite or cancel



        // here is the option to write / overwrite

        configObj = {}

        configObj.name = str
        configObj.positions = assignConfigCoords()

        allConfigs[classIndex].configs.push(configObj)
        localStorage.setItem("desk_configs", JSON.stringify(allConfigs))

        configIndex = allConfigs[classIndex].configs.length

        populateConfigButtons(classIndex)

        nameConfig.value = null
    }
}

function populateClassOptions() {
    classSelect.innerHTML = ''
    
    noneOption = document.createElement('option')
    noneOption.value = null
    noneOption.innerText = 'none'

    classSelect.append(noneOption)

    for (let n = 0; n < allConfigs.length; n++) {
        let newOption = document.createElement('option')
        newOption.value = n
        newOption.innerText = allConfigs[n].class_name

        classSelect.append(newOption)
    }
}

function populateDesks(n, tot, col) {
    deskLayer.innerHTML = ''
    let t // total
    let w // width in columns


    if (n) {
        t = allConfigs[n].num_and_col[0]
        w = allConfigs[n].num_and_col[1]
    } else {
        t = tot
        w = col
    }
    
    for (let i = 0; i < t; i++) {
        newDesk = document.createElement('div')
        newDesk.classList.add('desk')
        newDesk.style.height = (2 * gap) + "px"
        newDesk.style.width = (2 * gap) + "px"
        newDesk.style.lineHeight = (2 * gap) + "px"
        newDesk.style.fontSize = (2 * gap - 30) + "px"
        newDesk.style.zIndex = -1
        newDesk.innerText = i + 1

        newDesk.style.top = (Math.floor((i) / w) * gap * 3) + gap / 2 + "px"
        newDesk.style.left = (i % w) * gap * 3 + gap / 2 + "px"

        deskLayer.append(newDesk)
        dragInit(newDesk)
    }
}

function populateConfigButtons(n) {
    configButtons.innerHTML = ''
    if (allConfigs[n]) {
        let configArr = allConfigs[n].configs
    
        for (let i=0; i< configArr.length; i++) {
            newButton = document.createElement('button')
            newButton.setAttribute("onclick", "switchConfig(" + i + ")")
            newButton.innerText = configArr[i].name
    
            configButtons.append(newButton)
        }
    }
}

function switchClass(n) {
    classIndex = n
    
    populateDesks(n)
    populateConfigButtons(n)
}

function switchConfig(n) {
    allDesks = Array.from(document.getElementsByClassName('desk'))
    configIndex = n

    i = 0
    allDesks.forEach(element => {
        
        element.style.left = allConfigs[classIndex].configs[configIndex].positions[i][0] + "px"
        element.style.top  = allConfigs[classIndex].configs[configIndex].positions[i][1] + "px"

        i++
    })
}

function clearConfigs(int) {
    if (int < 0) {
        allConfigs[classIndex].configs = [allConfigs[classIndex].configs[0]]
        localStorage.setItem('desk_configs', JSON.stringify(allConfigs))
    }
    populateConfigButtons(0)
}

function shuffleDesks() {
    allDesks = Array.from(document.getElementsByClassName('desk'))
    unshuffledPositions = allConfigs[classIndex].configs[configIndex].positions

    shuffledPositions = shuffle(unshuffledPositions)

    n = 0
    allDesks.forEach(element => {
        
        element.style.left = shuffledPositions[n][0] + "px"
        element.style.top  = shuffledPositions[n][1] + "px"

        n++
    })
}

function shuffle(arr){
    let unshuffled = arr;
    let shuffled = [];
  
    unshuffled.forEach(word =>{
        randomPos = Math.round(Math.random() * shuffled.length);
  
        shuffled.splice(randomPos, 0, word);
    })
    
    // console.log(shuffled);
    return shuffled;
}

function toggleDeskAppearance() {
    allDesks = Array.from(document.getElementsByClassName('desk'))

    allDesks.forEach(element => {
        if (element.classList.contains('circle-mode')) {
            element.classList.remove('circle-mode')
        } else {
            element.classList.add('circle-mode')
        }
    })
}

function displayTime() {
    const date = new Date;
    // date.setTime(result_from_Date_getTime);

    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hour = date.getHours() % 12;

    timeStr =   hour + ":" + 
                appendZero(minutes.toString()) + ":" + 
                appendZero(seconds.toString())

    const weekDay = weekdays[date.getDay()].substring(0, 3)
    const monthDay = date.getDate()
    const month = months[date.getMonth()].substring(0, 3)
    const year = date.getFullYear()

    timeOfDay.innerText = timeStr
    monthYear.innerText = weekDay + ", " + month + " " + monthDay + ", " + year

    updateTimers(timerObjects)
}

function updateTimers(arr){
    arr.forEach(timerDict => {
        timerId = timerDict.timer_id
        

        const timerElem = document.getElementById("timer_" + timerId)

        if (timerElem && (timerDict.sec_end - timerDict.sec_now >= 1)) {
            const mainTime = timerElem.querySelector("[timer-main]")
            const beginTime = timerElem.querySelector("[timer-start]")
            const targetTime = timerElem.querySelector("[timer-end]")
            const timerDirect = timerDict.count_direction
    
            if (!timerDict.active) {
                timerDict.sec_end += 1
            } 
            if (timerDirection < 0 || timerDict.active) {
                timerDict.sec_now += 1
            } 
            
            beginTime.innerText = secToTimeStamp(timerDict.sec_start)[1]
            targetTime.innerText = secToTimeStamp(timerDict.sec_end)[1]
    
            if (timerDirect < 0) { // create countdown display
                mainStamp = secToTimeStamp(timerDict.sec_end - timerDict.sec_now)[1]
            } else { // create countup display
                mainStamp = secToTimeStamp(timerDict.sec_now - timerDict.sec_start)[1]
            }
            
            mainTime.innerText = trimTimeStamp(mainStamp, timerDict.init_length)
        }

    })
}

function timeStampToSec(str) {
    timeStampArr = str.split(':')

    rawSecInt =     Number(timeStampArr[2])
    rawSecInt +=    Number(timeStampArr[1] * 60)
    rawSecInt +=    Number(timeStampArr[0] * 3600)

    return rawSecInt
}

function secToTimeStamp(int) {
    timeStampArr = [null, null, null]

    rawSec = int % 60
    rawMin = (int - rawSec) % 3600
    rawHour = (int - rawMin - rawSec)

    timeStampArr[2] = rawSec
    timeStampArr[1] = rawMin / 60
    timeStampArr[0] = rawHour / 3600

    stampsAndString = [
        timeStampArr, 
        timeStampArr[0] % 12 + ":" + 
        appendZero(timeStampArr[1]) + ":" + 
        appendZero(timeStampArr[2])
    ]

    return stampsAndString
}

function trimTimeStamp(str, val) {
    return str.substring((str.length - val), str.length)
}

console.log(timeStampToSec('09:40:53'))
console.log(secToTimeStamp(34853))

function appendZero(n) {
    n = String(n)
    
    if (n.length < 2) {
        return "0" + n
    } else {
        return n
    }
}

displayTime()
timeLoop = setInterval(displayTime, 999)

function toggleFullscreen(elementId) {
    thisElement = document.getElementById(elementId)
    
    if (thisElement.classList.contains('full-screen')) {
        thisElement.classList.remove('full-screen')
    } else {
        thisElement.classList.add('full-screen')
    }
}

function toggleTimerDirection() {
    if (timerDirection === 1) {
        timerDirection = -1
        timerDirectionBtn.innerText = 'down from'
    } else {
        timerDirection = 1
        timerDirectionBtn.innerText = 'up to'
    }
}

function toggleTimerTarget() {
    if (timerTarget == 'amount') {
        timerTarget = 'time-of-day'
        timerTargetBtn.innerText = 'time of day'

        const date = new Date
        const minutes = date.getMinutes()
        const hours = date.getHours()
        const buffer = 25
        const combined = (hours * 60 + minutes + buffer) - ((hours * 60 + minutes + buffer) % 5)
        const newMinutes = combined % 60
        const newHours = appendZero((combined - newMinutes) / 60)
        
        console.log(newHours, newMinutes)

        timeInput.value =   appendZero(newHours.toString()) + ':' + 
                            appendZero(newMinutes.toString())

        timeDaySet.classList.remove('hide')
        timeAmountSet.classList.add('hide')
    } else {
        timerTarget = 'amount'
        timerTargetBtn.innerText = 'amount of time'

        timeDaySet.classList.add('hide')
        timeAmountSet.classList.remove('hide')
    }
}

function initiateTimer() {
    const date = new Date
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()    
    const nowRawSec = timeStampToSec(hours+":"+minutes+":"+seconds)

    let rawSecDifference
    let futureRawSec
    let stampLength
    let targetTime = []
    let newTimerDict = {}
    
    if (timerTarget == 'amount') {
        rawSecDifference = timeStampToSec(pickHours.value + ":" + pickMinutes.value + ":00")

        console.log(nowRawSec, rawSecDifference)
        futureRawSec = nowRawSec + rawSecDifference

        targetTime.push(Math.floor((futureRawSec)/3600))
        targetTime.push(Math.floor((futureRawSec % 3600)/60))
        targetTime.push(seconds)
    } else {
        userPickTimeStamp = timeInput.value + ':00'
        futureRawSec = timeStampToSec(userPickTimeStamp)

        rawSecDifference = futureRawSec - nowRawSec
        console.log(futureRawSec, rawSecDifference)
    }

    if (rawSecDifference >= 3600) {
        stampLength = 7
    } else if (rawSecDifference >= 600) {
        stampLength = 5
    } else if (rawSecDifference >= 60) {
        stampLength = 4
    }

    newTimerDict.timer_id = timerCount
    newTimerDict.active = !(timerTarget == 'amount')
    newTimerDict.loop = false
    newTimerDict.init_length = stampLength
    newTimerDict.count_direction = timerDirection
    newTimerDict.sec_start = nowRawSec
    newTimerDict.sec_end = futureRawSec
    newTimerDict.sec_dur = rawSecDifference
    newTimerDict.sec_now = nowRawSec
    

    timerObjects.push(newTimerDict)

    timerId = 'timer_' + timerCount

    // this builds the timer from template
    // it is called only once and populates no time values, since the updateTimers() function will take care of that


    const newTimer = timerTemplate.content.cloneNode(true).children[0]
    const xButton = newTimer.querySelector("[timer-x]")
    const timerStart = newTimer.querySelector("[timer-start]")
    const timerPlause = newTimer.querySelector("[timer-plause]")
    const timerReset = newTimer.querySelector("[timer-reset]")
    const timerHead = newTimer.querySelector("[timer-header]")
    const timerFullscreen = newTimer.querySelector("[timer-fullscreen]")

    newTimer.setAttribute("id", "timer_" + timerCount)
    newTimer.style.background = 'hsla(' + Math.floor(Math.random() *250)+',100%,75%,0.8)'
    xButton.setAttribute("onclick", "deleteTimer(" + timerCount + ")")
    timerStart.innerText = hours % 12 + ":" + appendZero(minutes) + ":" + appendZero(seconds)
    timerPlause.setAttribute("onclick", "plauseTimer(" + timerCount +")")
    timerReset.setAttribute("onclick", "resetTimer(" + timerCount +")")
    timerFullscreen.setAttribute("onclick", "toggleFullscreen('timer_" + timerCount +"')")
    timerHead.innerText = timerName.value


    timerCount++
    timerLayer.append(newTimer)
    dragResizeInit(newTimer)
    
    updateTimers(timerObjects)
}

function deleteTimer(n) {
    console.log(n)
    thisTimer = document.getElementById("timer_" + n)
    thisTimer.remove()
}

let newCounter

function plauseTimer(n) {
    timerObjects.forEach(timer => {
        if (timer.timer_id == n) {
            timer.active = !timer.active
        }
    })
}

function resetTimer(n) {
    timerObjects.forEach(timer => {
        if (timer.timer_id == n) {
            timer.active = false

            timer.sec_start = timer.sec_now
            timer.sec_end = timer.sec_start + timer.sec_dur
            
            updateTimers(timerObjects)
        }
    })
}

function countDown(element) {
    timeArr = element.innerText.split(':')
    rawSec =    parseInt(timeArr[timeArr.length - 1]) + 
                parseInt(timeArr[timeArr.length - 2] * 60)
    newSec = rawSec - 1
    newStr = Math.floor(newSec/60) + ":" + appendZero(newSec % 60)
    element.innerText = newStr
    // console.log(timeArr, rawSec, newSec)
}

function encloseDesks(deskElementArr) {
    firstElement = deskElementArr[0].getBoundingClientRect()
    
    let minX = firstElement.x
    let minY = firstElement.y

    let maxX = 0
    let maxY = 0

    deskElementArr.forEach(element => {
        rect = element.getBoundingClientRect()
        
        minX = Math.min(minX, rect.x)
        minY = Math.min(minY, rect.y)

        maxX = Math.max(maxX, rect.x + rect.width)
        maxY = Math.max(maxY, rect.y + rect.height)
        
        // console.log(minX, minY, maxX, maxY)
    })

    // sampleMargin = gap / 4
    // sampleDiv = document.createElement('div')
    // sampleDiv.style.position = 'fixed'
    // sampleDiv.style.top = minY - sampleMargin + 'px'
    // sampleDiv.style.left = minX - sampleMargin + 'px'
    // sampleDiv.style.width = maxX - minX + 2 * sampleMargin + 'px'
    // sampleDiv.style.height = maxY - minY + 2 * sampleMargin + 'px'
    // sampleDiv.style.borderRadius = '5px'
    // sampleDiv.style.background = 'rgba(64, 224, 208, 0.5)'

    // timerLayer.append(sampleDiv)
    return [minX, minY, maxX, maxY]
}
