import { React, useMemo, useState } from "react";
import { useAsyncDebounce } from "react-table";
import { Label, Input, Button } from "reactstrap";
import Modal from 'react-bootstrap/Modal'
import ReactDOM from 'react-dom';
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import Slider from "react-slider";
import {stateObj} from './Components'

// Component for Global Filter
export function GlobalFilter({ globalFilter, setGlobalFilter }) {
  const [value, setValue] = useState(globalFilter);

  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div>
      <Label>Search Table: </Label>
      <Input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder=" Enter value "
        className="w-25"
        style={{
          fontSize: "1.1rem",
          margin: "15px",
          display: "inline",
        }}
      />
    </div>
  );
}


// Component for Default Column Filter
export function DefaultFilterForColumn({
  column: {
    filterValue,
    preFilteredRows: { length },
    setFilter,
  },
}) {
  return (
    <Input
      value={filterValue || ""}
      onChange={(e) => {
        // Set undefined to remove the filter entirely
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search ${length} records..`}
      style={{ marginTop: "10px" }}
    />
  );
}



// Component for Custom Select Filter
export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Use preFilteredRows to calculate the options
  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // UI for Multi-Select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function SliderColumnFilter({
  thisData, filterVar, thisMin, thisMax, setThisMin, setThisMax, setAccessVar
}) {
  console.log("slider")
  console.log(thisData)

    return (
      <>
      <div>
          <Slider
        className="horizontal-slider"
        thumbClassName="example-thumb"
        trackClassName="example-track"
        min={thisData.originalMin}
        max={thisData.originalMax}
        defaultValue={[thisData.currentMin, thisData.currentMax]}
        ariaLabel={['Lower thumb', 'Upper thumb']}
        ariaValuetext={state => `Thumb value ${state.valueNow}`}
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        pearling
        onChange={([minValue, maxValue]) =>{
            setAccessVar(stateObj(thisData.accessor,thisData.originalMin,thisData.originalMax,minValue,maxValue))
            setThisMin(minValue)
            setThisMax(maxValue)
          }
        }
      />
      </div>
      </>
  )
    } 

  export function ButtonFilter({
    column: { filterValue=[], setFilter, preFilteredRows, id, thisMin,thisMax,data, setModalVisible },
  }){

  const handleShow = () => setModalVisible(true);
 
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      </>
  );
  }
    
  
  


  export function NoUISliderComponent({
  column: { filterValue=[], setFilter, preFilteredRows, id, thisMin,thisMax,data },
}) {

    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
  
    return (
      <>
      <div>
          <Slider
        className="horizontal-slider"
        thumbClassName="example-thumb"
        trackClassName="example-track"
        min={min}
        max={max}
        defaultValue={[min, max]}
        ariaLabel={['Lower thumb', 'Upper thumb']}
        ariaValuetext={state => `Thumb value ${state.valueNow}`}
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        pearling
        onAfterChange={([minValue, maxValue]) =>setFilter([minValue, maxValue])}
      />
      </div>
      </>
  )
}

  // Define a custom filter filter function!
export function filterGreaterThan(rows, id, filterValue) {
    return rows.filter(row => {
      const rowValue = row.values[id]
      return rowValue >= filterValue
    })
  }

  export function filterBetween(rows, id, filterValue) {
    return rows.filter(row => {
      const rowValue = row.values[id]
      return rowValue >= filterValue[0] && rowValue<=filterValue[1]
    })
  }
  
  // This is an autoRemove method on the filter function that
  // when given the new filter value and returns true, the filter
  // will be automatically removed. Normally this is just an undefined
  // check, but here, we want to remove the filter if it's not a number
  filterGreaterThan.autoRemove = val => typeof val !== 'number'