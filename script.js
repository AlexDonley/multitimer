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
const classOptions      = document.getElementById('classOptions')
const nameConfig        = document.getElementById('nameConfig')
const configButtons     = document.getElementById('configButtons')
const dotGapSlider      = document.getElementById('dotGapSlider')
const timerLayer        = document.getElementById('timerLayer')
const timeOfDay         = document.getElementById('timeOfDay')
const monthYear         = document.getElementById('monthYear')

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
if (localStorage.getItem("desk_configs")) {
    allConfigs = JSON.parse(localStorage.getItem("desk_configs"))
}

let currentClass
let classIndex = 0
let configIndex = 0

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

function populateDesks(n, w) {
    deskLayer.innerHTML = ''
    
    for (let i = 0; i < n; i++) {
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

// populateDesks(studentCount, 5)


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

            // console.log(newX, initBoxX, (newX+initBoxX))

            //console.log(currentMouseX, initMouseX, newX, currentMouseY, initMouseY, newY)
            elemToDrag.style.left = (newX + initBoxX) + "px";
            elemToDrag.style.top  = (newY + initBoxY) + "px";
            // document.onmousemove
        }

        // stop dragging
        document.onmouseup =()=>  {
            
            // console.log("mouse up")

            document.onmouseup = null;
            document.onmousemove = null;
            elemToDrag.style.cursor = 'grab';
        };
    } // elemToDrag.onmousedown     
} // dragInit

// END OF CODE SNIP

function saveClass() {
    if (nameClass.value) {
        // grab class name, total studen number, and column number from inputs
        currentClass = nameClass.value.toString()
        currentStudentNum = studentNum.value
        currentColumnNum = columnNum.value

        // create default desk layout
        populateDesks(currentStudentNum, currentColumnNum)
        defaultConfig = assignConfigCoords()

        classDict = {
            'class_num': currentClass,
            'num_and_col': [currentStudentNum, currentColumnNum],
            'configs': [{
                'name': 'default',
                'positions': defaultConfig
            }]
        }
        console.log(classDict)

        allConfigs.push(classDict)
        localStorage.setItem("desk_configs", JSON.stringify(allConfigs))

        populateButtons(allConfigs[configIndex].configs)

        // create radio button elements and labels

        let newRadioButton = document.createElement('input')
        newRadioButton.type = 'radio'
        newRadioButton.value = currentClass
        newRadioButton.id = currentClass
        newRadioButton.name = 'class_selection'
        newRadioButton.checked = true
        newRadioButton.onclick = setClassIndex(currentClass)

        let newLabel = document.createElement('label')
        newLabel.for = currentClass
        newLabel.innerText = currentClass

        classOptions.append(newRadioButton)
        classOptions.append(newLabel)
    }
}

function setClassIndex(str) {
    
    for (let i=0; !(allConfigs[i].class_num == str); i++) {
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

        populateButtons(allConfigs[classIndex].configs)

        nameConfig.value = null
    }
}

function populateButtons(configArr) {
    configButtons.innerHTML = ''
    
    n = 0
    configArr.forEach(dict => {
        newButton = document.createElement('button')
        newButton.setAttribute("onclick", "switchConfig(" + n + ")")
        newButton.innerText = dict.name

        configButtons.append(newButton)
        
        n++
    })
}

function switchConfig(n) {
    allDesks = Array.from(document.getElementsByClassName('desk'))
    configIndex = n

    i = 0
    allDesks.forEach(element => {
        
        element.style.left = allConfigs[0].configs[configIndex].positions[i][0] + "px"
        element.style.top  = allConfigs[0].configs[configIndex].positions[i][1] + "px"

        i++
    })
}

function clearConfigs(int) {
    if (int < 0) {
        allConfigs = [];
        localStorage.setItem('desk_configs', allConfigs)
    }
    populateButtons(allConfigs)
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



function displayTime() {
    var date = new Date;
    // date.setTime(result_from_Date_getTime);

    var seconds = date.getSeconds();
    var minutes = date.getMinutes();
    var hour = date.getHours() % 12;

    timeStr =   hour + ":" + 
                appendZero(minutes.toString()) + ":" + 
                appendZero(seconds.toString())

    var weekDay = weekdays[date.getDay()]
    var monthDay = date.getDate()
    var month = months[date.getMonth()]
    var year = date.getFullYear()

    timeOfDay.innerText = timeStr
    monthYear.innerText = weekDay + ", " + month + " " + monthDay + ", " + year
}

function appendZero(n) {
    if (n.length < 2) {
        return "0" + n
    } else {
        return n
    }
}

displayTime()
timeLoop = setInterval(displayTime, 999)

function toggleTimeFullscreen() {
    if (timerLayer.classList.contains('full-screen')) {
        timerLayer.classList.remove('full-screen')
    } else {
        timerLayer.classList.add('full-screen')
    }
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