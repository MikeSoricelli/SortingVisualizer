import './App.css';
import {useState} from 'react'
import Column from './components/Column'



//global size and animation array
let size = 10
const animations = []


function App() {

  const [MainArray, setArray] = useState(InitArray(size))

  return (
    <div>
      <div className = "ColumnWrapper">
        <div className = "ColumnGrid">
          {MainArray.map((element) => {
            return <Column value = {element} className = "Column"></Column>
          })}
        </div>
      </div>
      <div className= "navbar">
        <button onClick = {Reset}>reset</button>
        <button onClick = {SelectionSortAnimation}>SelectionSort</button>
        <button onClick = {MergeSortAnimation}>MergeSort</button>
        <button onClick = {() => AdjustSize(1)}>+ size</button>
        <button onClick = {() => AdjustSize(-1)}>- size</button>
      </div>
    </div>
  );

  //Functions

  function Reset() 
  {
    window.location.reload(); 
  }

  function InitArray(size) {
    let array = new Array(size)
    for (let i = 0; i < size; i++) {
      array[i] = randIntFromInterval(100, 300 )
    }
    return array
  }

  function AdjustSize(num) {
    if (num === 1 && size < 41) {
      size = size + num
      let newArray = [... MainArray]
      newArray[size - 1] = randIntFromInterval(100, 300)
      const Columns = document.getElementsByClassName("ColumnGrid")[0].style
      console.log(Columns)
      Columns.gridTemplateColumns = `repeat(${size}, 1fr)`
      if (size === 20) {
        Columns.gridGap = "10px"
      }
      setArray(newArray)
    }
    else if (num === -1 && size > 4) {
      size = size + num
      let newArray = MainArray.splice(0, size)
      const Columns = document.getElementsByClassName("ColumnGrid")[0].style
      Columns.gridTemplateColumns = `repeat(${size}, 1fr)`
      if (size === 19) {
        Columns.gridGap = "25px"
      }
      setArray(newArray)
    }  
  }

  //perform selection sort on array and build animation array
  function SelectionSort(array) {

  for (let i = 0; i < array.length; i++) {
    let min = i
    animations.push({mode: "scan", min: min})

    //scan through array and compare each element with current min
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[min]) {
        min = j
        //track new min in animation array
        animations.push({mode: "min", min: min}) 
      }
      else {
        //track scan in animation array
        animations.push({mode: "scan", min: j})
      }
    }
    //track swap of array elements
    animations.push({mode: "swap", x: i, y: min, heightX: array[i], heightY : array[min]})
    let minVal = array[min]
    array[min] = array[i]
    array[i] = minVal
    }
  }

  //perform merge sort on array and build animation array
  function MergeSort(array, index) {
    let mid = Math.floor(array.length / 2)
    if (array.length === 1) { //base case
      return array
    }
    //divide array into left and right and recursively merge
    let arrayLeft = MergeSort(array.slice(0, mid), index)
    let arrayRight = MergeSort(array.slice(mid, array.length), index + mid)

    let newArray = []
    let LeftIndex = 0
    let RightIndex = 0

    //sort by merging the left and right arrays
    for (let i = 0; i < arrayRight.length + arrayLeft.length; i ++) {
      if (LeftIndex === arrayLeft.length) {
        newArray[i] = arrayRight[RightIndex]
        //track merge sort in animation
        animations.push({index: i + index, value: newArray[i]})
        RightIndex++
      }
      else if (RightIndex === arrayRight.length) {
        newArray[i] = arrayLeft[LeftIndex]
        //track merge sort in animation
        animations.push({index: i + index, value: newArray[i]})
        LeftIndex++
      }
      else if (arrayLeft[LeftIndex] < arrayRight[RightIndex]) {
        newArray[i] = arrayLeft[LeftIndex]
        //track merge sort in animation
        animations.push({index: i + index, value: newArray[i]})
        LeftIndex++
      }
      else {
        newArray[i] = arrayRight[RightIndex]
        //track merge sort in animation
        animations.push({index: i + index, value: newArray[i]})
        RightIndex++
      }
    }
    return newArray
  }

  //scan through animation array and perform style changes
  function SelectionSortAnimation() {
    const Elements = document.getElementsByClassName("Column")
    const Text = document.getElementsByClassName("ColumnText")
    SelectionSort(MainArray)
    console.log(animations)
    for (let i = 0; i < animations.length; i++) {
      //if mode is scan set element in animation to green color for 90ms
      if (animations[i].mode === "scan") {
        let ElementStyle = Elements[animations[i].min].style
        setTimeout(() => {
        ElementStyle.backgroundColor = 'green'
        }, i * 100)
        setTimeout(() => {
        ElementStyle.backgroundColor = 'black'
        }, i * 100 + 90)
      }
      //if mode is min set element in animation object to red color for 90ms
      else if (animations[i].mode === "min") {
        let ElementStyle = Elements[animations[i].min].style
        setTimeout(() => {
        ElementStyle.backgroundColor = 'red'
        }, i * 100)
        setTimeout(() => {
        ElementStyle.backgroundColor = 'black'
        }, i * 100 + 90)
      }
      //if mode is swap, swap text and style of elements in animation object to peform array swap
      else if (animations[i].mode === "swap") {
        let Element1Text = Text[animations[i].x]
        let Element2Text = Text[animations[i].y]
        let Element1Style = Elements[animations[i].x].style
        let Element2Style = Elements[animations[i].y].style
        setTimeout(() => {
        Element1Style.height = `${animations[i].heightY * 2  }px`
        Element2Style.height = `${animations[i].heightX * 2}px`
        let updatedTextColumnY = Element1Text.innerHTML
        Element1Text.innerHTML = Element2Text.innerHTML
        Element2Text.innerHTML = updatedTextColumnY
        console.log(Element1Text)
        }, i * 100)
      }
    }
    setTimeout(() => {
      animations.splice(0, animations.length)
    }, animations.length * 100)

    //alter navbar
    document.getElementsByClassName("navbar")[0].innerHTML = '<button>reset</button>'
    document.querySelector('button').onclick = Reset
  }

  function MergeSortAnimation() {
    const Elements = document.getElementsByClassName("Column")
    const Text = document.getElementsByClassName("ColumnText")
    MergeSort(MainArray, 0)
    //loop through animations array and change text and style for element index in animation object
    for (let i = 0; i < animations.length; i++) {
        let ElementText = Text[animations[i].index]
        let ElementStyle = Elements[animations[i].index].style
        setTimeout(() => {
        ElementStyle.height = `${animations[i].value * 2}px`
        ElementText.innerHTML = `${animations[i].value}`
        }, i * 100)
    }
    setTimeout(() => {
      animations.splice(0, animations.length)
    }, animations.length * 100)

    //alter navbar
    document.getElementsByClassName("navbar")[0].innerHTML = '<button>reset</button>'
    document.querySelector('button').onclick = Reset
  }
}

function randIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}



export default App;
