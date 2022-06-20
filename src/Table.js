// Table.js
import styled from 'styled-components'
import React, {useEffect} from "react";
import { useSortBy, useTable, usePagination, useFilters, useGlobalFilter, useAsyncDebounce, useExpanded } from "react-table";
import { GlobalFilter, DefaultFilterForColumn} from "./Filter";
import matchSorter from 'match-sorter'


const Styles = styled.div`
  /* This is required to make the table full-width */
  display: block;
  max-width: 100%;

  /* This will make the table scrollable when it gets too small */
  .tableWrap {
    display: block;
    max-width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
  }

  table {
    /* Make sure the inner table is always as wide as needed */
    width: 100%;
    border-spacing: 0;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      /* The secret sauce */
      /* Each cell should grow equally */
      width: 1%;
      /* But "collapsed" cells should be as small as possible */
      &.collapse {
        width: 0.0000000001%;
      }

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`

export default function Table({ columns, data, modalVisible, setModalVisible, filterVar, setFilterVar, thisMin, thisMax, stateHolder, setAccessVar, accessVar, setCurRowLength}) {
  
  // Use the useTable Hook to send the columns and data to build the table
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    prepareRow,
    pageCount, // Prepare the row (this function needs to be called for each row before getting the row props)
    pageOptions,
    page,
    rows,
    state: { pageIndex, pageSize, sortBy, filters,  },
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
    setGlobalFilter,
    preGlobalFilteredRows,
    setFilter,
    filterSet=new Set(['total_population', "median_household_income","mean_temp","rainfall","average_traffic_volume_per_meter_of_major_roadways","percent_some_college","violent_crime_rate"]),
  } = useTable({
    columns,
    data,
    defaultColumn: { Filter: DefaultFilterForColumn },
    autoResetFilters: false,


  },
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination
  
  );

  function RenderFilter(colVar) {
    if (filterSet.has(colVar.id)) {
    return <div>
    <button class="w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={() => {
      stateHolder.forEach(thisAccess => {
        //console.log(thisAccess)
        if (thisAccess.accessor === colVar.id) {
          setAccessVar(thisAccess)
        }
      })
      setModalVisible(true)}}>
        Filter
    </button>
    </div>
    }
  }


  useEffect(() => {
    //keep count of rows up to date
    setCurRowLength(rows.length)
  }, [rows])

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
      {/* Rendering Global Filter 
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
      */}
      <GlobalFilter
               preGlobalFilteredRows={preGlobalFilteredRows}
               globalFilter={filters.globalFilter}
               setGlobalFilter={setGlobalFilter}
             />
  <Styles>
      <div className="tableWrap">
        <div class="relative">

    <table {...getTableProps()}>
    <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} class="font-extrabold sticky top-0">
                    <span {...column.getSortByToggleProps()} >
                    <div class="rounded-lg border-2 border-slate-600 hover:bg-white hover:opacity-40 p-1">
                      {column.render('Header')}
                      {/* Add a sort direction indicator */}
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                        </div>
                    </span>
                    
                  
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
           
                    {RenderFilter(column)}
             
                </th>
              ))}
            </tr>
          ))}
        </thead>
      <tbody {...getTableBodyProps()}>
        {page.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} class="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700 opacity-80 hover:opacity-100">
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")} </td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
    </div>
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
  </div>
  </Styles>
  </>
  );
}

