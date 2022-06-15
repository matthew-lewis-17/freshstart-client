import Axios from 'axios'
import React, { useState , useEffect, useMemo, useRef} from 'react';
import './App.css';
import Table from "./Table";
import { SliderColumnFilter, filterGreaterThan, NoUISliderComponent, filterBetween, ButtonFilter } from "./Filter";
import {Plane} from 'react-loader-spinner'
import Modal from 'react-modal';
import { render } from 'react-dom';
import {stateObj, getMax, getMin} from './Components'


function App() {
  const [stateHolder, setStateHolder] = useState([])
  const [isLoading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false)
  const [countyList, setCountyList] = useState([]);
  const [filterVar, setFilterVar] = useState("");
  const [thisMin, setThisMin]=useState(0)
  const [thisMax, setThisMax]=useState(1)
  const [accessVar, setAccessVar]=useState(stateObj('',0,0,0,0))

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
/*
  useEffect(() => {
    if (modalVisible){
      console.log("modalvis")
      stateHolder.forEach(thisAccess => {
        console.log(thisAccess)
        if (thisAccess.accessor === filterVar) {
          setAccessVar(thisAccess)
        }
      })
    }
  }, [modalVisible])
  */

  
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

          },
          {
            Header: "Median Household Income",
            accessor: "median_household_income",
            Filter: NoUISliderComponent,
            filter: filterBetween,

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
  return <div className="App"> 
  <Plane ariaLabel="loading-indicator" />
  </div>;
}
/*
if (modalVisible && accessVar.originalMax!==0){
  return  (<div> 
  
  <Plane ariaLabel="loading-indicator" />
  <div>{JSON.stringify(accessVar)}</div>
  <SliderColumnFilter thisData={accessVar} setAccessVar={setAccessVar} thisMin={thisMin} thisMax={thisMax} setThisMax={setThisMax} setThisMin={setThisMin}/>
    <div>
  <button onClick={() =>{
    console.log("trying to update cur vals in holder array")
    let newHolder=[...stateHolder]
    let thisInd=stateHolder.findIndex(x=> x.accessor===accessVar.accessor)
    newHolder[thisInd]=accessVar
    setStateHolder(newHolder)
    setModalVisible(false)
    }
    }>swag</button>
  </div>
  </div>);

  }
  */
return (
  <div className="App">
    <button onClick={() => setModalVisible(true)}>Open Modal</button>
    <div>
      <Modal isOpen={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <Plane ariaLabel="loading-indicator" />
        <div>{JSON.stringify(accessVar)}</div>
        <SliderColumnFilter thisData={accessVar} setAccessVar={setAccessVar} thisMin={thisMin} thisMax={thisMax} setThisMax={setThisMax} setThisMin={setThisMin}/>
      <button onClick={() =>{
        console.log("trying to update cur vals in holder array")
        let newHolder=[...stateHolder]
        let thisInd=stateHolder.findIndex(x=> x.accessor===accessVar.accessor)
        newHolder[thisInd]=accessVar
        setStateHolder(newHolder)
        setModalVisible(false)
    }
    }>swag</button>
      </Modal>
      </div>
      <div>
    <Table columns={columns} data={countyList} setModalVisible={setModalVisible} filterVar={filterVar} thisMin={thisMin} thisMax={thisMax} stateHolder={stateHolder} setAccessVar={setAccessVar} accessVar={accessVar} setThisMax={setThisMax} setThisMin={setThisMin}/>
    </div>
  </div>
  );
}


export default App;
