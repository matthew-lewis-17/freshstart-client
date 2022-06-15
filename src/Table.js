// Table.js

import React, {useEffect} from "react";
import { Label, Input, Button } from "reactstrap";
import { useSortBy, useTable, usePagination, useFilters, useGlobalFilter, useAsyncDebounce,  } from "react-table";
import { GlobalFilter, DefaultFilterForColumn} from "./Filter";
import Modal from 'react-bootstrap/Modal'
import styled from 'styled-components'
import matchSorter from 'match-sorter'

export default function Table({ columns, data, modalVisible, setModalVisible, filterVar, setFilterVar, thisMin, thisMax, stateHolder, setAccessVar, accessVar}) {
  
  // Use the useTable Hook to send the columns and data to build the table
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    prepareRow,
    pageCount, // Prepare the row (this function needs to be called for each row before getting the row props)
    pageOptions,
    page,
    state: { pageIndex, pageSize, sortBy, filters },
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
    visibleColumns,
    setGlobalFilter,
    preGlobalFilteredRows,
    setFilter,
    filterSet=new Set(['total_population', "median_household_income","mean_temp","rainfall","average_traffic_volume_per_meter_of_major_roadways","percent_some_college","violent_crime_rate"])
  } = useTable({
    columns,
    data,
    defaultColumn: { Filter: DefaultFilterForColumn },
    autoResetFilters: false

  },
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
  

  
  );

  function RenderFilter(colVar) {
    if (filterSet.has(colVar.id)) {
    return <Button variant="primary" onClick={() => {
      stateHolder.forEach(thisAccess => {
        //console.log(thisAccess)
        if (thisAccess.accessor === colVar.id) {
          setAccessVar(thisAccess)
        }
      })
      setModalVisible(true)}}>
      Launch demo modal
    </Button>
    }
  }

  useEffect(() => {
    //console.log("filtervar: ", filterVar)
    // This will now use our custom filter for age
    if (accessVar.accessor!=='') {
      console.log(thisMin)
      console.log(thisMax)
      console.log("accessVaraccessor: ",accessVar.accessor," currentminmax: ",accessVar.currentMin," , ",accessVar.currentMax)
      console.log(filters)
      setFilter(accessVar.accessor, [accessVar.currentMin,accessVar.currentMax])
      /*filterArr.push([accessVar.currentMin,accessVar.currentMax])*/
      //setFilter(accessVar.accessor, filterArr);
    }
    
  }, [accessVar]);

  /* 
    Render the UI for your table
    - react-table doesn't have UI, it's headless. We just need to put the react-table props from the Hooks, and it will do its magic automatically
  */
 
  return (
      <>
      {/* Rendering Global Filter */}
      <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
              filters
            
            },
            null,
            2
          )}
        </code>
      </pre>
      <GlobalFilter
               preGlobalFilteredRows={preGlobalFilteredRows}
               globalFilter={filters.globalFilter}
               setGlobalFilter={setGlobalFilter}
             />
    <table {...getTableProps()}>
    <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  <div>
                    <span {...column.getSortByToggleProps()}>
                      {column.render('Header')}
                      {/* Add a sort direction indicator */}
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                    
                  </div>
                  {/* Render the columns filter UI 
                  <div>m
                      <Button variant="primary" onClick={() => {
                        stateHolder.forEach(thisAccess => {
                          //console.log(thisAccess)
                          if (thisAccess.accessor === column.id) {
                            setAccessVar(thisAccess)
                          }
                        })
                        setModalVisible(true)}}>
                        Launch demo modal
                      </Button>

                  </div>
                      */}
                  <div>
                    {RenderFilter(column)}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
      <tbody {...getTableBodyProps()}>
        {page.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}style={{
                    padding: '10px',
                    border: 'solid 1px gray',
                    background: 'papayawhip',
                  }}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
    <div className="pagination">
    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
      {'<<'}
    </button>{' '}
    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
      {'<'}
    </button>{' '}
    <button onClick={() => nextPage()} disabled={!canNextPage}>
      {'>'}
    </button>{' '}
    <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
      {'>>'}
    </button>{' '}
    <span>
      Page{' '}
      <strong>
        {pageIndex + 1} of {pageOptions.length}
      </strong>{' '}
    </span>
    <span>
      | Go to page:{' '}
      <input
        type="number"
        defaultValue={pageIndex + 1}
        onChange={e => {
          const page = e.target.value ? Number(e.target.value) - 1 : 0
          gotoPage(page)
        }}
        style={{ width: '100px' }}
      />
    </span>{' '}
    <select
      value={pageSize}
      onChange={e => {
        setPageSize(Number(e.target.value))
      }}
    >
      {[10, 20, 30, 40, 50].map(pageSize => (
        <option key={pageSize} value={pageSize}>
          Show {pageSize}
        </option>
      ))}
    </select>
  </div>
  </>
  );
}

