import { React, useState } from "react";
import { useAsyncDebounce } from "react-table";
import { Input } from "reactstrap";
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
      <Input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder=" search table... "
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


export function SliderColumnFilter({thisData, setAccessVar}) {

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
        renderThumb={(props, state) => <div {...props}>{state.valueNow.toLocaleString()}</div>}
        pearling
        onChange={([minValue, maxValue]) =>{
            setAccessVar(stateObj(thisData.accessor,thisData.originalMin,thisData.originalMax,minValue,maxValue))
          }
        }
      />
      </div>
      </>
  )
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