import Axios from 'axios'
import React, { useState , useEffect, useMemo, useRef} from 'react';
import './App.css';
import Table from "./Table";
import { SliderColumnFilter, filterGreaterThan, NoUISliderComponent, filterBetween, ButtonFilter } from "./Filter";
import {Plane} from 'react-loader-spinner'
import Modal from 'react-modal';
import { render } from 'react-dom';
import {stateObj, getMax, getMin, addCommas} from './Components'
import { data } from 'autoprefixer';


function TableView() {
  const customStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.75)'
    },
    content: {
      position: 'absolute',
      top: '300px',
      left: '40px',
      right: '40px',
      bottom: '350px',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '4px',
      outline: 'none',
      padding: '20px'
    }
  };
  const [stateHolder, setStateHolder] = useState([])
  const [isLoading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false)
  const [countyList, setCountyList] = useState([]);
  const [filterVar, setFilterVar] = useState("");
  const [thisMin, setThisMin]=useState(0)
  const [thisMax, setThisMax]=useState(1)
  const [accessVar, setAccessVar]=useState(stateObj('',0,0,0,0))
  const [curRowLength, setCurRowLength] = useState(0)

  useEffect(()=>{
    if (countyList.length < 1) {
    Axios.get('http://localhost:3001/api/get').then((response)=> {
      setCountyList(response.data)
      console.log(response.data[1])
      setLoading(false);
      setFilterVar("")
    })
  }
  },[])

  useEffect(()=>{
    console.log('huh')
    if (countyList.length >0) {
      const tmp = []
      const mySet1 = new Set("id")
      for (const [key,value] of Object.entries(countyList[0])) {
        if (!mySet1.has(key)) {
          mySet1.add(key)
          tmp.push(stateObj(key,getMin(countyList,key),getMax(countyList,key),getMin(countyList,key),getMax(countyList,key)))
          console.log(tmp)
        }
      }
      setStateHolder(tmp)
      console.log(stateHolder)
    }
  },[countyList])

  
  const columns = useMemo(
    () => [
      {
        // first group - TV Show
        Header: "County Data",
        // First group columns
        columns: [
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
            Filter: ButtonFilter,
            filter: filterBetween,
            Cell: data => useMemo(() => addCommas(data), [data])

          },
          {
            Header: "Median Household Income",
            accessor: "median_household_income",
            Filter: NoUISliderComponent,
            filter: filterBetween,
            Cell: data => useMemo(() => addCommas(data), [data])

            //thisMin:minTotalByName(countyList,"median_household_income"),
          },
          {
            Header: "Average Temperature (°F)",
            accessor: "mean_temp",
            Filter: NoUISliderComponent,
            filter: filterBetween,

          },
          {
            Header: "Annual Rainfall (in.)",
            accessor: "rainfall",
            Filter: NoUISliderComponent,
            filter: filterBetween,

          },
          {
            Header: "Volume of Traffic",
            accessor: "average_traffic_volume_per_meter_of_major_roadways",
            Filter: NoUISliderComponent,
            filter: filterBetween,

          },
          {
            Header: "Percent College Graduates",
            accessor: "percent_some_college",
            Filter: NoUISliderComponent,
            filter: filterBetween,
          },
          {
            Header: "Violent Crime Rate",
            accessor: "violent_crime_rate",
            Filter: NoUISliderComponent,
            filter: filterBetween,

          },
        ]
      },
    ],
    []
  );

if (isLoading){
  return <div> 
  <Plane ariaLabel="loading-indicator" />
  </div>;
}

return (
  <div>
    <div>
      <Modal isOpen={modalVisible} onRequestClose={() => setModalVisible(false)} style={customStyles}>
      <div class="bg-[url('coolbackgroundbw.png')] absolute inset-0">
        <div class="text-white">{curRowLength} records remaining...</div>
        <SliderColumnFilter thisData={accessVar} setAccessVar={setAccessVar} thisMin={thisMin} thisMax={thisMax} setThisMax={setThisMax} setThisMin={setThisMin}/>
    
    <a href="#" class="relative inline-flex items-center justify-center inline-block p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 rounded-lg shadow-2xl group" onClick={() =>{
        console.log("trying to update cur vals in holder array")
        let newHolder=[...stateHolder]
        let thisInd=stateHolder.findIndex(x=> x.accessor===accessVar.accessor)
        newHolder[thisInd]=accessVar
        setStateHolder(newHolder)
        setModalVisible(false)
        return false
    }}>
<span class="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-red-500 rounded-full blur-md ease"></span>
<span class="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
<span class="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-purple-500 rounded-full blur-md"></span>
<span class="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-pink-500 rounded-full blur-md"></span>
</span>
<span class="relative text-white">Close</span>
</a>
    </div>
      </Modal>
      </div>
      <div>
    <Table columns={columns} data={countyList} setModalVisible={setModalVisible} filterVar={filterVar} thisMin={thisMin} thisMax={thisMax} stateHolder={stateHolder} setAccessVar={setAccessVar} accessVar={accessVar} setThisMax={setThisMax} setThisMin={setThisMin} setCurRowLength={setCurRowLength}/>
    </div>
  </div>
  );
}


export default TableView;

