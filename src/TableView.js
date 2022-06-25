import Axios from 'axios'
import React, { useState , useEffect, useMemo} from 'react';
import './App.css';
import Table from "./Table";
import { SliderColumnFilter, filterBetween } from "./Filter";
import Modal from 'react-modal';
import {stateObj, getMax, getMin, addCommas} from './Components'


function TableView() {
  //Filtering modal styling parameters
  const customStyles = {
    content: {
      maxHeight: '50%',
      textAlign: 'center'
    },
  };
  //Holder used to hold all of filtering states
  const [stateHolder, setStateHolder] = useState([])
  const [isLoading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false)
  //Holds all data from database
  const [countyList, setCountyList] = useState([]);
  //accessor, min, max, current min, current max
  const [accessVar, setAccessVar]=useState(stateObj('',0,0,0,0))
  const [curRowLength, setCurRowLength] = useState(0)

  //empty useEffecr dependency automatically fetches data from API on load
  useEffect(()=>{
    if (countyList.length < 1) {
    Axios.get('https://freshstart-mysql.herokuapp.com/api/get').then((response)=> {
      setCountyList(response.data)
      //console.log(response.data[1])
      setLoading(false);
    })
  }
  },[])

  //maps initial columns with their min and maxes to an object and pushes them to the state holder array for filtering
  useEffect(()=>{
    if (countyList.length >0) {
      const tmp = []
      const mySet1 = new Set()
      for (const [key,value] of Object.entries(countyList[0])) {
        if (!mySet1.has(key)) {
          mySet1.add(key)
          tmp.push(stateObj(key,getMin(countyList,key),getMax(countyList,key),getMin(countyList,key),getMax(countyList,key)))
          //console.log(tmp)
        }
      }
      setStateHolder(tmp)
      //console.log(stateHolder)
    }
  },[countyList])

  //Displays data currently being filtered within modal
  function getHeader(aVar) {
    let thisHead=""
    columns.forEach(thisCol =>{
      if(thisCol.accessor===aVar.accessor) {
        thisHead=thisCol.Header
      }
    })
    return ("Filtering by " + thisHead)
  }

  //when modal state changes, if it changes to be closed, update holder array to final filter value from modal and store it
  useEffect(()=>{
    if(modalVisible===false) {
      //console.log("trying to update cur vals in holder array")
        let newHolder=[...stateHolder]
        let thisInd=stateHolder.findIndex(x=> x.accessor===accessVar.accessor)
        newHolder[thisInd]=accessVar
        setStateHolder(newHolder)
    }
  },[modalVisible])
  
  //initialize columns for table
  const columns = useMemo(
    () => [
          {
            Header: "County",
            accessor: "county",
          },
          {
            Header: "State",
            accessor: "state",
          },
          {
            Header: "Population",
            accessor: "total_population",
            filter: filterBetween,
            Cell: data => useMemo(() => addCommas(data), [data])

          },
          {
            Header: "Median Household Income",
            accessor: "median_household_income",
            filter: filterBetween,
            Cell: data => useMemo(() => addCommas(data), [data])

          },
          {
            Header: "Average Temperature (°F)",
            accessor: "mean_temp",
            filter: filterBetween,

          },
          {
            Header: "Annual Rainfall (in.)",
            accessor: "rainfall",
            filter: filterBetween,

          },
          {
            Header: "Percent Unemployment",
            accessor: "percent_unemployed_CDC",
            filter: filterBetween,
          },
          {
            Header: "Percent College Graduates",
            accessor: "percent_some_college",
            filter: filterBetween,
          },
          {
            Header: "Volume of Traffic Percentile",
            accessor: "average_traffic_volume_per_meter_of_major_roadways",
            filter: filterBetween,

          },
        ],
    []
  );

//loading animation
if (isLoading){
  return <div className='text-center'>
  <svg role="status" className="inline w-16 h-16 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
</svg>
</div>
}

//render Modal if open and Table with parameters
return (
  <div>
    <div>
      <Modal isOpen={modalVisible} ariaHideApp={false} onRequestClose={() => setModalVisible(false)} style={customStyles}>
      <div className="bg-[url('coolbackgroundbw.png')] absolute inset-0 p-2 flex flex-col justify-center space-y-4">
        <div className="text-white text-center">{getHeader(accessVar)}</div>
        <SliderColumnFilter thisData={accessVar} setAccessVar={setAccessVar}/>
        <div className="text-xl text-white font-extrabold text-center">{curRowLength} counties remaining...</div>
    <button className="text-3xl font-extrabold text-white object-center w-fit align-middle border-2 border-slate-400 rounded-lg bg-slate-600 hover:bg-slate-800" onClick={() =>{
        setModalVisible(false)
        return false
    }}>Close
    </button>
    </div>
      </Modal>
      </div>
      <div>
    <Table columns={columns} data={countyList} setModalVisible={setModalVisible} stateHolder={stateHolder} setAccessVar={setAccessVar} accessVar={accessVar} setCurRowLength={setCurRowLength}/>
    </div>
  </div>
  );
}


export default TableView;

