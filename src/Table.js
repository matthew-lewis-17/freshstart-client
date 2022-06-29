// Table.js
import styled from 'styled-components'
import React, {useEffect} from "react";
import { useSortBy, useTable, usePagination, useFilters, useGlobalFilter, useAsyncDebounce, useExpanded } from "react-table";
import { GlobalFilter, DefaultFilterForColumn} from "./Filter";
import matchSorter from 'match-sorter'


//initialize table wrapper
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
      border-bottom: 1px solid #dedede;
      border-right: 1px solid #dedede;

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

//initialize table with necessary states passed in, as well as necessary hooks
export default function Table({ columns, data, setModalVisible, stateHolder, setAccessVar, accessVar, setCurRowLength}) {
  
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
    filterSet=new Set(['total_population', "median_household_income","mean_temp","rainfall","average_traffic_volume_per_meter_of_major_roadways","percent_some_college","percent_unemployed_CDC"]),
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

//custom function to show filter button and begin filtering process when clicked

  function RenderFilter(colVar) {
    if (filterSet.has(colVar.id)) {
    return <div>
    <button className="w-full rounded-lg border-2 border-black hover:bg-white hover:opacity-40 p-1" onClick={() => {
      stateHolder.forEach(thisAccess => {
        ////console.log(thisAccess)
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

  //set filter when filter is changed
  useEffect(() => {
    if (accessVar.accessor!=='') {
      setFilter(accessVar.accessor, [accessVar.currentMin,accessVar.currentMax])
    }
  }, [accessVar]);

 //render my custom react table
  return (
      <>
      <div className='text-3xl text-black text-center font-extrabold'>Find your new home county!</div>
  <Styles>
  <div className="relative rounded-md border-black">
      <div className="tableWrap">
        

    <table {...getTableProps()}>
    <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} className="font-extrabold sticky top-0">
                    <span {...column.getSortByToggleProps()} >
                    <div className="rounded-lg border-2 border-black hover:bg-white hover:opacity-40 p-1">
                      {column.render('Header')}
                      {/* Add a sort direction indicator */}
                      {column.isSorted
                        ? column.isSortedDesc
                          ? '🔽'
                          : '🔼'
                        : ''}
                        </div>
                    </span>
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
            <tr {...row.getRowProps()} >
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

